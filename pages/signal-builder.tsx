'use client'

/**
 * pages/signal-builder.tsx
 *
 * Client page implementing a Signal Builder UI:
 * - Create Signal (react-hook-form + shadcn Form primitives)
 * - Active Signals table (edit / pause / resume / delete)
 * - Signal History with CSV export + mock generation
 *
 * Note: This implementation uses the local useSignals hook for persistence.
 * Data-testid attributes are included for testing.
 */

import React, { useRef } from 'react'
import { useForm } from 'react-hook-form'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from 'components/ui/form'
import { Input } from 'components/ui/input'
import { Textarea } from 'components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from 'components/ui/select'
import { RadioGroup, RadioGroupItem } from 'components/ui/radio-group'
import { Button } from 'components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from 'components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'components/ui/tabs'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from 'components/ui/table'
import { Badge } from 'components/ui/badge'
import { Skeleton } from 'components/ui/skeleton'

import { useSignals } from 'hooks/use-signals'
import type { SignalFormValues, SignalHistoryRow } from 'types/signal'

/**
 * Minimal toast fallback to avoid importing multiple toast variants in this patch.
 * Replace with project useToast hook if preferred.
 */
function showToast(message: string) {
  if (typeof window !== 'undefined') {
    const w = window as unknown as { toastr?: { success: (m: string) => void } }
    if (w.toastr?.success) {
      w.toastr.success(message)
      return
    }
  }
  // lightweight fallback
  // eslint-disable-next-line no-alert
  alert(message)
}

function exportHistoryCSV(rows: SignalHistoryRow[], filename = 'signal-history.csv') {
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return ''
    const s = String(v).replace(/"/g, '""')
    return `"${s}"`
  }

  const headers = ['Timestamp', 'Signal', 'Symbol', 'Value', 'Action']
  const lines = rows.map((r) =>
    [
      new Date(r.triggeredAt).toISOString(),
      r.signalName,
      r.symbol,
      r.triggeredValue ?? '',
      r.actionTaken ?? '',
    ].map(escape).join(',')
  )

  const csv = [headers.map(escape).join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.setAttribute('download', filename)
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** Default form values */
const DEFAULT_VALUES: SignalFormValues = {
  name: '',
  symbol: '',
  conditionType: 'price',
  operator: '>',
  threshold: 0,
  timeWindow: 1,
  description: '',
}

export default function SignalBuilderPage() {
  const nameRef = useRef<HTMLInputElement | null>(null)
  const form = useForm<SignalFormValues>({
    mode: 'onBlur',
    defaultValues: DEFAULT_VALUES,
  })

  const {
    signals,
    history,
    loading,
    createSignal,
    deleteSignal,
    toggleSignalStatus,
    exportCSV,
    generateMockHistory,
  } = useSignals()

  const onSubmit = (values: SignalFormValues) => {
    const created = createSignal({
      ...values,
      // ensure numeric types
      threshold: Number(values.threshold),
      timeWindow: Number(values.timeWindow),
    })
    showToast(`Saved signal "${created.name}"`)
    form.reset(DEFAULT_VALUES)
    if (nameRef.current) nameRef.current.focus()
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Signal Builder</h2>
            <div className="text-sm text-muted-foreground">Manage your trading signals</div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create">
            <TabsList className="mb-4">
              <TabsTrigger value="create">Create Signal</TabsTrigger>
              <TabsTrigger value="active">Active Signals</TabsTrigger>
              <TabsTrigger value="history">Signal History</TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => {
                      const { ref: fieldRef, ...fieldRest } = field
                      return (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              {...fieldRest}
                              ref={(el) => {
                                fieldRef(el)
                                nameRef.current = el
                              }}
                              placeholder="My breakout alert"
                              aria-label="Signal name"
                              data-testid="signal-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symbol</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            placeholder="AAPL"
                            aria-label="Symbol"
                            data-testid="signal-symbol"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="conditionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={String(field.value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="price">Price</SelectItem>
                              <SelectItem value="indicator">Indicator</SelectItem>
                              <SelectItem value="volume">Volume</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="operator"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operator</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(v) => field.onChange(v)}
                            value={String(field.value)}
                            aria-label="Operator"
                          >
                            <div className="flex gap-2">
                              <label className="inline-flex items-center space-x-2">
                                <RadioGroupItem value=">" />
                                <span>{'>'}</span>
                              </label>
                              <label className="inline-flex items-center space-x-2">
                                <RadioGroupItem value="<" />
                                <span>{'<'}</span>
                              </label>
                              <label className="inline-flex items-center space-x-2">
                                <RadioGroupItem value=">=" />
                                <span>{'>='}</span>
                              </label>
                              <label className="inline-flex items-center space-x-2">
                                <RadioGroupItem value="<=" />
                                <span>{'<='}</span>
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="threshold"
                    rules={{ required: 'Threshold is required', min: { value: 0.0000001, message: 'Must be greater than 0' } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Threshold</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="any"
                            placeholder="e.g. 150.00"
                            aria-label="Threshold"
                            data-testid="signal-threshold"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeWindow"
                    rules={{ required: 'Time window is required', min: { value: 1, message: 'Must be at least 1 minute' } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Window (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={1}
                            placeholder="e.g. 60"
                            aria-label="Time window"
                            data-testid="signal-timeWindow"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Add notes about this signal" data-testid="signal-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2 flex justify-end gap-2">
                    <Button type="submit" data-testid="signal-submit">
                      Save Signal
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        form.reset(DEFAULT_VALUES)
                        if (nameRef.current) nameRef.current.focus()
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="active">
              <Card>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-32" />
                  ) : signals.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">No signals yet. Create one to get started.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Symbol</TableHead>
                          <TableHead>Condition</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {signals.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell>{s.name}</TableCell>
                            <TableCell>{s.symbol}</TableCell>
                            <TableCell>
                              {s.operator} {s.threshold}
                            </TableCell>
                            <TableCell>
                              <Badge variant={s.status === 'active' ? 'destructive' : 'secondary'}>{s.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    // simple inline edit: toggle to paused/active
                                    toggleSignalStatus(s.id)
                                    showToast(`Toggled ${s.name}`)
                                  }}
                                  aria-label={`toggle-${s.id}`}
                                  data-testid={`toggle-${s.id}`}
                                >
                                  {s.status === 'active' ? 'Pause' : 'Resume'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    deleteSignal(s.id)
                                    showToast(`Deleted ${s.name}`)
                                  }}
                                  aria-label={`delete-${s.id}`}
                                  data-testid={`delete-${s.id}`}
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="flex w-full justify-end gap-2">
                    <Button
                      onClick={() => {
                        exportCSV(signals, 'active-signals.csv')
                        showToast('Export started')
                      }}
                      data-testid="export-active"
                    >
                      Export CSV
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Signal History</h3>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          generateMockHistory(25)
                          showToast('Generated mock history')
                        }}
                        data-testid="generate-history"
                      >
                        Generate Mock
                      </Button>
                          <Button
                        onClick={() => {
exportHistoryCSV(history, 'signal-history.csv')
                          showToast('Export started')
                        }}
                        data-testid="export-history"
                      >
                        Export CSV
                      </Button>
                    </div>
                  </div>

                  {history.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">No history yet.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Signal</TableHead>
                          <TableHead>Symbol</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.map((r) => (
                          <TableRow key={r.id}>
                            <TableCell>{new Date(r.triggeredAt).toLocaleString()}</TableCell>
                            <TableCell>{r.signalName}</TableCell>
                            <TableCell>{r.symbol}</TableCell>
                            <TableCell>{r.triggeredValue}</TableCell>
                            <TableCell>{r.actionTaken ?? '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">Signals saved locally in your browser (localStorage)</div>
        </CardFooter>
      </Card>
    </div>
  )
}
