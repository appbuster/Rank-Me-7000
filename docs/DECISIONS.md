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

(To be documented)
