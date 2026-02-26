# Architecture Decisions Log

## Phase 3: Route Skeleton Lock

### Decision 1: Typed Routes Disabled
**Date:** 2025-02-26
**Status:** Temporary

Disabled `experimental.typedRoutes` in next.config.js during skeleton phase. This feature enforces compile-time route checking but conflicts with dynamic breadcrumb generation where paths are built at runtime.

**Rationale:** Speed of development during skeleton phase. Will re-enable after routes are stable and implement proper route typing.

### Decision 2: App Route Group Structure
**Date:** 2025-02-26
**Status:** Adopted

Used Next.js route groups with `(app)` folder to share the AppShell layout (Sidebar + Header) across all authenticated routes while keeping the root layout minimal.

```
src/app/
├── layout.tsx          # Root layout (minimal - HTML/body)
├── page.tsx            # Redirects to /dashboard
├── globals.css
└── (app)/
    ├── layout.tsx      # App shell with Sidebar + Header
    ├── dashboard/
    ├── seo/
    └── ... (all routes)
```

### Decision 3: ReportLayout as Universal Skeleton
**Date:** 2025-02-26
**Status:** Adopted

Created a single `ReportLayout` component with sensible defaults for:
- 4 KPI tiles
- 1 trend chart
- 1 data table
- Filter bar

All 75 routes use this layout with their own title/description. This ensures visual consistency and makes future customization straightforward.

### Decision 4: Component Structure
**Date:** 2025-02-26
**Status:** Adopted

```
src/components/
├── ui/              # Primitive UI components
│   ├── KpiTile.tsx
│   ├── KpiTileGrid.tsx
│   ├── ChartContainer.tsx
│   ├── VirtualizedDataTable.tsx
│   └── FilterBar.tsx
└── layout/          # Layout components
    ├── Sidebar.tsx
    ├── Header.tsx
    ├── Breadcrumbs.tsx
    ├── ReportLayout.tsx
    └── AppShell.tsx
```

### Decision 5: Navigation Structure
**Date:** 2025-02-26
**Status:** Adopted

Navigation defined in `src/lib/routes.ts` with:
- `routes` object: All route definitions
- `navigation` array: Sidebar navigation structure with groups and subgroups

This single source of truth is used by Sidebar for nav rendering and by the page generator for creating pages.

---

## Phase 4: Data Model + Seed

### Decision 6: SQLite for Development
**Date:** 2025-02-26
**Status:** Temporary

Switched from PostgreSQL to SQLite for development to remove Docker dependency. The schema was modified to remove PostgreSQL-specific features:
- `BigInt` → `Int`
- `@db.Decimal` → `Float`
- `@db.Date` → `DateTime`
- Enums → String (SQLite doesn't support enums natively)

**Rationale:** Allows rapid development without infrastructure setup. Production will use PostgreSQL.

### Decision 7: Seed Data Scale
**Date:** 2025-02-26
**Status:** Adopted

Created comprehensive seed with:
- 10 industries with realistic category names
- 485 domains (50 per industry, some duplicates filtered)
- 18,600 keywords with industry-specific templates
- 240,489 backlinks with realistic anchor texts
- 100,798 audit URLs across 10 projects
- 29,943 audit issues
- 2,483 tracked keywords with 225,953 rank history records (90 days each)

**Rationale:** Sufficient scale to test performance with realistic data volumes while keeping seed time reasonable (~5 min).

### Decision 8: Keyword Generation Strategy
**Date:** 2025-02-26
**Status:** Adopted

Keywords generated using templates per industry:
- Base words mapped to each industry (e.g., "tech", "software" for technology)
- Templates like "best {base} software", "{base} pricing", etc.
- Year variants for uniqueness (e.g., "best tech 2024", "best tech 2025")

This creates semantically coherent keyword groups that make sense for each industry.

### Decision 9: Rank History Simulation
**Date:** 2025-02-26
**Status:** Adopted

Rank history simulates realistic position fluctuation:
- Starting position: random 1-50
- Daily change: random -3 to +3
- Clamped to 1-100 range
- 91 days of history per tracked keyword

This creates believable trend patterns for visualization.
