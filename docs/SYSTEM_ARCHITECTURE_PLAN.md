# System Architecture Plan

## Frontend Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with sidebar + header
│   ├── page.tsx             # Redirect to /dashboard
│   ├── dashboard/
│   ├── projects/
│   ├── seo/
│   │   ├── competitive/
│   │   ├── keywords/
│   │   ├── links/
│   │   ├── technical/
│   │   └── content/
│   ├── traffic/
│   ├── content/
│   ├── advertising/
│   ├── local/
│   ├── social/
│   ├── ai-visibility/
│   ├── ai-pr/
│   ├── reports/
│   └── settings/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── ReportLayout.tsx
│   │   └── Breadcrumbs.tsx
│   ├── ui/
│   │   ├── KpiTile.tsx
│   │   ├── KpiTileGrid.tsx
│   │   ├── ChartContainer.tsx
│   │   ├── VirtualizedDataTable.tsx
│   │   ├── FilterBar.tsx
│   │   ├── DateRangePicker.tsx
│   │   ├── DomainInput.tsx
│   │   └── ExportButton.tsx
│   ├── wizards/
│   │   ├── ProjectWizard.tsx
│   │   ├── PositionTrackingSetup.tsx
│   │   └── AuditSetup.tsx
│   └── charts/
│       ├── TimeSeriesChart.tsx
│       ├── DistributionChart.tsx
│       ├── ComparisonChart.tsx
│       └── VennDiagram.tsx
├── lib/
│   ├── api.ts               # API client
│   ├── hooks/               # Custom hooks
│   └── utils/               # Utilities
├── providers/
│   ├── DataProvider.tsx     # Mock/Real data provider abstraction
│   └── ThemeProvider.tsx
└── types/
    └── index.ts             # Shared TypeScript types
```

## Backend Architecture

```
api/
├── src/
│   ├── routes/
│   │   ├── domains.ts
│   │   ├── keywords.ts
│   │   ├── backlinks.ts
│   │   ├── audit.ts
│   │   ├── tracking.ts
│   │   ├── projects.ts
│   │   └── reports.ts
│   ├── services/
│   │   ├── DomainService.ts
│   │   ├── KeywordService.ts
│   │   ├── BacklinkService.ts
│   │   ├── AuditService.ts
│   │   ├── TrackingService.ts
│   │   └── ComputationService.ts
│   ├── providers/
│   │   ├── MockDataProvider.ts
│   │   ├── DataForSEOProvider.ts (optional)
│   │   └── ProviderFactory.ts
│   └── index.ts
└── prisma/
    ├── schema.prisma
    ├── seed.ts
    └── migrations/
```

## Provider Abstraction

```typescript
interface IDataProvider {
  // Domain methods
  getDomainOverview(domain: string): Promise<DomainOverview>
  compareDomains(domains: string[]): Promise<DomainComparison>
  
  // Keyword methods
  getKeywordOverview(keyword: string): Promise<KeywordOverview>
  searchKeywords(params: KeywordSearchParams): Promise<KeywordResults>
  
  // Backlink methods
  getBacklinks(domain: string, params: BacklinkParams): Promise<BacklinkResults>
  
  // Audit methods
  runAudit(domain: string): Promise<AuditResults>
  
  // Tracking methods
  getPositionHistory(projectId: string): Promise<PositionHistory>
}

// Provider selection via env var
const provider = process.env.DATA_MODE === 'real' 
  ? new DataForSEOProvider() 
  : new MockDataProvider()
```

## Data Flow

```
User Action → React Component → API Route → Service → Provider → Database/External API
                    ↓
              State Update ← Response ← Transform ← Raw Data
```

## State Management

- **Server State:** React Query (TanStack Query)
  - Caching
  - Background refetch
  - Optimistic updates
- **Client State:** Zustand
  - Sidebar state
  - Filter state
  - Selected project/workspace
- **URL State:** Next.js searchParams
  - Filters
  - Date ranges
  - Pagination

## Caching Strategy

| Data Type | Cache Duration | Invalidation |
|-----------|----------------|--------------|
| Domain metrics | 1 hour | Manual refresh |
| Keyword data | 4 hours | On search |
| Backlinks | 1 hour | Manual refresh |
| Audit results | Until re-run | On new audit |
| Position tracking | 24 hours | Daily update |
| User settings | Session | On change |

## Technology Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **State:** TanStack Query, Zustand
- **Charts:** Recharts
- **Tables:** TanStack Table + react-window (virtualization)
- **Backend:** Next.js API routes (or separate Node service)
- **Database:** PostgreSQL 15
- **ORM:** Prisma
- **Testing:** Vitest, Playwright
- **DevOps:** Docker Compose
