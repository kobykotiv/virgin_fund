"use client";

import React, { useMemo, useState } from "react";
import TickerCard, { TickerCardProps } from "./TickerCard";

export interface TickerCardGridProps {
  items: TickerCardProps[];
  columns?: number;
}

export default function TickerCardGrid({ items, columns = 4 }: TickerCardGridProps) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"change" | "volume" | "price">("change");
  const [direction, setDirection] = useState<"desc" | "asc">("desc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = items.filter((it) => !q || it.symbol.toLowerCase().includes(q) || (it.name || "").toLowerCase().includes(q));

    arr = arr.sort((a, b) => {
      const dir = direction === "asc" ? 1 : -1;
      if (sortBy === "change") return dir * (a.change - b.change);
      if (sortBy === "volume") return dir * ((a.volume || 0) - (b.volume || 0));
      return dir * (a.price - b.price);
    });

    return arr;
  }, [items, query, sortBy, direction]);

  const colsClass = `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-4`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search symbol or name"
          className="input input-sm rounded-md px-3 py-1 border"
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="input input-sm rounded-md px-2 py-1 border">
          <option value="change">Change</option>
          <option value="volume">Volume</option>
          <option value="price">Price</option>
        </select>
        <button onClick={() => setDirection((d) => (d === "asc" ? "desc" : "asc"))} className="btn btn-sm">
          {direction === "asc" ? "Asc" : "Desc"}
        </button>
      </div>

      <div className={colsClass}>
        {filtered.map((t) => (
          <TickerCard key={t.symbol} {...t} />
        ))}
      </div>
    </div>
  );
}
