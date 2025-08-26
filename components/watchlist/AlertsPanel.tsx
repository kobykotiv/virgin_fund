import React, { useState } from "react";
import { useAlerts, useCreateAlert, useUpdateAlert, useDeleteAlert } from "@/hooks/useWatchlists";

export default function AlertsPanel() {
  const { data: alerts, isLoading } = useAlerts();
  const create = useCreateAlert();
  const update = useUpdateAlert();
  const remove = useDeleteAlert();
  const [payload, setPayload] = useState("");

  const handleCreate = async () => {
    if (!payload) return;
    try {
      const parsed = JSON.parse(payload);
      await create.mutateAsync(parsed);
      setPayload("");
    } catch (e) {
      // ignore parse errors for now
    }
  };

  return (
    <div className="p-4 bg-card rounded">
      <h3 className="text-lg font-semibold">Alerts</h3>
      <div className="mt-3">
        <textarea value={payload} onChange={(e) => setPayload(e.target.value)} className="textarea w-full" placeholder='{ "watchlist_id": "...", "condition": { "symbol": "BTC", "op": ">", "value": 60000 } }' />
        <button onClick={handleCreate} className="btn btn-primary mt-2">Create Alert</button>
      </div>
      <div className="mt-4">
        {isLoading ? <div>Loading...</div> : (
          <ul>
            {alerts?.map((a: any) => (
              <li key={a.id} className="py-2 border-b flex items-center justify-between">
                <div>
                  <div className="font-medium">{a.name ?? a.id}</div>
                  <div className="text-sm text-muted">{a.method} - {JSON.stringify(a.condition)}</div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-ghost btn-sm" onClick={() => update.mutateAsync({ id: a.id, changes: { is_active: !a.is_active } })}>{a.is_active ? 'Disable' : 'Enable'}</button>
                  <button className="btn btn-ghost btn-sm text-red-600" onClick={() => remove.mutateAsync(a.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
