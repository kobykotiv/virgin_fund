import React, { useEffect, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "@/lib/supabaseClient";
import { AnimatePresence, motion } from "framer-motion";
import { Fade } from "react-awesome-reveal";
import Shapes from "react-awesome-shapes";
import {
  LayoutDashboard,
  Bot as BotIcon,
  GanttChart,
  Wallet,
  TrendingUp,
  Settings,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Edit,
  Trash2,
  Play,
  Pause,
  DollarSign,
  Euro,
  Bitcoin,
} from "lucide-react";

/**
 * Supabase-backed dashboard component.
 *
 * - Uses lib/supabaseClient
 * - Implements basic CRUD for `bots` compatible with the schema in supabase/schema.sql
 * - Uses react-query for caching/invalidation
 *
 * Note: Assumes QueryClientProvider is mounted at app root.
 */

/* ----------------------------- Auth helpers ----------------------------- */

async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data?.user ?? null;
  } catch (e) {
    console.warn("getCurrentUser error", e);
    return null;
  }
}

/* ------------------------------- Hooks -------------------------------- */

function useUser() {
  const [user, setUser] = useState<any | null>(null);
  useEffect(() => {
    let mounted = true;
    getCurrentUser().then((u) => {
      if (mounted) setUser(u);
    });

    // subscribe to auth state changes and refresh user
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      getCurrentUser().then((u) => {
        if (mounted) setUser(u);
      });
    });

    return () => {
      mounted = false;
      try {
        // supabase-js v2 listener shape may differ; attempt to unsubscribe safely
        listener?.subscription?.unsubscribe?.();
        // older shapes:
        listener?.unsubscribe?.();
      } catch (e) {
        // ignore
      }
    };
  }, []);
  return user;
}

import { useBots, useCreateBot, useUpdateBot, useDeleteBot } from "@/hooks/useBots";

/* ------------------------------- UI ----------------------------------- */

const Sidebar: React.FC<{ isOpen: boolean; toggle: () => void; setView: (v: string) => void }> = ({
  isOpen,
  toggle,
  setView,
}) => {
  const nav = [
    { name: "Overview", icon: LayoutDashboard, view: "overview" },
    { name: "Bots", icon: BotIcon, view: "bots" },
    { name: "Strategies", icon: GanttChart, view: "strategies" },
    { name: "Backtesting", icon: TrendingUp, view: "backtesting" },
    { name: "Portfolio", icon: Wallet, view: "portfolio" },
    { name: "Settings", icon: Settings, view: "settings" },
  ];
  return (
    <motion.div
      initial={{ width: 280 }}
      animate={{ width: isOpen ? 280 : 80 }}
      transition={{ duration: 0.18 }}
      className="h-full bg-gray-800 flex flex-col p-4 shadow z-20"
    >
      <div className="flex items-center justify-between mb-6">
        {isOpen && <h1 className="text-lg font-bold">Supabase Trader</h1>}
        <button onClick={toggle} className="p-2 rounded hover:bg-gray-700">
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>
      <nav className="flex-1 space-y-2">
        {nav.map((n) => (
          <button
            key={n.name}
            onClick={() => setView(n.view)}
            className="flex items-center w-full p-3 rounded hover:bg-gray-700"
          >
            <n.icon size={18} />
            {isOpen && <span className="ml-3">{n.name}</span>}
          </button>
        ))}
      </nav>
    </motion.div>
  );
};

const Header: React.FC<{ balances: { usd: number; eur: number; btc: number; eth: number } }> = ({ balances }) => (
  <header className="h-16 bg-gray-900 flex items-center justify-between px-6">
    <div className="flex items-center gap-3">
      <div className="flex items-center bg-gray-800 px-3 py-1 rounded">
        <DollarSign size={14} className="text-green-400" />
        <span className="ml-2 text-sm">${balances.usd.toFixed(2)}</span>
      </div>
      <div className="flex items-center bg-gray-800 px-3 py-1 rounded">
        <Euro size={14} className="text-blue-400" />
        <span className="ml-2 text-sm">€{balances.eur.toFixed(2)}</span>
      </div>
      <div className="flex items-center bg-gray-800 px-3 py-1 rounded">
        <Bitcoin size={14} className="text-yellow-400" />
        <span className="ml-2 text-sm">{balances.btc.toFixed(4)} BTC</span>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <button className="p-2 rounded hover:bg-gray-800">
        <Bell />
      </button>
      <button className="p-2 rounded hover:bg-gray-800">
        <User />
      </button>
    </div>
  </header>
);

const BotsView: React.FC<{ userId: string | null }> = ({ userId }) => {
  const { data: bots = [], isLoading } = useBots();
  const createBot = useCreateBot();
  const updateBot = useUpdateBot();
  const deleteBot = useDeleteBot();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: "", strategy: "Grid", capital: 1000 });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", strategy: "Grid", capital: 1000 });
    setShowModal(true);
  };
  const openEdit = (b: any) => {
    setEditing(b);
    setForm({ name: b.name, strategy: b.strategy, capital: b.capital || 0 });
    setShowModal(true);
  };

    const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userId) return;
    if (editing) {
      // useUpdateBot expects { id, ...fields } per hooks/useBots.ts
      updateBot.mutate({ id: editing.id, ...form });
    } else {
      const payload = {
        name: form.name,
        strategy: form.strategy,
        capital: form.capital,
        status: "Stopped",
        pnl: 0,
      };
      // server-side will scope to authenticated user; do not send user_id from client
      createBot.mutate(payload);
    }
    setShowModal(false);
  };

    const toggleStatus = (bot: any) => {
    const newStatus = bot.status === "Running" ? "Paused" : "Running";
    // updateBot expects { id, ...fields }
    updateBot.mutate({ id: bot.id, status: newStatus });
  };

    const remove = (id: any) => {
    if (!userId) return;
    if (!confirm("Delete this bot?")) return;
    // useDeleteBot expects just the id string
    deleteBot.mutate(id);
  };

  if (isLoading) return <div className="p-6">Loading bots...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trading Bots</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded">
          <PlusCircle />
          Create Bot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {bots.map((bot: any) => (
            <motion.div
              key={bot.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="bg-gray-800 p-6 rounded hover:shadow-lg hover:-translate-y-1 transition-transform"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{bot.name}</h3>
                  <p className="text-sm text-gray-400">{bot.strategy}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-300">
                <div>
                  Status: <motion.span
                    key={bot.status}
                    initial={{ scale: 0.98, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.18 }}
                    className={`ml-2 px-2 py-1 rounded ${bot.status === "Running" ? "bg-green-600" : "bg-red-600"}`}
                  >
                    {bot.status}
                  </motion.span>
                </div>
                <div>
                  PnL: <span className={`ml-2 ${Number(bot.pnl || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>${Number(bot.pnl || 0).toFixed(2)}</span>
                </div>
                <div>Capital: ${Number(bot.capital || 0).toFixed(2)}</div>
                <div>Last Trade: {bot.last_trade ? new Date(bot.last_trade).toLocaleString() : "N/A"}</div>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => toggleStatus(bot)} className="flex-1 px-3 py-2 rounded bg-gray-700">
                  {bot.status === "Running" ? <><Pause /> Pause</> : <><Play /> Start</>}
                </button>
                <button onClick={() => openEdit(bot)} className="px-3 py-2 rounded bg-yellow-600">
                  <Edit />
                </button>
                <button onClick={() => remove(bot.id)} className="px-3 py-2 rounded bg-red-600">
                  <Trash2 />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gray-800 p-6 rounded w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">{editing ? "Edit Bot" : "Create Bot"}</h3>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded bg-gray-700" required />
              </div>
              <div>
                <label className="block text-sm mb-1">Strategy</label>
                <select value={form.strategy} onChange={(e) => setForm({ ...form, strategy: e.target.value })} className="w-full px-3 py-2 rounded bg-gray-700">
                  <option value="Grid">Grid</option>
                  <option value="Indicators (RSI)">Indicators (RSI)</option>
                  <option value="Moving Average Crossover">Moving Average Crossover</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Capital</label>
                <input type="number" value={form.capital} onChange={(e) => setForm({ ...form, capital: Number(e.target.value) })} className="w-full px-3 py-2 rounded bg-gray-700" min={1} />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600">{editing ? "Update" : "Create"}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const OverviewView: React.FC<{ userId: string | null }> = ({ userId }) => {
  const { data: bots = [] } = useBots();
  const totalPnl = useMemo(() => bots.reduce((s: number, b: any) => s + Number(b.pnl || 0), 0), [bots]);
  const active = bots.filter((b: any) => b.status === "Running").length;
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-sm text-gray-400">Total PnL</div>
          <div className={`text-2xl font-bold ${totalPnl >= 0 ? "text-green-400" : "text-red-400"}`}>${totalPnl.toFixed(2)}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-sm text-gray-400">Active Bots</div>
          <div className="text-2xl font-bold">{active}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-sm text-gray-400">Open Positions</div>
          <div className="text-2xl font-bold">—</div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-sm text-gray-400">Portfolio Value</div>
          <div className="text-2xl font-bold">$—</div>
        </div>
      </div>
    </div>
  );
};

const ViewSwitcher: React.FC<{ view: string; userId: string | null }> = ({ view, userId }) => {
  switch (view) {
    case "bots":
      return <BotsView userId={userId} />;
    case "overview":
    default:
      return <OverviewView userId={userId} />;
  }
};

const DashboardSupabase: React.FC = () => {
  const [view, setView] = useState<string>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = useUser();
  const balances = { usd: 5000, eur: 1000, btc: 0.5, eth: 2 };
  const qc = useQueryClient();

  // realtime subscription to bots, watchlists, and portfolio for current user
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel(`public:realtime:user=${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bots", filter: `user_id=eq.${user.id}` },
        () => {
          try {
            qc.invalidateQueries({ queryKey: ["bots"] });
          } catch (e) {
            // ignore
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "watchlists", filter: `user_id=eq.${user.id}` },
        () => {
          try {
            qc.invalidateQueries({ queryKey: ["watchlists"] });
          } catch (e) {
            // ignore
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "portfolio", filter: `user_id=eq.${user.id}` },
        () => {
          try {
            qc.invalidateQueries({ queryKey: ["portfolio"] });
          } catch (e) {
            // ignore
          }
        }
      )
      .subscribe();

    return () => {
      try {
        channel?.unsubscribe?.();
      } catch (e) {
        // ignore
      }
    };
  }, [qc, user?.id]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen((s) => !s)} setView={setView} />
      <div className="flex-1 flex flex-col">
        <Header balances={balances} />
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              <ViewSwitcher view={view} userId={user?.id ?? null} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardSupabase;
