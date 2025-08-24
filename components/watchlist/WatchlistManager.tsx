import React, { useState } from "react";
import { useWatchlists, useCreateWatchlist, useCreateAlert } from "@/hooks/useWatchlists";

export default function WatchlistManager() {
  const { data: lists, isLoading } = useWatchlists();
  const create = useCreateWatchlist();
  const createAlert = useCreateAlert();
  const [name, setName] = useState("");
  const [symbolByList, setSymbolByList] = useState<Record<string, string>>({});
  const [alertPriceByList, setAlertPriceByList] = useState<Record<string, string>>({});

  const handleCreate = async () => {
    if (!name) return;
    await create.mutateAsync({ name, items: [] });
    setName("");
  };

  const handleAddSymbol = async (listId: string) => {
    const sym = (symbolByList[listId] || "").trim().toUpperCase();
    if (!sym) return;
    // naive optimistic update: call RPC via supabase from hook later; here just call update mutate
    // re-fetch handled by useWatchlists invalidate in create hook
    // we directly call supabase to patch the items array (small helper)
    const res = await fetch(`/api/watchlists/${listId}/add`, { method: 'POST', body: JSON.stringify({ symbol: sym }) });
    if (res.ok) {
      setSymbolByList(prev => ({ ...prev, [listId]: '' }));
    }
  };

  const handleCreateAlert = async (listId: string) => {
    const price = Number(alertPriceByList[listId]);
    const sym = (symbolByList[listId] || "").trim().toUpperCase();
    if (!sym || Number.isNaN(price)) return;
    await createAlert.mutateAsync({ user_id: null, watchlist_id: listId, condition: { symbol: sym, op: '<=', price }, method: 'in_app' });
    setAlertPriceByList(prev => ({ ...prev, [listId]: '' }));
  };

  return (
    <div className="p-4 bg-card rounded">
      <h3 className="text-lg font-semibold">Watchlists</h3>
      <div className="mt-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New watchlist name" className="input input-bordered w-full" />
        <button onClick={handleCreate} className="btn btn-primary mt-2">Create</button>
      </div>
      <div className="mt-4">
        {isLoading ? <div>Loading...</div> : (
          <ul className="space-y-3">
            {lists?.map((l: any) => (
              <li key={l.id} className="p-3 border rounded">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{l.name}</div>
                  <div className="text-sm text-muted">{l.items?.length ?? 0} items</div>
                </div>
                <div className="mt-2">
                  <div className="flex gap-2">
                    <input value={symbolByList[l.id] || ''} onChange={(e) => setSymbolByList(prev => ({ ...prev, [l.id]: e.target.value }))} placeholder="Add symbol (e.g. AAPL)" className="input input-sm flex-1" />
                    <button onClick={() => handleAddSymbol(l.id)} className="btn btn-sm">Add</button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input value={alertPriceByList[l.id] || ''} onChange={(e) => setAlertPriceByList(prev => ({ ...prev, [l.id]: e.target.value }))} placeholder="Alert price (<=)" className="input input-sm" />
                    <button onClick={() => handleCreateAlert(l.id)} className="btn btn-sm">Create Alert</button>
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  {Array.isArray(l.items) && l.items.slice(0,8).map((s:string)=> <span key={s} className="inline-block mr-2 px-2 py-1 bg-muted/10 rounded">{s}</span>)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
