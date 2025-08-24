"use client";

import React, { useMemo, useState } from "react";
import { useDesigns, useTemplates } from "@/hooks/useCmsItems";

export default function ProductCreator() {
  const [designId, setDesignId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  // UI state for typeahead / pagination
  const [designQuery, setDesignQuery] = useState("");
  const [designPage, setDesignPage] = useState(0);
  const [templateQuery, setTemplateQuery] = useState("");
  const [templatePage, setTemplatePage] = useState(0);
  const PAGE_SIZE = 20;

  const { data: designs = [], isLoading: loadingDesigns } = useDesigns();
  const { data: templates = [], isLoading: loadingTemplates } = useTemplates();

  const filteredDesigns = useMemo(() => designs, [designs]);
  const filteredTemplates = useMemo(() => templates, [templates]);

  const create = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ designId, templateId, name, price: price === "" ? null : Number(price) }) });
      const json = await res.json();
      setResult(json);
    } catch (e: any) {
      setResult({ error: e?.message ?? String(e) });
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-2 p-2 border rounded">
      <h3 className="font-semibold">Create Product</h3>

      <label className="block">
        <div className="text-xs">Design</div>
        <input
          placeholder="Search designs..."
          value={designQuery}
          onChange={(e) => { setDesignQuery(e.target.value); setDesignPage(0); }}
          className="input mb-2"
        />
        <div className="border rounded max-h-60 overflow-auto">
          {(() => {
            const matches = (designs ?? []).filter((d: any) => {
              if (!designQuery) return true;
              return (d.name || "").toLowerCase().includes(designQuery.toLowerCase()) || (d?.url || "").toLowerCase().includes(designQuery.toLowerCase());
            });
            const start = designPage * PAGE_SIZE;
            const page = matches.slice(start, start + PAGE_SIZE);
            if (page.length === 0) {
              return <div className="p-2 text-xs text-muted-foreground">No designs found.</div>;
            }
            return (
              <div>
                {page.map((d: any) => (
                  <button
                    key={d.id}
                    onClick={() => setDesignId(d.id)}
                    className={`w-full text-left p-2 flex items-center gap-2 hover:bg-gray-50 ${designId === d.id ? "bg-gray-100" : ""}`}
                  >
                    <div className="w-10 h-10 shrink-0">
                      {d.url ? <img src={d.url} alt={d.name} className="w-10 h-10 object-cover rounded"/> : <div className="w-10 h-10 bg-gray-100 rounded" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">{d.name}</div>
                      <div className="text-xs text-muted-foreground">{d.created_at ? new Date(d.created_at).toLocaleString() : null}</div>
                    </div>
                    {designId === d.id && <div className="text-xs text-blue-600">Selected</div>}
                  </button>
                ))}
                <div className="flex items-center justify-between px-2 py-1 border-t">
                  <button className="text-xs" onClick={() => setDesignPage((p) => Math.max(0, p - 1))} disabled={designPage === 0}>Prev</button>
                  <div className="text-xs">{start + 1}-{Math.min(start + PAGE_SIZE, matches.length)} of {matches.length}</div>
                  <button className="text-xs" onClick={() => setDesignPage((p) => p + 1)} disabled={start + PAGE_SIZE >= matches.length}>Next</button>
                </div>
              </div>
            );
          })()}
        </div>
      </label>

      <label className="block">
        <div className="text-xs">Template</div>
        <input
          placeholder="Search templates..."
          value={templateQuery}
          onChange={(e) => { setTemplateQuery(e.target.value); setTemplatePage(0); }}
          className="input mb-2"
        />
        <div className="border rounded max-h-40 overflow-auto">
          {(() => {
            const matches = (templates ?? []).filter((t: any) => {
              if (!templateQuery) return true;
              return (t.name || "").toLowerCase().includes(templateQuery.toLowerCase());
            });
            const start = templatePage * PAGE_SIZE;
            const page = matches.slice(start, start + PAGE_SIZE);
            if (page.length === 0) {
              return <div className="p-2 text-xs text-muted-foreground">No templates found.</div>;
            }
            return (
              <div>
                {page.map((t: any) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplateId(t.id)}
                    className={`w-full text-left p-2 hover:bg-gray-50 ${templateId === t.id ? "bg-gray-100" : ""}`}
                  >
                    <div className="text-sm">{t.name}</div>
                    {templateId === t.id && <div className="text-xs text-blue-600">Selected</div>}
                  </button>
                ))}
                <div className="flex items-center justify-between px-2 py-1 border-t">
                  <button className="text-xs" onClick={() => setTemplatePage((p) => Math.max(0, p - 1))} disabled={templatePage === 0}>Prev</button>
                  <div className="text-xs">{start + 1}-{Math.min(start + PAGE_SIZE, matches.length)} of {matches.length}</div>
                  <button className="text-xs" onClick={() => setTemplatePage((p) => p + 1)} disabled={start + PAGE_SIZE >= matches.length}>Next</button>
                </div>
              </div>
            );
          })()}
        </div>
      </label>

      <input placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} className="input" />
      <input placeholder="Price" value={price as any} onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))} className="input" />

      <div className="flex gap-2">
        <button className="btn" onClick={create} disabled={loading || !designId || !templateId}>Create</button>
      </div>

      {result && <pre className="text-xs mt-2">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
