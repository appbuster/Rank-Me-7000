# Rank Me 7000 🚀

A comprehensive SEO platform built with Next.js 14, featuring keyword tracking, site audits, backlink analysis, competitive intelligence, and AI-powered tools.

## Features

### SEO Toolkit
- **Keyword Research** - Discover and track keywords with volume, difficulty, and trends
- **Position Tracking** - Monitor keyword rankings over time
- **Site Audit** - Technical SEO health checks with issue detection
- **Backlink Analysis** - Full backlink profile with new/lost link tracking
- **Competitive Analysis** - Keyword gap and backlink gap tools

### Content Toolkit
- **Topic Research** - AI-powered topic discovery
- **AI Article Writer** - Generate SEO-optimized content
- **SEO Content Briefs** - Structured content outlines
- **Content Repurposing** - Transform content across formats

### Local SEO
- **Listing Management** - Track citations across platforms
- **GBP Management** - Google Business Profile tools
- **Review Management** - Monitor and respond to reviews
- **Map Rankings** - Local pack position tracking

### Social & Advertising
- **Social Tracker** - Monitor competitor social presence
- **Social Poster** - Schedule and publish content
- **PPC Research** - Keyword research for paid ads
- **Display Intelligence** - Competitor ad analysis

### Traffic & Market
- **Traffic Analytics** - Website traffic insights
- **Audience Insights** - Demographics and behavior
- **Market Explorer** - Industry market share analysis

### AI Features
- **AI Visibility** - Track brand mentions in AI platforms (ChatGPT, Claude, etc.)
- **AI PR** - AI-powered PR outreach and media database

### Reports
- **Report Builder** - Drag-and-drop widget selection
- **Templates** - Pre-built report templates
- **Scheduling** - Automated report delivery

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Tables**: TanStack Table with virtualization
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/appbuster/Rank-Me-7000.git
cd Rank-Me-7000

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Seed the database with sample data
npm run prisma:seed

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run prisma:generate  # Generate Prisma client
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio
```

## Project Structure

```
Rank-Me-7000/
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── seed.ts          # Seed script
│   └── dev.db           # SQLite database
├── src/
│   ├── app/
│   │   ├── (app)/       # Authenticated routes
│   │   ├── api/         # API routes
│   │   └── layout.tsx   # Root layout
│   ├── components/
│   │   ├── layout/      # Layout components
│   │   └── ui/          # Reusable UI components
│   └── lib/
│       ├── data/        # Data fetching functions
│       └── utils.ts     # Utility functions
├── tests/
│   ├── e2e/             # Playwright tests
│   └── unit/            # Vitest tests
├── ROUTES.md            # Route documentation
└── README.md
```

## Routes

See [ROUTES.md](./ROUTES.md) for complete route documentation.

### Key Routes

| Route | Description |
|-------|-------------|
| `/dashboard` | Main dashboard |
| `/seo/keywords/overview` | Keyword research |
| `/seo/competitive/keyword-gap` | Keyword gap analysis |
| `/local/reviews` | Review management |
| `/content/topic-finder` | Topic research |
| `/traffic/analytics` | Traffic analytics |
| `/ai-visibility/overview` | AI visibility tracking |
| `/reports` | Report builder |

## Components

### UI Components

- `KpiTileGrid` - Display KPI metrics in a grid
- `ChartContainer` - Recharts wrapper for charts
- `VirtualizedDataTable` - TanStack Table with virtualization
- `FilterBar` - Filter and export controls
- `EmptyState` - Empty state placeholders
- `LoadingSkeleton` - Loading skeletons
- `ErrorBoundary` - Error handling

### Usage Example

```tsx
import { KpiTileGrid, VirtualizedDataTable, ChartContainer } from '@/components/ui'

const kpis = [
  { title: 'Total Keywords', value: '1,234' },
  { title: 'Avg. Position', value: '12.5', trend: 'up' },
]

export default function Page() {
  return (
    <div className="space-y-6">
      <KpiTileGrid tiles={kpis} />
      <ChartContainer
        title="Rankings Over Time"
        data={data}
        type="line"
        dataKeys={[{ key: 'position', color: '#3b82f6' }]}
      />
    </div>
  )
}
```

## Data Layer

Data fetching functions are organized in `src/lib/data/`:

- `domains.ts` - Domain data
- `keywords.ts` - Keyword data
- `tracking.ts` - Position tracking
- `gaps.ts` - Gap analysis
- `audit.ts` - Site audit
- `local.ts` - Local SEO
- `social.ts` - Social data
- `traffic.ts` - Traffic data
- `advertising.ts` - PPC data
- `ai.ts` - AI visibility
- `content.ts` - Content data

## Database

The project uses SQLite with Prisma. Key models:

- `Workspace` / `Project` - Multi-project support
- `Domain` / `Keyword` - SEO data
- `OrganicRank` / `TrackedKeyword` - Tracking
- `Backlink` / `AuditUrl` - Backlink & audit
- `LocalListing` / `Review` / `MapRanking` - Local SEO
- `SocialProfile` / `SocialPost` - Social
- `TrafficData` / `MarketData` - Traffic
- `AIMention` / `AIPrCampaign` - AI features

### Reset Database

```bash
rm prisma/dev.db
npm run prisma:generate
npm run prisma:seed
```

## Testing

### Unit Tests (Vitest)

```bash
npm run test
```

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT

---

Built with ❤️ using Next.js 14 and Tailwind CSS
