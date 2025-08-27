import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";
import { runBacktest } from "@/lib/backtest/engine";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * POST /api/backtest
 *
 * Request body (JSON):
 * {
 *   symbol: string,
 *   start: string (ISO date),
 *   end: string (ISO date),
 *   initialCapital: number,
 *   dcaAmount: number,
 *   frequency: 'daily' | 'weekly' | 'monthly' | 'manual',
 *   slippagePct?: number,
 *   commission?: number
 * }
 *
 * - Verifies vf_session cookie
 * - Runs runBacktest(params) and returns { timeseries, trades, summary }
 * - Lightweight validation applied; callers should validate on client as well
 */

function parseCookie(header: string | null) {
  if (!header) return {};
  return Object.fromEntries(
    header
      .split(";")
      .map((p) => p.trim())
      .map((p) => {
        const idx = p.indexOf("=");
        if (idx === -1) return [p, ""];
        return [p.slice(0, idx), decodeURIComponent(p.slice(idx + 1))];
      })
  );
}

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookie(cookieHeader);
    const sessionToken = cookies["vf_session"] || cookies["SESSION"] || null;
    const session = await verifySessionToken(sessionToken as string);
    if (!session || (session as any).expired) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({} as any))) as Record<string, any>;

    // Basic validation and defaults
    const symbol = typeof body.symbol === "string" && body.symbol.trim() ? body.symbol.trim() : null;
    const start = typeof body.start === "string" && body.start ? body.start : null;
    const end = typeof body.end === "string" && body.end ? body.end : null;
    const initialCapital = typeof body.initialCapital === "number" ? body.initialCapital : Number(body.initialCapital ?? 0);
    const dcaAmount = typeof body.dcaAmount === "number" ? body.dcaAmount : Number(body.dcaAmount ?? 0);
    const frequency = ["daily", "weekly", "monthly", "manual"].includes(body.frequency) ? body.frequency : "daily";
    const slippagePct = typeof body.slippagePct === "number" ? body.slippagePct : Number(body.slippagePct ?? 0);
    const commission = typeof body.commission === "number" ? body.commission : Number(body.commission ?? 0);

    if (!symbol || !start || !end || !initialCapital || !dcaAmount) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Map to engine params (EngineBacktestParams)
    const params = {
      symbol,
      start,
      end,
      initialCapital,
      dcaAmount,
      frequency,
      slippagePct,
      commission,
    };

    const result = await runBacktest(params as any);

    // Persist the backtest run for the user (lightweight record)
    try {
      const supabase = getSupabaseAdmin();
      const payload = {
        user_id: (session as any).user_id ?? null,
        title: `${params.symbol} backtest ${new Date().toISOString()}`,
        description: `Backtest run via UI`,
        parameters: params,
        results: result,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any;
      await supabase.from('backtests').insert(payload);
    } catch (e) {
      // persist failures shouldn't block returning results
      console.warn('backtest persistence failed', e);
    }

    return NextResponse.json({ result });
  } catch (err) {
    console.error("backtest POST error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
