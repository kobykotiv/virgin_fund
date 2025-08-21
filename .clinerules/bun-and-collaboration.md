## Brief overview
  - Guidelines for ensuring Bun is used as the package manager and runtime, and for collaborative development with clear user communication. Applies to all development in this project.

## Package management and tooling
  - Always use Bun (`bun install`, `bun add`, `bun run`, etc.) for installing dependencies, running scripts, and managing the project.
  - Do not use npm, pnpm, or yarn for any project operations.
  - If a dependency or script requires a specific tool, prefer a Bun-compatible solution.

## Collaboration and communication
  - If you encounter ambiguity, missing information, or are stuck on a technical or project decision, always ask the user for clarification before proceeding.
  - Avoid making assumptions about user intent or project requirements—explicitly confirm when in doubt.
  - Summarize blockers or questions clearly and concisely when requesting user input.

## Development workflow
  - Document any new dependencies, architectural changes, or workflow updates in the project documentation.
  - Ensure all scripts, tests, and commands are compatible with Bun.

## Other guidelines
  - Keep communication direct and technical, focusing on actionable steps.
  - Regularly check that Bun is being used for all relevant operations.
