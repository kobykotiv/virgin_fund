import React, { useState } from "react";
import { useWatchlist } from "@/hooks/useWatchlists";

export default function WatchlistView({ id }: { id?: string }) {
  const { data: list, isLoading } = useWatchlist(id);
  const [symbol, setSymbol] = useState("");

  if (!id) return <div>Select a watchlist</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-card rounded">
      <h3 className="text-lg font-semibold">{list?.name}</h3>
      <div className="mt-3">
        <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Add symbol e.g. BTC" className="input input-bordered" />
        <button className="btn btn-secondary ml-2">Add</button>
      </div>
      <ul className="mt-4">
        {list?.items?.map((it: string) => <li key={it}>{it}</li>)}
      </ul>
    </div>
  );
}
