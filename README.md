# Expense Tracker (React + Vite)

Minimal React app to track expenses, with localStorage persistence.

## Setup

1. Install dependencies

```bash
cd expense_tracker
npm install
```

2. Run dev server

```bash
npm run dev
```

Open the URL shown by Vite (usually http://localhost:5173).

## Features

- Add expenses (title, amount, date).
- List expenses and show total.
- Filter by year.
- Data persisted in `localStorage`.

New features added:

- Transactions support: `income`, `expense`, `lend` (you lend/give), and `borrow` (you borrow/take).
- Track people you lend/borrow to/from and see per-person balances.
- Dashboard with daily/weekly/monthly/yearly aggregation and summary totals.
- Transaction list with remove support.

## Next ideas

- TypeScript conversion
- Tests + CI
- Export/import CSV
- Backend sync / authentication

If you want, I can add TypeScript, tests, or a backend next.