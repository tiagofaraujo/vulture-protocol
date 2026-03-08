# Architecture

This initial scaffold intentionally keeps architecture simple and modular:

1. **Presentation layer**
   - Next.js App Router pages under `app/`
   - Reusable UI in `components/`

2. **Domain layer**
   - Shared token type definitions in `types/`
   - Placeholder analytics data in `lib/data.ts`

3. **Persistence layer**
   - Prisma data model in `prisma/schema.prisma`
   - PostgreSQL as the database

## Persistence model (initial)

- `Token`: canonical token identity (`chain + address`) and metadata
- `TokenMetrics`: latest metrics snapshot (market cap, liquidity, drawdown, etc.)
- `TokenClassification`: status and resurrection scoring
- `ScanLog`: ingestion/scan run status records

## Initial modules

- Home page (`/`) with platform intro
- Dashboard page (`/dashboard`) with summary cards
- Token table component showing placeholder token data
