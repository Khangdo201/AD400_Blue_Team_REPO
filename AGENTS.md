# CareerCompare

React + Vite front end (plain JSX, no TypeScript), tested with Vitest and
React Testing Library, linted with oxlint.

## Commands

- `npm run dev` — dev server
- `npm run test:run` — test suite (once)
- `npm run lint` — oxlint

## Rules

- All UI work in `src/**/*.jsx` and `*.css` must follow
  `UI_CODING_STANDARDS.md` (design tokens, BEM CSS, naming, forms, a11y).
- Visual designs and UX copy rules live in `UI_UX_README.md`.
- The offers API in `api/` verifies Neon Auth JWTs; never expose or commit a
  database connection string or Neon API key.
