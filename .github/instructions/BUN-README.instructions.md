Bun usage

This repo uses Bun as the primary JS runtime for local development and typechecking.

Recommended commands (Windows PowerShell):

# Install dependencies with Bun
bun install

# Run TypeScript type-check (no emit)
bun tsc --noEmit

# Start Next.js dev (you can use bun to run scripts)
# (Next.js may require node; if issues occur, run via `node` or `npm`)
bun run dev

Notes:
- If you're on Windows and Bun isn't available system-wide, install Bun from https://bun.sh
- The `package.json` includes `install:bun` and `typecheck` scripts for convenience.
