# CareerCompare

React + Vite front end, tested with Vitest and React Testing Library.

## Scripts

- `npm run dev` – start the dev server
- `npm test` – run Vitest in watch mode (TDD loop)
- `npm run test:run` – run the test suite once
- `npm run lint` – oxlint
- `npm run build` – production build

## Structure

- `src/theme/theme.js` – color tokens (mirrored as CSS variables in `src/index.css`)
- `src/components/` – `NavBar`, `Hero`, `StepCard` (each with a `*.test.jsx`)
- `src/pages/Dashboard.jsx` – dashboard page composing the components
