"use client"

// BotForm: Modal form for creating or editing a trading bot.
// Uses shadcn/ui Dialog, Form, and React Query mutation hooks.

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateBot, useUpdateBot } from "@/hooks/useBots";
import type { Bot } from "@/types/bot";
import type { CreateBotPayload, UpdateBotPayload } from '@/types/api'

interface BotFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<Bot>;
  mode?: "create" | "edit";
  // optional parent-controlled submit handler. If provided, BotForm will call this
  // and defer mutation/toast/refresh responsibilities to the parent.
  onSubmit?: (payload: CreateBotPayload | UpdateBotPayload) => Promise<any>;
  // optional callback called after a successful create/update (result optional)
  onSuccess?: (result?: any) => void;
}

const STRATEGIES = [
  { value: "basket", label: "Basket" },
  { value: "grid", label: "Grid" },
  { value: "dca", label: "DCA" },
  { value: "indicator", label: "Indicator" },
];

export default function BotForm({ open, onOpenChange, initial, mode = "create", onSubmit, onSuccess }: BotFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [strategy, setStrategy] = useState(initial?.strategy ?? "");
  const [assets, setAssets] = useState((initial?.assets ?? []).join(","));
  const [capital, setCapital] = useState(
    typeof (initial as any)?.allocation === "number"
      ? String((initial as any).allocation)
      : typeof (initial as any)?.capital === "number"
      ? String((initial as any).capital)
      : ""
  );
  const [status, setStatus] = useState(initial?.status ?? "paused");

  const createBot = useCreateBot();
  const updateBot = useUpdateBot();
  const [submitting, setSubmitting] = useState(false);
  // Asset symbol search modal state
  const [showAssetSearch, setShowAssetSearch] = useState(false);
  const [assetQuery, setAssetQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const fetchIdRef = useRef(0);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const suggestionsRef = useRef<HTMLUListElement | null>(null);
  // Simple in-memory cache with optional localStorage persistence.
  const cacheRef = useRef<Map<string, { ts: number; data: any[] }>>(new Map());
  const CACHE_TTL = 1000 * 60 * 5; // 5 minutes
  const CACHE_MAX_ENTRIES = 200;

  // Load cache from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("yahoo_search_cache");
      const parsed = raw ? JSON.parse(raw) : null;
      const map = new Map<string, { ts: number; data: any[] }>();
      if (parsed && typeof parsed === "object") {
        for (const [k, v] of Object.entries(parsed)) {
          if (v && Array.isArray((v as any).data) && typeof (v as any).ts === "number") {
            map.set(k, v as { ts: number; data: any[] });
          }
        }
      }
      cacheRef.current = map;
    } catch (e) {
      cacheRef.current = new Map();
    }
  }, []);

  function saveCacheToStorage() {
    try {
      const obj: Record<string, { ts: number; data: any[] }> = {};
      cacheRef.current?.forEach((v, k) => (obj[k] = v));
      localStorage.setItem("yahoo_search_cache", JSON.stringify(obj));
    } catch (e) {
      // ignore storage errors
    }
  }

  function getCached(query: string) {
    const key = query.trim().toLowerCase();
    const entry = cacheRef.current?.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > CACHE_TTL) {
      cacheRef.current?.delete(key);
      return null;
    }
    return entry.data;
  }

  function setCached(query: string, data: any[]) {
    const key = query.trim().toLowerCase();
    if (!cacheRef.current) cacheRef.current = new Map();
    cacheRef.current.set(key, { ts: Date.now(), data });
    // enforce max size (simple FIFO by insertion order)
    if (cacheRef.current.size > CACHE_MAX_ENTRIES) {
      const it = cacheRef.current.keys();
      const first = it.next().value;
      if (first) cacheRef.current.delete(first);
    }
    saveCacheToStorage();
  }

  function resetForm() {
    setName(initial?.name ?? "");
    setStrategy(initial?.strategy ?? "");
    setAssets((initial?.assets ?? []).join(","));
    setCapital(
      typeof (initial as any)?.allocation === "number"
        ? String((initial as any).allocation)
        : typeof (initial as any)?.capital === "number"
        ? String((initial as any).capital)
        : ""
    );
    setStatus(initial?.status ?? "paused");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: any = {
      name,
      strategy,
      assets: assets.split(",").map((a) => a.trim()).filter(Boolean),
      capital: Number(capital),
      status,
    };

    // If parent supplied onSubmit, call it and let parent handle mutation/toasts/refresh.
    if (onSubmit) {
      setSubmitting(true);
      try {
        const res = await onSubmit(payload);
        onSuccess?.(res);
        onOpenChange(false);
        resetForm();
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Fallback: internal mutations (keeps backward compatibility)
    if (mode === "edit" && initial?.id) {
      const upd: UpdateBotPayload = { id: initial.id, ...payload } as UpdateBotPayload;
      const res = await updateBot.mutateAsync(upd);
      onSuccess?.(res);
    } else {
      const createPayload: CreateBotPayload = payload as CreateBotPayload;
      const res = await createBot.mutateAsync(createPayload);
      onSuccess?.(res);
    }
    onOpenChange(false);
    resetForm();
  }

  function addSymbol(sym: string) {
    const parts = assets.split(",").map((s) => s.trim()).filter(Boolean);
    if (!parts.includes(sym)) parts.push(sym);
    setAssets(parts.join(","));
  }

  // Debounced fetch to Yahoo Finance search endpoint with cache + proxy fallback
  useEffect(() => {
    if (!assetQuery || assetQuery.trim().length < 1) {
      setSuggestions([]);
      return;
    }
    const cached = getCached(assetQuery);
    if (cached) {
      setSuggestions(cached);
      return;
    }

    const id = ++fetchIdRef.current;
    const t = setTimeout(async () => {
      setSuggestLoading(true);
      try {
        const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(assetQuery)}&quotesCount=50&newsCount=0`;
        let res;
        try {
          res = await fetch(url);
        } catch (err) {
          // possible CORS/network error -> try server proxy fallback (you can implement this endpoint)
          try {
            res = await fetch(`/api/proxy/yahoo-search?q=${encodeURIComponent(assetQuery)}`);
          } catch (err2) {
            res = null;
          }
        }

        const json = res ? await res.json().catch(() => ({})) : {};
        const list = json.quotes ?? [];
        if (fetchIdRef.current === id) {
          setSuggestions(list);
          setHighlightIndex(list.length > 0 ? 0 : -1);
        }
        // cache results regardless of source
        try {
          setCached(assetQuery, list);
        } catch (e) {
          // ignore caching errors
        }
      } catch (e) {
        // ignore upper-level errors
      } finally {
        if (fetchIdRef.current === id) setSuggestLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [assetQuery]);

  // Keyboard navigation for suggestions (when asset search modal is open)
  useEffect(() => {
    if (!showAssetSearch) return;

    function onKey(e: KeyboardEvent) {
      if (suggestions.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex((i) => Math.min((i === -1 ? -1 : i) + 1, suggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex((i) => Math.max((i === -1 ? suggestions.length : i) - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const idx = highlightIndex >= 0 ? highlightIndex : 0;
        const s = suggestions[idx];
        if (s && s.symbol) {
          addSymbol(s.symbol);
          setShowAssetSearch(false);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowAssetSearch(false);
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showAssetSearch, suggestions, highlightIndex]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Bot" : "Create Bot"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="bot-name" className="block text-sm font-medium">
            Name
          </label>
          <Input
            id="bot-name"
            placeholder="Bot name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <Select value={strategy} onValueChange={setStrategy}>
            <SelectTrigger>
              <SelectValue placeholder="Select strategy" />
            </SelectTrigger>
            <SelectContent>
              {STRATEGIES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center justify-between">
            <label htmlFor="bot-assets" className="block text-sm font-medium">Assets</label>
            <button type="button" className="text-sm text-blue-600 hover:underline" onClick={() => setShowAssetSearch(true)}>Search symbols</button>
          </div>
          <Input
            id="bot-assets"
            placeholder="Comma-separated symbols (e.g. BTCUSD,ETHUSD)"
            value={assets}
            onChange={e => setAssets(e.target.value)}
            required
          />

          {/* Asset search modal */}
          <Dialog open={showAssetSearch} onOpenChange={(open) => setShowAssetSearch(open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Search ticker symbols</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <Input placeholder="Type symbol or company name" value={assetQuery} onChange={(e) => setAssetQuery(e.target.value)} />
                <div className="max-h-64 overflow-auto">
                  {suggestLoading && <div className="text-sm text-muted-foreground">Loading</div>}
                  {!suggestLoading && suggestions.length === 0 && assetQuery && <div className="text-sm text-muted-foreground">No matches</div>}
                  <ul ref={suggestionsRef} role="listbox" aria-activedescendant={highlightIndex >= 0 ? `asset-suggestion-${highlightIndex}` : undefined}>
                    {suggestions.map((s: any, idx: number) => {
                      const isHighlighted = idx === highlightIndex;
                      return (
                        <li
                          id={`asset-suggestion-${idx}`}
                          key={s.symbol ?? s.exchange ?? idx}
                          role="option"
                          aria-selected={isHighlighted}
                          className={`py-2 border-b flex items-center justify-between cursor-pointer ${isHighlighted ? 'bg-sky-100' : ''}`}
                          onMouseEnter={() => setHighlightIndex(idx)}
                          onMouseLeave={() => setHighlightIndex(-1)}
                          onClick={() => {
                            addSymbol(s.symbol);
                            setShowAssetSearch(false);
                          }}
                        >
                          <div>
                            <div className="font-medium">{s.symbol}</div>
                            <div className="text-xs text-muted-foreground">{s.shortname ?? s.longname ?? s.exchDisp}</div>
                          </div>
                          <div>
                            <button type="button" className="btn btn-sm" onClick={(ev) => { ev.stopPropagation(); addSymbol(s.symbol); setShowAssetSearch(false); }}>Add</button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setShowAssetSearch(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <label htmlFor="bot-capital" className="block text-sm font-medium">
            Capital
          </label>
          <Input
            id="bot-capital"
            type="number"
            placeholder="Capital allocation"
            value={capital}
            onChange={e => setCapital(e.target.value)}
            required
            min={0}
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button
              type="submit"
              disabled={createBot.isPending || updateBot.isPending || submitting}
            >
              {mode === "edit" ? "Save Changes" : "Create Bot"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => { onOpenChange(false); resetForm(); }}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/*
Summary of Changes:
- Created BotForm modal for create/edit bot flows.
- Uses shadcn/ui Dialog, Form, Select, and React Query mutations.
- Fields: name, strategy, assets, capital, status.
- Handles both create and edit modes.
*/
