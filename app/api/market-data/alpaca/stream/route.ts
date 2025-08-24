import type { NextRequest } from "next/server";

// Simple Server-Sent Events (SSE) endpoint that polls our alpaca proxy
// and emits price updates. This is intentionally lightweight for dev use.
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const symbols = url.searchParams.get("symbols") ?? "";
  const symbolList = symbols ? symbols.split(",").map((s) => s.trim()) : [];

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      let closed = false;

      const send = (data: any) => {
        const payload = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      };

      // Send a comment to establish the SSE
      controller.enqueue(encoder.encode(`: sse-initialized\n\n`));

      // Polling loop
      const interval = setInterval(async () => {
        if (closed) return;
        try {
          const res = await fetch(`${url.origin}/api/market-data/alpaca?symbols=${encodeURIComponent(symbolList.join(","))}`);
          if (!res.ok) return;
          const data = await res.json();
          // Normalize to array of { symbol, price }
          const arr = Object.keys(data).map((k) => ({ symbol: k, price: data[k]?.price ?? data[k]?.usd ?? null }));
          send({ type: "prices", payload: arr });
        } catch (e) {
          // send an error event
          send({ type: "error", message: String(e) });
        }
      }, 1000);

  // Keep the stream alive; handle cancellation
      return () => {
        closed = true;
        clearInterval(interval);
        controller.close();
      };
    },
  });

  return new Response(stream, {
    headers: {
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/event-stream",
      // Allow CORS for local dev
      "Access-Control-Allow-Origin": "*",
    },
  });
}
