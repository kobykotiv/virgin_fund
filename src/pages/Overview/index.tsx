// src/pages/Overview/index.tsx

import React from "react"
import { PageWrapper } from "../../components/PageWrapper"
import { useOverviewMetrics } from "../../hooks/useOverviewMetrics"
import { Card } from "../../components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Table, TableHeader, TableRow, TableCell, TableBody } from "../../components/ui/table"

export default function OverviewPage() {
  const { metrics, trend, recent } = useOverviewMetrics()

  return (
    <PageWrapper title="Overview">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => (
          <Card key={m.label} className="p-4 flex flex-col items-center">
            <span className="text-sm text-muted-foreground">{m.label}</span>
            <span className="text-2xl font-bold mt-2">{m.value}</span>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded p-4">
          <h2 className="font-semibold mb-2">Performance Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded p-4">
          <h2 className="font-semibold mb-2">Recent Activity</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.action}</TableCell>
                  <TableCell>{row.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageWrapper>
  )
}
