// src/components/ui/table.tsx

import React from "react"

export function Table({ children }: { children: React.ReactNode }) {
  return <table className="w-full border rounded">{children}</table>
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="bg-gray-100 dark:bg-muted">{children}</thead>
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr>{children}</tr>
}

export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="py-2 px-3 border-b">{children}</td>
}
