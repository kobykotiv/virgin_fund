/**
 * Example Alpaca WebSocket relay
 * - Run as a separate Node process during development to relay Alpaca streaming messages to local WebSocket clients.
 * - Usage:
 *    ALPACA_KEY=... ALPACA_SECRET=... node ./scripts/alpaca-ws-relay.ts
 *
 * Notes:
 * - Install dependencies: npm i ws node-fetch ws --save-dev (if using JS runtime) or use bun.
 * - Relay opens a local WebSocket server on PORT (default 8080).
 * - This is a dev utility. In production prefer a robust relay (dedicated service or serverless with persistent connection).
 */

import WebSocket, { WebSocketServer } from "ws";

const ALPACA_KEY = process.env.ALPACA_KEY || process.env.NEXT_PUBLIC_ALPACA_KEY;
const ALPACA_SECRET = process.env.ALPACA_SECRET || process.env.NEXT_PUBLIC_ALPACA_SECRET;
const ALPACA_WS = process.env.ALPACA_WS_URL ?? "wss://stream.data.alpaca.markets/v2/iex";
const PORT = Number(process.env.ALPACA_RELAY_PORT ?? 8080);

if (!ALPACA_KEY || !ALPACA_SECRET) {
  // eslint-disable-next-line no-console
  console.error("Missing Alpaca keys in env. Set ALPACA_KEY and ALPACA_SECRET.");
  process.exit(1);
}

const wss = new WebSocketServer({ port: PORT }, () => {
  // eslint-disable-next-line no-console
  console.log(`Alpaca relay WebSocket server listening on ws://localhost:${PORT}`);
});

// Connect to Alpaca streaming
function connectToAlpaca(symbols: string[] = []) {
  const ws = new WebSocket(ALPACA_WS);

  ws.on("open", () => {
    console.log("Connected to Alpaca stream — authenticating...");
    ws.send(JSON.stringify({ action: "auth", key: ALPACA_KEY, secret: ALPACA_SECRET }));
    if (symbols.length) {
      // subscribe to trades/quotes for provided symbols
      ws.send(JSON.stringify({ action: "subscribe", trades: symbols, quotes: symbols }));
    } else {
      // Optionally subscribe to a default set, or wait for client to request via HTTP/WS
      ws.send(JSON.stringify({ action: "listen", trades: [], quotes: [] }));
    }
  });

  ws.on("message", (msg) => {
    try {
      const data = msg.toString();
      // Broadcast raw message to connected local clients
      wss.clients.forEach((c) => {
        if (c.readyState === WebSocket.OPEN) c.send(data);
      });
    } catch (err) {
      // ignore
    }
  });

  ws.on("close", () => {
    console.log("Alpaca WS closed, reconnecting in 2s...");
    setTimeout(() => connectToAlpaca(symbols), 2000);
  });

  ws.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error("Alpaca WS error:", err);
    ws.terminate();
  });
}

// Optionally: accept subscription control from connected local clients
wss.on("connection", (socket) => {
  socket.on("message", (m) => {
    try {
      const msg = JSON.parse(m.toString());
      // Example: { type: "subscribe", symbols: ["BTCUSD","ETHUSD"] }
      if (msg?.type === "subscribe" && Array.isArray(msg.symbols)) {
        // For simplicity: restart a connection with new symbols (advanced: manage per-client subs)
        connectToAlpaca(msg.symbols);
      }
    } catch {
      // ignore malformed
    }
  });
});

connectToAlpaca();
