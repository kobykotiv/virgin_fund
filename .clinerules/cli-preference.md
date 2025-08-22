## Brief overview
- Project-wide preference: use PowerShell as the default command-line interface for all developer-facing commands, scripts, and assistant-run CLI operations on this repo.
- Rationale: repository environment (Windows 11) and some existing command behavior (command separators, shell parsing) worked differently across cmd.exe / PowerShell. Standardizing on PowerShell avoids subtle failures and keeps assistant-run commands consistent.

## CLI preference (PowerShell)
- Default shell: PowerShell (Windows PowerShell / PowerShell Core).
- When writing example commands or when the assistant issues execute_command calls, prefer PowerShell-compatible syntax and separators.
  - Example: use `;` or new-line-separated commands, or invoke commands individually in the same terminal session.
  - Prefer explicit full commands rather than shell-specific chaining that may fail in cmd.exe (avoid `&&` in examples unless using an explicit PowerShell-compatible pattern).
- When a command needs to run in a different shell (bash, cmd), state it explicitly and provide the alternate form.

## Package manager & tooling
- Primary package manager: Bun. Use `bun` for installs and scripts in examples:
  - Install dev deps: `bun add -d <package>`
  - Run TypeScript: `bun tsc --noEmit`
- If a package manager other than Bun is required for a specific task, call it out and request explicit approval before running (e.g., `npm install` only with approval).

## Assistant-run command rules
- Assistant must format execute_command calls using PowerShell-friendly commands by default.
- For potentially environment-altering or destructive operations (installing/uninstalling packages, running migrations, modifying files), always set requires_approval="true" in the execute_command call.
- When chaining multiple steps, prefer separate execute_command calls or use PowerShell-compatible chaining (e.g. using `;`) and explicitly explain why chaining is necessary.

## Communication & approvals
- Keep messages concise and technical.
- Before installing new dev tools (TypeScript, test runners, etc.) or running project-wide transforms, the assistant must request a single explicit approval.
- Provide a short checklist (task_progress) with each multi-step tool action so progress is visible.

## Examples & trigger cases
- Use PowerShell when running:
  - Bun installs: `bun add -d typescript`
  - Type check: `bun tsc --noEmit`
  - Dry-run codemod: `node .\scripts\convert-button-variant-to-classname.js`
- If a command previously failed due to shell parsing differences, update the command example to its PowerShell-safe variant and document the reason.

## Other guidelines
- Do not overwrite existing .clinerules files. New rules should be added as distinct markdown files with hyphenated names.
- Keep rule files concise and focused; avoid restating conversation history.
- When the assistant updates code or runs codemods, include task_progress in the tool call and keep the checklist up to date.
