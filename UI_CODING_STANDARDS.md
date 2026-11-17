# UI Coding Standards

UI standards for CareerCompare. Visual design comes from `UI_UX_README.md`
and the FigJam board; this document covers implementation.

## Core Principle: Design Tokens + Plain CSS ONLY

- ❌ No Tailwind, shadcn/ui, MUI, styled-components, CSS modules, or inline
  `style={{ }}` for visual styling
- ✅ Custom components from semantic HTML + a colocated `<Name>.css` imported
  at the top of the `.jsx`

## Naming Conventions

| What | Convention | Examples |
| --- | --- | --- |
| Component/page files | PascalCase `.jsx`, matching `.css` + `.test.jsx` | `NavBar.jsx`, `MyOffers.jsx` |
| Plain JS modules | camelCase/lowercase `.js` | `theme.js`, `mockOffers.js` |
| Components | PascalCase, `export default function` | `export default function NavBar(...)` |
| Vars, functions, props | camelCase, descriptive | `selectedOffer`, `activePage` |
| Module constants | `UPPER_SNAKE_CASE` | `NAV_ITEMS`, `FIELDS`, `STEPS` |
| Callback props | `on<Action>` | `onSave`, `onCancel`, `onNavigate` |
| Internal handlers | `handle<Action>` | `handleEdit`, `handleSave` |
| Booleans | Predicate names | `editing`, `addingOffer`, `required` |
| Form/data fields | camelCase, matching the API | `companyName`, `ptoDays`, `workArrangement` |
| CSS blocks | kebab-case, named after component | `offer-form`, `my-offers` |
| CSS elements | BEM `block__element` | `navbar__brand`, `offer-form__grid` |
| CSS modifiers | BEM `block--modifier` | `button--primary`, `button--outline` |
| Custom properties | kebab-case, namespaced | `--color-*`, `--radius-*` |

Tests: `describe` names the unit under test; `it` states behavior as a
sentence.

## Design Tokens

`src/theme/theme.js` is the source of truth; `src/index.css` mirrors it as
custom properties. Keep them in sync — `theme.test.js` pins the values.

- Text: `--color-text` `#321C07`, `--color-text-muted`
- Primary: `--color-primary` `#7AAB8F`, `--color-primary-dark` `#4F7F68`,
  `--color-primary-light` `#C1F1C1`
- Secondary: `--color-secondary-sage` `#9BC3A8`, `--color-secondary-mint`
  `#DFF4E6`
- Accent: `--color-accent-yellow` `#E8C66A` (focus rings, highlights)
- State: `--color-success`, `--color-warning`, `--color-error`, `--color-info`
- Surface: `--color-surface` `#FFF`, `--color-page` `#F8FAF8`,
  `--color-border`
- Radius: `--radius-lg` `2.5rem` (cards), `--radius-md` `0.75rem`
  (buttons/inputs)

Rules:

- Always `var(--color-*)` / `var(--radius-*)` — never hardcode hex in CSS.
- JS that needs a color imports `theme` from `src/theme/theme.js`.
- Never use variables outside this set (leftover template vars like
  `--accent`, `--border` are undefined).

## Component & CSS Conventions

- Reusable UI in `src/components/`, screens in `src/pages/`, each a
  `.jsx` + `.css` + `.test.jsx` trio.
- Components are props-driven: data in via props, actions out via `onX`
  callbacks.
- Style by class only — no element or ID selectors. `rem` units only.
- Responsive `@media` rules go in the component's own `.css`, mobile-first
  `min-width`, standard breakpoint `48rem` (see `OfferForm.css`).
- Fluid type via `clamp()`; flowing grids via
  `repeat(auto-fit, minmax(20rem, 1fr))`; CSS nesting (`&:hover`) is fine.
- Shared utilities (`.button`, `.button--primary`, `.button--outline`,
  `.eyebrow`) live once in `index.css` — don't redeclare per component.

## Standard Patterns

Match `OfferForm.css` / `Hero.css`:

- **Card**: `border: 1px solid var(--color-border)`,
  `border-radius: var(--radius-lg)`, `background: var(--color-surface)`
- **Primary button**: `--color-primary-dark` bg, white bold text,
  `--radius-md`, `cursor: pointer`, hover `filter: brightness(0.9)`
- **Outline button**: `--color-border` border, `--color-surface` bg; hover
  recolors to `--color-primary-dark`
- **Focus ring** (all interactives):
  `outline: 3px solid var(--color-accent-yellow); outline-offset: 2px` on
  `:focus-visible`
- **Eyebrow**: `0.75rem`, weight 700, `letter-spacing: 0.04em`, uppercase,
  `--color-primary-dark`
- **Errors**: `0.875rem`, `--color-error`

## Forms

Use React Hook Form with a config-array field definition — follow
`OfferForm.jsx` exactly. Required wiring:

- `noValidate` on `<form>`; validation comes from RHF `rules`
- Errors beside the field (per UX spec) with `role="alert"`; inputs link via
  `aria-invalid` + `aria-describedby`
- Optional numbers convert `''` → `null` via `setValueAs` and validate with
  `Number.isFinite` (see `optionalNumber`)

## Accessibility

- Semantic landmarks (`header`/`nav`/`main`/`section` + `aria-labelledby`)
- `aria-current="page"` on active nav (styled via the attribute selector)
- `aria-label` on icon-only buttons; `aria-hidden="true"` on decoration
- `<button>`/`<a>` for interactions — never clickable `<div>`s
- `:focus-visible` style on every interactive element

## States & UX Copy

- Always render an empty state prompting the first offer
- `Not provided` for missing optional details; `Not specified` for empty
  `<select>` options
- `window.confirm` before destructive actions
- Money via `Intl.NumberFormat` USD, `maximumFractionDigits: 0` (see
  `formatSalary` in `MyOffers.jsx`)

## Code Style & Testing

- Single quotes, no semicolons, ESM imports at top. (`EditDeleteOffer.jsx`
  deviates — don't copy it.)
- Colocated `*.test.jsx` per component (Vitest + RTL). Before finishing:
  `npm run test:run` and `npm run lint`.

## Summary

| Do | Don't |
| --- | --- |
| `var(--color-*)` / `var(--radius-*)` | Hardcoded hex |
| Colocated `<Name>.css`, BEM classes | Frameworks, inline styles, element selectors |
| RHF + config-driven fields | Ad-hoc controlled inputs |
| `onX` props / `handleX` handlers | Inconsistent event names |
| Semantic HTML + ARIA | Clickable `<div>`s |
