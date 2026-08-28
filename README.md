# Expense Manager — MVP complete + Demo build ready

Interactive Expense Manager PWA — companion product to the Saving Planner.

## Stack
React + TypeScript + Vite + Tailwind CSS v4 + React Router + lucide-react + Recharts (code-split) + vite-plugin-pwa.

## Phases delivered
Phase 2 (Foundation) → Phase 8 (UX Polish). Full feature set: dashboard with budget
progress, expense CRUD, searchable/filterable history, custom categories, monthly
budgets, category breakdown chart, month comparison, spending insights, calendar view,
recurring expenses, JSON backup/restore, installable offline PWA, onboarding, toasts +
error boundary. 28 unit tests cover the financial/date calculations.

## Two builds, one codebase

| | Real product | Demo |
|---|---|---|
| Command | `npm run build` | `npm run build:demo` |
| Data on first load | Empty (real onboarding) | Sample data (`src/data/demoSeed.ts`) |
| Hosting | Vercel | GitHub Pages |
| URL shape | `mybrand.com/expenses` (pretty URLs) | `username.github.io/expense-manager/` (hash routing, since GH Pages can't rewrite SPA routes) |
| Banner | None | "You're viewing a demo" bar, always visible |
| Reset button | Empties the app | Reseeds the same sample data (so the next visitor still gets a populated demo) |

The demo/real switch is driven entirely by `.env.demo` (`VITE_DEMO_MODE=true`,
`VITE_BASE_PATH=/expense-manager/`) — the real build ignores that file, so there's
no risk of accidentally shipping demo data to paying customers.

**Before deploying the demo**, edit `VITE_BASE_PATH` in `.env.demo` to match your
actual GitHub repo name (GitHub Pages project sites are served at
`https://<username>.github.io/<repo-name>/`).

## Deployment steps

### 1. Push to GitHub (needed for both destinations)
```
cd expense-manager
git init
git add .
git commit -m "Expense Manager MVP"
gh repo create expense-manager --public --source=. --push
# (or create the repo on github.com and `git remote add origin <url> && git push -u origin main`)
```

### 2. Publish the demo to GitHub Pages
```
npm run deploy:demo
```
This runs `build:demo` then pushes `dist/` to a `gh-pages` branch via the `gh-pages`
package (already installed). Then in the repo's Settings → Pages, set the source to
the `gh-pages` branch. Your demo will be live at
`https://<username>.github.io/expense-manager/` within a minute or two.

### 3. Deploy the real product to Vercel
Import the same GitHub repo in Vercel — it auto-detects the Vite framework preset.
Leave the build command as the default (`npm run build`, not `build:demo`) so it never
picks up `.env.demo`. Vercel handles the SPA routing rewrite automatically for the
Vite preset, so the real product keeps pretty URLs (`/transactions`, `/settings`, etc.)
instead of the demo's hash-based ones.

## Run locally
```
npm install
npm run dev                      # real app, dev server
npm test                         # unit tests (vitest) — 28 tests
npm run build                    # production build (real product)
npm run build:demo               # demo build with sample data
node scripts/generate-icons.mjs  # regenerate PWA icons if the brand mark changes
```
