Build a "Signal Builder" module for creating and testing custom trading signals.

UI Requirements:
- Drag-and-drop condition blocks (e.g., "SMA(50) > SMA(200)")
- Logical operators (AND/OR/NOT)
- Parameter selectors (indicator period, price type)
- Preview panel showing where signal triggers historically
- Save/Load signals

Backend:
- Parse conditions into executable strategy code
- Run quick test on historical data to show trigger points
- Store signals in `signals` table with JSON config

Tech:
- Frontend: React + Zustand for builder state, Tailwind, Chart.js
- Backend: Node.js, TypeScript, Prisma ORM
