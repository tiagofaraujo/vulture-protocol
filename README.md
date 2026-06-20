# Vulture Protocol

Initial scaffold for a resurrection-token analytics platform.

## Stack

- Next.js (App Router) + TypeScript
- Node.js runtime
- Tailwind CSS
- Prisma ORM
- PostgreSQL

## Project structure

- `app/` - App Router pages (`/` and `/dashboard`)
- `components/` - reusable UI components (token table)
- `lib/` - placeholder dataset
- `types/` - shared TypeScript types
- `prisma/` - Prisma schema

## Quick start

### Prerequisites

Use Node.js 20 or newer. Prisma and Next.js do not support Node.js 16 for this project. If you are using nvm or GitHub Codespaces, run:

```bash
nvm install
nvm use
node -v
```

If `npm install` previously failed on Node.js 16, remove the partial install before trying again:

```bash
rm -rf node_modules
npm install
```

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment:

   ```bash
   cp .env.example .env
   ```

3. Generate Prisma client:

   ```bash
   npm run prisma:generate
   ```

4. Run development server:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000`.


## Database model

- `Token` + unique `(chain, address)` identity
- `TokenMetrics` for market/holder/liquidity snapshots
- `TokenClassification` for status and resurrection scoring
- `ScanLog` for scan job observability
