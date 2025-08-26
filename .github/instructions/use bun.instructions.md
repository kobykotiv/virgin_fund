applyTo: '**/*.ts'
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

We use Bun as the primary JavaScript runtime and package manager for this repository.

Please follow these conventions when producing files, scripts, or documentation for this project:

- Package manager and runtime
	- Use `bun` commands in examples and npm/yarn equivalents only when necessary for cross-environment clarity.
	- Prefer `bun install` to install dependencies and `bun run <script>` (or `bun <script>` when appropriate) to run scripts.
	- Respect the repository's `bun.lock` file; CI should run `bun install --frozen-lockfile` to ensure repeatable installs.

- Scripts & package.json
	- When adding scripts to `package.json`, include both a descriptive script name and a `bun`-friendly form. Example:
		- "dev": "bun dev"
		- "test": "bun test"

- Shell and platform notes (PowerShell - repository default)
	- The developer environment uses Windows PowerShell; when constructing example terminal commands for documentation or README, format multi-command lines for PowerShell (use `;` to join commands on one line).
	- Example PowerShell-friendly sequences:
		- Install deps then start dev server: `bun install; bun dev`
		- Run tests: `bun test`

- CI / Docker
	- CI pipelines should use Bun images or install Bun before running `bun install --frozen-lockfile` and subsequent commands.
	- When creating Dockerfiles, prefer the official Bun runtime or a minimal Node image only if Bun is not available; ensure `bun.lock` is copied and used.

- When generating code
	- Use Bun-native tooling where it affects behavior (for example, `bun test` runner or ES module handling).
	- Do not assume `node` or `npm` are present on target environments—document fallbacks explicitly.

- Backwards compatibility
	- If adding scripts or CI steps, include short comments explaining why Bun is used and provide an npm/yarn fallback if the change targets external contributors.

These instructions should be used by automated agents and humans as the canonical guidance for using Bun in this repository.


