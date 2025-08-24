"use client";

import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full p-3 border-b bg-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="font-bold">Virgin Fund</div>
        <div className="flex gap-3">
          <a href="/" className="text-sm">Home</a>
          <a href="/market" className="text-sm">Market</a>
          <a href="/app" className="text-sm">Dashboard</a>
        </div>
      </div>
    </nav>
  );
}
