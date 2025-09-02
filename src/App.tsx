import React from "react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

/**
 * App.tsx
 *
 * Single-file scaffolding for Dashboard, Bots, NewBot, BotDetail, EditBot, Backtests,
 * Connections and Settings pages. This keeps initial scaffolding minimal so you can
 * iterate quickly. Replace individual page components with their own files later.
 *
 * Notes:
 * - Uses @tanstack/react-query v5 hooks (useQuery).
 * - Tailwind classes are used for layout + dark mode support.
 * - Framer Motion drives simple entrance/exit animations.
 * - API requests hit /api/* endpoints (assumed provided by Bun server or mocks).
 *
 * Replace with separate files when ready. Plenty of comments included.
 */

/* ---------- Helper fetcher + types ---------- */

/** Minimal types for stubbing. Expand as needed. */
type BotSummary = {
  id: string;
  name: string;
  mode: "paper" | "live" | "sim";
  strategy?: string;
  status?: "running" | "stopped" | "error";
  lastRun?: string;
  pnl?: number;
};

type DashboardPayload = {
  bots: BotSummary[];
  alpacaConnected: boolean;
  aggregatedMetrics?: Record<string, number>;
};

async function fetcher<T>(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

/* ---------- Shared UI components (small) ---------- */

/** BotCard: shows basic bot info and a tiny sparkline placeholder. */
export function BotCard({ bot }: { bot: BotSummary }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{bot.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{bot.mode} • {bot.strategy ?? "—"}</p>
        </div>
        <div className="text-right">
          <div className={`text-xs rounded px-2 py-1 ${bot.status === "running" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"} dark:bg-slate-800 dark:text-slate-200`}>
            {bot.status ?? "stopped"}
          </div>
        </div>
      </div>

      <div className="mt-3">
        {/* Tiny sparkline placeholder: replace with real chart */}
        <div className="h-8 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-700 rounded" />
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
          <span>PnL</span>
          <span className={bot.pnl && bot.pnl > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
            {bot.pnl != null ? `${bot.pnl.toFixed(2)}%` : "—"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/** BotTable: simplified table for the Bots page. */
export function BotTable({ bots }: { bots: BotSummary[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
      <table className="w-full text-left">
        <thead className="bg-slate-50 dark:bg-slate-900">
          <tr>
            <th className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300">Name</th>
            <th className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300">Strategy</th>
            <th className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300">Mode</th>
            <th className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300">Status</th>
            <th className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300">Last run</th>
            <th className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300">PnL</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {bots.map((b) => (
              <motion.tr
                key={b.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="border-t border-slate-100 dark:border-slate-800"
              >
                <td className="px-4 py-3">
                  <Link to={`/bots/${b.id}`} className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {b.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{b.strategy ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{b.mode}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">{b.status ?? "stopped"}</span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{b.lastRun ?? "—"}</td>
                <td className="px-4 py-3 text-sm">{b.pnl != null ? `${b.pnl.toFixed(2)}%` : "—"}</td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Page stubs ---------- */

/** DashboardPage - fetches dashboard payload and shows a grid of BotCards + Alpaca connection widget */
export function DashboardPage() {
  const { data, isLoading, error } = useQuery<DashboardPayload, Error>({
    queryKey: ["dashboard"],
    queryFn: () => fetcher<DashboardPayload>("/api/dashboard"),
  });

  return (
    <div className="p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Overview</h1>
        <div className="text-sm text-slate-600 dark:text-slate-300">Alpaca: <span className={data?.alpacaConnected ? "text-emerald-500" : "text-rose-500"}>{data?.alpacaConnected ? "Connected" : "Disconnected"}</span></div>
      </header>

      <section className="mt-6">
        {isLoading && <div className="text-sm text-slate-500">Loading dashboard…</div>}
        {error && <div className="text-sm text-rose-500">Failed to load dashboard: {error.message}</div>}

        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence initial={false}>
                {data.bots.map((bot) => (
                  <BotCard key={bot.id} bot={bot} />
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-8 bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Aggregated Metrics</h3>
              <pre className="text-xs text-slate-600 dark:text-slate-300 mt-2">{JSON.stringify(data.aggregatedMetrics ?? {}, null, 2)}</pre>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/** BotsPage - table, search, filters, new bot button */
export function BotsPage() {
  const { data, isLoading, error } = useQuery<BotSummary[], Error>({
    queryKey: ["bots"],
    queryFn: () => fetcher<BotSummary[]>("/api/bots"),
  });
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bots</h1>
        <div className="flex items-center gap-2">
          <input placeholder="Search bots" className="px-3 py-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm" />
          <button onClick={() => navigate("/bots/new")} className="bg-emerald-600 text-white px-3 py-2 rounded text-sm">New Bot</button>
        </div>
      </div>

      <section className="mt-6">
        {isLoading && <div className="text-sm text-slate-500">Loading bots…</div>}
        {error && <div className="text-sm text-rose-500">Failed to load bots: {error.message}</div>}
        {data && <BotTable bots={data} />}
      </section>
    </div>
  );
}

/** NewBotPage - simple multi-step local wizard (client-side only) */
export function NewBotPage() {
  const [step, setStep] = React.useState(0);
  const steps = ["Info", "Strategy", "Risk", "Schedule", "Preview"];
  const [form, setForm] = React.useState({
    name: "",
    mode: "paper",
    strategy: "",
    risk: "",
    schedule: "",
  });

  async function submit() {
    // Show loading + POST to /api/bots
    try {
      const res = await fetch("/api/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create bot");
      // success: navigate to new bot detail (assumes API returns created bot with id)
      const payload = await res.json();
      window.location.href = `/bots/${payload.id}`;
    } catch (err) {
      console.error(err);
      // minimal toast placeholder
      alert("Failed to create bot: " + (err as Error).message);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Bot</h1>
      <div className="mt-4">
        <div className="mb-2 text-sm text-slate-500">Step {step + 1} — {steps[step]}</div>
        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={step}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-slate-900 rounded p-4 border border-slate-200 dark:border-slate-800"
            >
              {step === 0 && (
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-300">Name</label>
                  <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} className="mt-1 w-full px-3 py-2 border rounded bg-white dark:bg-slate-800" />
                </div>
              )}
              {step === 1 && (
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-300">Strategy</label>
                  <textarea value={form.strategy} onChange={(e) => setForm((s) => ({ ...s, strategy: e.target.value }))} className="mt-1 w-full px-3 py-2 border rounded bg-white dark:bg-slate-800" />
                </div>
              )}
              {step === 2 && (
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-300">Risk</label>
                  <input value={form.risk} onChange={(e) => setForm((s) => ({ ...s, risk: e.target.value }))} className="mt-1 w-full px-3 py-2 border rounded bg-white dark:bg-slate-800" />
                </div>
              )}
              {step === 3 && (
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-300">Schedule</label>
                  <input value={form.schedule} onChange={(e) => setForm((s) => ({ ...s, schedule: e.target.value }))} className="mt-1 w-full px-3 py-2 border rounded bg-white dark:bg-slate-800" />
                </div>
              )}
              {step === 4 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-800 dark:text-slate-100">Preview</h3>
                  <pre className="mt-2 text-xs text-slate-600 dark:text-slate-300">{JSON.stringify(form, null, 2)}</pre>
                </div>
              )}

              <div className="flex justify-between gap-2 mt-4">
                <button onClick={() => setStep((s) => Math.max(0, s - 1))} className="px-3 py-2 rounded border">Back</button>
                <div className="flex gap-2">
                  {step < steps.length - 1 ? (
                    <button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} className="px-3 py-2 rounded bg-emerald-600 text-white">Next</button>
                  ) : (
                    <button onClick={submit} className="px-3 py-2 rounded bg-emerald-600 text-white">Create Bot</button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** BotDetailPage - dynamic route :id */
export function BotDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery<BotSummary, Error>({
    queryKey: ["bot", id],
    queryFn: () => fetcher<BotSummary>(`/api/bots/${id}`),
    enabled: !!id,
  });

  const [tab, setTab] = React.useState<"overview" | "logs" | "trades" | "settings">("overview");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{data?.name ?? "Bot details"}</h1>
          <div className="text-sm text-slate-500 dark:text-slate-400">{data?.strategy}</div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded border">Start</button>
          <button className="px-3 py-2 rounded border">Stop</button>
          <Link to={`/bots/${id}/edit`} className="px-3 py-2 rounded bg-slate-700 text-white">Edit</Link>
        </div>
      </div>

      <div className="mt-6">
        <nav className="flex gap-2">
          {(["overview", "logs", "trades", "settings"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 rounded ${tab === t ? "bg-emerald-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}>{t}</button>
          ))}
        </nav>

        <div className="mt-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18 }}
              className="bg-white dark:bg-slate-900 rounded p-4 border border-slate-200 dark:border-slate-800"
            >
              {tab === "overview" && <div>Overview - PnL chart placeholder</div>}
              {tab === "logs" && <div>Logs - live streaming placeholder (SSE/WebSocket)</div>}
              {tab === "trades" && <div>Trades table placeholder</div>}
              {tab === "settings" && <pre className="text-xs text-slate-600 dark:text-slate-300">{JSON.stringify(data ?? {}, null, 2)}</pre>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** EditBotPage - reuse NewBotPage form but prefill with data and PUT on submit */
export function EditBotPage() {
  const { id } = useParams();
  const { data, isLoading } = useQuery<BotSummary, Error>({
    queryKey: ["bot", id],
    queryFn: () => fetcher<BotSummary>(`/api/bots/${id}`),
    enabled: !!id,
  });

  // Simple reuse: NewBotPage's UI is independent; here prefill local state and PUT
  const [form, setForm] = React.useState<any>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  async function submit() {
    if (!form) return;
    await fetch(`/api/bots/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    navigate(`/bots/${id}`);
  }

  if (isLoading || !form) return <div className="p-6 text-sm text-slate-500">Loading…</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Edit Bot</h1>
      <div className="mt-4 bg-white dark:bg-slate-900 rounded p-4 border border-slate-200 dark:border-slate-800">
        <label className="block text-sm text-slate-600 dark:text-slate-300">Name</label>
        <input value={form.name} onChange={(e) => setForm((s: any) => ({ ...s, name: e.target.value }))} className="mt-1 w-full px-3 py-2 border rounded bg-white dark:bg-slate-800" />
        <div className="flex gap-2 mt-4">
          <button onClick={() => navigate(`/bots/${id}`)} className="px-3 py-2 rounded border">Cancel</button>
          <button onClick={submit} className="px-3 py-2 rounded bg-emerald-600 text-white">Save</button>
        </div>
      </div>
    </div>
  );
}

/** BacktestsPage - list + run backtest modal placeholder */
export function BacktestsPage() {
  const { data, isLoading } = useQuery<any[], Error>({
    queryKey: ["backtests"],
    queryFn: () => fetcher<any[]>("/api/backtests"),
  });
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Backtests</h1>
        <button onClick={() => setShowModal(true)} className="px-3 py-2 rounded bg-emerald-600 text-white">Run Backtest</button>
      </div>

      <div className="mt-6">
        {isLoading && <div className="text-sm text-slate-500">Loading backtests…</div>}
        {!isLoading && data && data.length === 0 && <div className="text-sm text-slate-500">No backtests yet.</div>}
        {!isLoading && data && data.length > 0 && (
          <div className="space-y-2">
            {data.map((b) => (
              <div key={b.id} className="p-3 border rounded bg-white dark:bg-slate-900">{JSON.stringify(b)}</div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 grid place-items-center bg-black/40">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 rounded p-6 w-[480px] border">
            <h2 className="font-semibold">Run Backtest</h2>
            <div className="mt-4">
              <label className="block text-sm text-slate-600 dark:text-slate-300">Bot</label>
              <select className="mt-1 w-full px-3 py-2 border rounded bg-white dark:bg-slate-800">
                <option>Example Bot</option>
              </select>
              <div className="flex gap-2 mt-4 justify-end">
                <button onClick={() => setShowModal(false)} className="px-3 py-2 rounded border">Cancel</button>
                <button className="px-3 py-2 rounded bg-emerald-600 text-white">Run</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/** ConnectionsPage - shows broker connections and add connection modal */
export function ConnectionsPage() {
  const { data, isLoading } = useQuery<any[], Error>({
    queryKey: ["connections"],
    queryFn: () => fetcher<any[]>("/api/connections"),
  });
  const [showAdd, setShowAdd] = React.useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Connections</h1>
        <button onClick={() => setShowAdd(true)} className="px-3 py-2 rounded bg-emerald-600 text-white">Add Connection</button>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && <div className="text-sm text-slate-500">Loading…</div>}
        {!isLoading && data && data.map((c: any) => (
          <div key={c.id} className="p-4 border rounded bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900 dark:text-slate-100">{c.broker}</div>
                <div className="text-xs text-slate-500 dark:text-slate-300">{c.lastSync}</div>
              </div>
              <div className={c.connected ? "text-emerald-500" : "text-rose-500"}>{c.connected ? "Connected" : "Disconnected"}</div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 grid place-items-center bg-black/40">
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white dark:bg-slate-900 rounded p-6 w-[480px] border">
            <h2 className="font-semibold">Add Connection</h2>
            <div className="mt-4">
              <label className="block text-sm text-slate-600 dark:text-slate-300">API Key</label>
              <input className="mt-1 w-full px-3 py-2 border rounded bg-white dark:bg-slate-800" />
              <label className="block text-sm text-slate-600 dark:text-slate-300 mt-2">Secret</label>
              <input className="mt-1 w-full px-3 py-2 border rounded bg-white dark:bg-slate-800" />
              <div className="flex gap-2 mt-4 justify-end">
                <button onClick={() => setShowAdd(false)} className="px-3 py-2 rounded border">Cancel</button>
                <button className="px-3 py-2 rounded bg-emerald-600 text-white">Save</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/** SettingsPage - fetch + update user settings */
export function SettingsPage() {
  const { data, isLoading } = useQuery<any, Error>({
    queryKey: ["settings"],
    queryFn: () => fetcher<any>("/api/user/settings"),
  });
  const [settings, setSettings] = React.useState<any>(null);

  React.useEffect(() => {
    if (data) setSettings(data);
  }, [data]);

  async function save() {
    await fetch("/api/user/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    alert("Saved");
  }

  if (isLoading || !settings) return <div className="p-6 text-sm text-slate-500">Loading settings…</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="mt-4 bg-white dark:bg-slate-900 p-4 rounded border border-slate-200 dark:border-slate-800">
        <label className="block text-sm text-slate-600 dark:text-slate-300">Email</label>
        <input value={settings.email} onChange={(e) => setSettings((s: any) => ({ ...s, email: e.target.value }))} className="mt-1 w-full px-3 py-2 border rounded bg-white dark:bg-slate-800" />
        <div className="flex gap-2 mt-4 justify-end">
          <button onClick={save} className="px-3 py-2 rounded bg-emerald-600 text-white">Save</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- App router ---------- */

/**
 * Root App - contains router and route list. Consumers should wrap <App /> with
 * @tanstack/react-query's QueryClientProvider in the client entry (src/main.tsx).
 */
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/bots" element={<BotsPage />} />
          <Route path="/bots/new" element={<NewBotPage />} />
          <Route path="/bots/:id" element={<BotDetailPage />} />
          <Route path="/bots/:id/edit" element={<EditBotPage />} />
          <Route path="/backtests" element={<BacktestsPage />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
