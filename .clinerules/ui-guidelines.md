## Brief overview
- Project UI and component guidelines for the virgin_fund frontend.
- Purpose: ensure consistent, accessible, and maintainable UI across Next.js + Tailwind + shadcn/Radix components.

## Design system & libraries
- Primary styling: Tailwind CSS (utility-first).
- Component libraries: prefer shadcn/ui or Radix UI primitives for accessible building blocks.
- Keep visual tokens (colors, spacing, fonts) centralized in Tailwind config and theme provider.
- Avoid ad-hoc CSS-in-JS; use Tailwind + small localized CSS modules only when necessary.

## Accessibility & responsiveness
- All interactive elements must include ARIA attributes as appropriate.
- Buttons and form controls must have visible focus states.
- Ensure pages are responsive and usable on mobile first.
- Test components with keyboard navigation and basic screen-reader flows.

## Component conventions
- Small, focused components (single responsibility).
- Prefer composition over deep prop trees; expose slot/children where sensible.
- File naming: kebab-case for component filenames (e.g., `user-avatar.tsx`).
- Types: TypeScript for all components; export explicit prop interfaces and defaultProps where applicable.

## State & data fetching
- Use React hooks and Context for shared state. Avoid Redux unless explicitly required.
- Fetching: use server components or lightweight client hooks depending on data freshness needs.
- Keep optimistic UI and loading states explicit; show skeletons rather than empty content.

## Styling & CSS rules
- Keep Tailwind classes readable using small helper functions / classnames where needed.
- Avoid long inline class strings in complex components — break into small style helpers.
- Prefer semantic HTML and minimal DOM nesting for performance.

## Testing & visual regression
- Unit-test critical UI logic with Vitest and React Testing Library.
- Use Storybook (if present) or stories for manual/visual tests; consider snapshot or visual regression for key screens.
- Test accessible states (disabled, error, focus) in unit tests.

## Documentation & examples
- Add short examples/usage comments at top of new components.
- Document public components in `components.json` or README where the repo tracks components.
- When adding new UI flows, add a short note in PROGRESS.md including screenshots or Storybook link.

## Communication & PR expectations
- PRs that change UI should include:
  - Screenshots of visual changes (desktop/mobile)
  - Accessibility notes if applicable
  - Any new Tailwind tokens or config changes
- Keep PR size reasonable; prefer smaller incremental UI changes.
