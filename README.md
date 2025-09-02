# Virgin Fund — Frontend

Node / Setup
- This repository targets Node.js 20.19.0. Use nvm to manage Node versions.
- To switch to the correct Node version:
  - nvm install 20.19.0
  - nvm use 20.19.0
- Quick local setup:
  - npm install
  - npm run dev
- Focused type-check (for signal-builder work):
  - npx tsc -p tsconfig.signal.json --noEmit

CI
- A GitHub Actions workflow will run install, lint, type-check, tests and build. Workflow file will be saved to `.github/workflows/ci-cd.yml`.

Notes
- A `.nvmrc` file at the project root pins the Node version for contributors and CI.
- Use `tsconfig.signal.json` for focused type-checks while performing incremental refactors to avoid unrelated repo noise.
