# Rank Me 7000 - Routes Documentation

Complete routing guide for the Rank Me 7000 SEO platform.

## Route Structure

All authenticated app routes live under `src/app/(app)/` and use the shared app layout with sidebar navigation.

---

## Core Pages

| Route | Description |
|-------|-------------|
| `/` | Landing/home page |
| `/dashboard` | Main dashboard with KPI widgets |

---

## SEO Toolkit

### Keywords
| Route | Description |
|-------|-------------|
| `/seo/keywords/overview` | Keyword research overview |
| `/seo/keywords/manager` | Keyword manager (groups, tags) |
| `/seo/keywords/position-tracking` | Rank tracking with history |
| `/seo/keywords/gap` | Keyword gap analysis |

### Technical SEO
| Route | Description |
|-------|-------------|
| `/seo/technical/site-audit` | Site health audit dashboard |
| `/seo/technical/log-analyzer` | Server log analysis |
| `/seo/technical/indexability` | Indexation status checker |

### Backlinks
| Route | Description |
|-------|-------------|
| `/seo/backlinks/overview` | Backlink profile overview |
| `/seo/backlinks/audit` | Backlink audit tool |
| `/seo/backlinks/monitor` | Link monitoring |
| `/seo/backlinks/outreach` | Link building outreach |

### Competitive Analysis
| Route | Description |
|-------|-------------|
| `/seo/competitive/domain-overview` | Domain analysis |
| `/seo/competitive/keyword-gap` | Keyword gap analysis |
| `/seo/competitive/backlink-gap` | Backlink gap analysis |

---

## Content Toolkit

| Route | Description |
|-------|-------------|
| `/content/topic-finder` | Topic research & ideas |
| `/content/ai-article` | AI article writer |
| `/content/seo-brief` | SEO content briefs |
| `/content/ai-search` | AI search optimization |
| `/content/repurposing` | Content repurposing tool |

---

## Local SEO Toolkit

| Route | Description |
|-------|-------------|
| `/local/listings` | Listing management |
| `/local/gbp` | Google Business Profile |
| `/local/gbp-agent` | GBP AI automation |
| `/local/reviews` | Review management |
| `/local/map-rank` | Map rankings tracker |

---

## Social Toolkit

| Route | Description |
|-------|-------------|
| `/social/tracker` | Competitor social tracking |
| `/social/poster` | Social post scheduler |
| `/social/analytics` | Social analytics dashboard |
| `/social/monitoring` | Social brand monitoring |

---

## Advertising Toolkit

| Route | Description |
|-------|-------------|
| `/advertising/research` | PPC keyword research |
| `/advertising/ads-history` | Ad campaign history |
| `/advertising/adclarity` | Display advertising intelligence |

---

## Traffic & Market

| Route | Description |
|-------|-------------|
| `/traffic/analytics` | Traffic analytics overview |
| `/traffic/daily` | Daily traffic breakdown |
| `/traffic/distribution` | Traffic source distribution |
| `/traffic/regional` | Geographic traffic analysis |
| `/traffic/pages` | Page-level analytics |
| `/traffic/audience` | Audience insights |
| `/traffic/market-overview` | Market explorer |
| `/traffic/eyeon` | Competitor monitoring |

---

## AI Visibility

| Route | Description |
|-------|-------------|
| `/ai-visibility/overview` | AI platform presence overview |
| `/ai-visibility/tracking` | AI query tracking |
| `/ai-visibility/sentiment` | AI sentiment analysis |

---

## AI PR

| Route | Description |
|-------|-------------|
| `/ai-pr/campaigns` | PR campaign management |
| `/ai-pr/media` | Media database |
| `/ai-pr/outreach` | PR outreach tools |

---

## Reports

| Route | Description |
|-------|-------------|
| `/reports` | Reports dashboard |
| `/reports/new` | Report builder |
| `/reports/templates` | Report templates |
| `/reports/schedule` | Scheduled reports |

---

## Projects & Settings

| Route | Description |
|-------|-------------|
| `/projects` | Project list |
| `/projects/new` | Create new project |
| `/settings` | Settings overview |
| `/settings/profile` | User profile |
| `/settings/workspaces` | Workspace management |
| `/settings/integrations` | Third-party integrations |

---

## Leads (Lead Generation)

| Route | Description |
|-------|-------------|
| `/leads` | Leads overview |
| `/leads/inbox` | Lead inbox |
| `/leads/widgets` | Embeddable widgets |

---

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/domains` | GET | List all domains |
| `/api/domains/[domain]` | GET | Domain details |

---

## File Structure

```
src/app/
├── (app)/                    # Authenticated app routes
│   ├── layout.tsx           # App shell with sidebar
│   ├── loading.tsx          # Global loading skeleton
│   ├── error.tsx            # Global error boundary
│   ├── not-found.tsx        # 404 page
│   ├── dashboard/
│   ├── seo/
│   │   ├── keywords/
│   │   ├── technical/
│   │   ├── backlinks/
│   │   └── competitive/
│   ├── content/
│   ├── local/
│   ├── social/
│   ├── advertising/
│   ├── traffic/
│   ├── ai-visibility/
│   ├── ai-pr/
│   ├── reports/
│   ├── projects/
│   ├── settings/
│   └── leads/
├── api/                      # API routes
├── layout.tsx               # Root layout
├── page.tsx                 # Landing page
└── globals.css              # Global styles
```

---

## Navigation Structure

The sidebar navigation is organized into these main sections:

1. **Dashboard** - Main overview
2. **SEO Toolkit** - Keywords, Technical, Backlinks, Competitive
3. **Content** - Topic research, AI writing, Content audit
4. **Local** - Listings, GBP, Reviews, Map rankings
5. **Social** - Tracking, Posting, Analytics
6. **Advertising** - PPC research, Ads history
7. **Traffic & Market** - Analytics, Audience, Market data
8. **AI Visibility** - AI platform tracking
9. **AI PR** - PR campaigns and outreach
10. **Reports** - Custom report builder
11. **Settings** - Profile, Workspaces, Integrations
