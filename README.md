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
