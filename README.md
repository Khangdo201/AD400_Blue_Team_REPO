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

## Database

Neon schema changes are tracked in `db/migrations/`. The offers API in `api/`
verifies Neon Auth JWTs and scopes every database operation to the verified
user. It does not expose the database through the Neon Data API or rely on
row-level security; only trusted server code should connect to the database.
Never expose or commit a database connection string or Neon API key.

The development Function exposes:

- `GET /offers?limit=50&offset=0` — list the signed-in user's offers (maximum
  limit 100).
- `POST /offers` — create an offer.
- `GET /offers/:id`, `PATCH /offers/:id`, `DELETE /offers/:id` — access,
  partially update, or delete an offer owned by the signed-in user.

Send a Neon Auth JWT as `Authorization: Bearer <token>`. Create requests require
`companyName`, `jobTitle`, and numeric `salary`. Optional fields are numeric
`signingBonus`, `firstYearEquity`, `ptoDays`, `sickLeaveDays`, `employerMatch`,
and text `workArrangement` (`Remote`, `Hybrid`, or `On-site`) and
`learningOpportunities`. Optional fields may be `null`. The server derives
ownership from the token; clients cannot set it. Money values use at most two
decimal places, and day counts are nonnegative integers.

Install and test the API independently with `npm ci --prefix api` and
`npm test --prefix api`. Apply migrations once per database using a direct
connection and a transaction; for example, with `psql`:

```sh
psql "$DATABASE_URL_UNPOOLED" -v ON_ERROR_STOP=1 --single-transaction \
  -f db/migrations/0001_create_offers.sql
```

Deploy to a specific Neon branch with Auth enabled:

```sh
neon functions deploy offers --project-id <project-id> --branch <branch-name> \
  --src api/index.js --env ALLOWED_ORIGINS=http://localhost:5173
```

Set `ALLOWED_ORIGINS` to a comma-separated list of exact frontend origins for
other deployments. The Function URL is public; CORS is not an authentication
boundary. Add rate limiting and review production settings before exposing the
API to real users. The current React frontend is not yet connected to this API
or Neon Auth.
