"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full p-4 border-t mt-8 bg-white">
      <div className="max-w-5xl mx-auto text-center text-sm text-muted-foreground">© {new Date().getFullYear()} Virgin Fund</div>
    </footer>
  );
}
