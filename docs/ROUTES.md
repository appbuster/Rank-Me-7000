# Routes

## Complete Sidebar Taxonomy

### A) Dashboard
| Route | Name | Description |
|-------|------|-------------|
| `/dashboard` | Dashboard | KPI snapshot widgets across projects |

### B) Projects
| Route | Name | Description |
|-------|------|-------------|
| `/projects` | Projects | List all projects |
| `/projects/new` | Create Project | Project creation wizard |
| `/projects/[id]` | Project Overview | Project dashboard |
| `/projects/[id]/settings` | Project Settings | Edit project configuration |

### C) SEO Toolkit

#### C1) Competitive Research
| Route | Name | Description |
|-------|------|-------------|
| `/seo/competitive/domain-overview` | Domain Overview | Domain summary with all metrics |
| `/seo/competitive/compare-domains` | Compare Domains | Side-by-side comparison |
| `/seo/competitive/organic-rankings` | Organic Rankings | Keywords domain ranks for |
| `/seo/competitive/top-pages` | Top Pages | Highest traffic pages |
| `/seo/competitive/keyword-gap` | Keyword Gap | Compare up to 5 domains |
| `/seo/competitive/backlink-gap` | Backlink Gap | Compare backlink profiles |

#### C2) Keyword Research
| Route | Name | Description |
|-------|------|-------------|
| `/seo/keywords/keyword-overview` | Keyword Overview | Single keyword analysis |
| `/seo/keywords/keyword-magic` | Keyword Magic Tool | Keyword discovery with groups |
| `/seo/keywords/keyword-strategy` | Keyword Strategy Builder | Build keyword lists |
| `/seo/keywords/position-tracking` | Position Tracking | Track rankings over time |
| `/seo/keywords/position-tracking/setup` | Position Tracking Setup | Setup wizard |
| `/seo/keywords/organic-traffic-insights` | Organic Traffic Insights | GA integration view |

#### C3) Link Building
| Route | Name | Description |
|-------|------|-------------|
| `/seo/links/backlinks` | Backlinks Tool | Backlink analysis |
| `/seo/links/backlink-audit` | Backlink Audit | Toxicity analysis |
| `/seo/links/link-building` | Link Building Tool | Outreach workflow |

#### C4) On Page & Technical SEO
| Route | Name | Description |
|-------|------|-------------|
| `/seo/technical/site-audit` | Site Audit | Technical health check |
| `/seo/technical/site-audit/[category]` | Audit Category | Thematic report drilldown |
| `/seo/technical/on-page-checker` | On Page SEO Checker | Page optimization |
| `/seo/technical/log-analyzer` | Log File Analyzer | Server log analysis |

#### C5) Content Ideas
| Route | Name | Description |
|-------|------|-------------|
| `/seo/content/writing-assistant` | SEO Writing Assistant | Content optimization |
| `/seo/content/topic-research` | Topic Research | Topic discovery |
| `/seo/content/content-template` | SEO Content Template | Content briefs |

#### C6) Extras
| Route | Name | Description |
|-------|------|-------------|
| `/seo/extras/sensor` | Sensor | SERP volatility tracker |
| `/seo/extras/seoquake` | SEOquake | Quick analysis tool |
| `/seo/extras/rank` | Rank Me Rank | Domain ranking tracker |

### D) Traffic & Market Toolkit
| Route | Name | Description |
|-------|------|-------------|
| `/traffic/analytics` | Traffic Analytics | Website traffic data |
| `/traffic/daily` | Daily Traffic | Day-by-day breakdown |
| `/traffic/distribution` | Traffic Distribution | Source breakdown |
| `/traffic/pages` | Pages and Categories | Top content |
| `/traffic/regional` | Regional Trends | Geographic data |
| `/traffic/audience` | Audience Profile | Demographics |
| `/traffic/market-overview` | Market Overview | Industry benchmarks |
| `/traffic/eyeon` | EyeOn | Competitor monitoring |

### E) Content Toolkit
| Route | Name | Description |
|-------|------|-------------|
| `/content/topic-finder` | Topic Finder | Content ideas |
| `/content/seo-brief` | SEO Brief Generator | Brief creation |
| `/content/ai-article` | AI Article Generator | AI writing |
| `/content/ai-search` | AI Search Optimizer | Search optimization |
| `/content/repurposing` | Content Repurposing | Repurpose content |

### F) Local Toolkit
| Route | Name | Description |
|-------|------|-------------|
| `/local/listings` | Listing Management | Business listings |
| `/local/reviews` | Review Management | Review monitoring |
| `/local/map-rank` | Map Rank Tracker | Local pack tracking |
| `/local/gbp` | GBP Optimization | Google Business Profile |
| `/local/gbp-agent` | GBP AI Agent | AI-powered GBP |

### G) Social Toolkit
| Route | Name | Description |
|-------|------|-------------|
| `/social/poster` | Social Poster | Post scheduling |
| `/social/tracker` | Social Tracker | Competitor tracking |
| `/social/insights` | Social Content Insights | Content performance |
| `/social/analytics` | Social Analytics | Account analytics |
| `/social/content-ai` | Social Content AI | AI content creation |
| `/social/influencer` | Influencer Analytics | Influencer research |
| `/social/monitoring` | Media Monitoring | Brand mentions |

### H) Advertising Toolkit
| Route | Name | Description |
|-------|------|-------------|
| `/advertising/research` | Advertising Research | Competitor ad research |
| `/advertising/ppc-keywords` | PPC Keyword Tool | Paid keyword research |
| `/advertising/ads-history` | Ads History | Historical ad data |
| `/advertising/pla` | PLA Research | Shopping ads |
| `/advertising/launch` | Ads Launch Assistant | Campaign creation |
| `/advertising/adclarity` | AdClarity | Display ad intelligence |

### I) AI Visibility Toolkit
| Route | Name | Description |
|-------|------|-------------|
| `/ai-visibility/overview` | AI Visibility Overview | AI platform presence |
| `/ai-visibility/sentiment` | AI Sentiment | Brand sentiment in AI |
| `/ai-visibility/tracking` | AI Tracking | Track AI mentions |

### J) AI PR Toolkit
| Route | Name | Description |
|-------|------|-------------|
| `/ai-pr/campaigns` | PR Campaigns | Campaign management |
| `/ai-pr/media` | Media Visibility | Press coverage |
| `/ai-pr/outreach` | PR Outreach | Journalist outreach |

### K) My Reports
| Route | Name | Description |
|-------|------|-------------|
| `/reports` | My Reports | Report dashboard |
| `/reports/new` | Create Report | Report builder |
| `/reports/[id]` | View Report | Report view |
| `/reports/templates` | Report Templates | Template library |
| `/reports/schedule` | Report Schedule | Scheduled reports |

### L) Lead Generation
| Route | Name | Description |
|-------|------|-------------|
| `/leads` | Lead Generation | Lead dashboard |
| `/leads/widgets` | Lead Widgets | Widget builder |
| `/leads/inbox` | Leads Inbox | Captured leads |

### M) Settings
| Route | Name | Description |
|-------|------|-------------|
| `/settings` | Settings | Account settings |
| `/settings/profile` | Profile | User profile |
| `/settings/workspaces` | Workspaces | Workspace management |
| `/settings/integrations` | Integrations | Third-party connections |

## URL Patterns

### Query Parameters
| Parameter | Used On | Description |
|-----------|---------|-------------|
| `domain` | Most reports | Target domain |
| `keyword` | Keyword tools | Search keyword |
| `project` | Project-scoped pages | Project context |
| `dateRange` | Time-series reports | Date range (7d, 30d, 90d, custom) |
| `page` | All tables | Pagination |
| `limit` | All tables | Page size |
| `sort` | All tables | Sort column |
| `order` | All tables | asc/desc |
| `filter` | All tables | Filter JSON |

### Example URLs
```
/seo/competitive/domain-overview?domain=example.com
/seo/keywords/keyword-magic?keyword=seo+tools&country=us
/seo/keywords/position-tracking?project=abc123&dateRange=30d
/seo/competitive/keyword-gap?domains=site1.com,site2.com,site3.com
/seo/technical/site-audit/crawlability?project=abc123
```

## Route Count Summary

| Section | Routes |
|---------|--------|
| Dashboard | 1 |
| Projects | 4 |
| SEO Toolkit | 20 |
| Traffic & Market | 8 |
| Content | 5 |
| Local | 5 |
| Social | 7 |
| Advertising | 6 |
| AI Visibility | 3 |
| AI PR | 3 |
| My Reports | 5 |
| Lead Generation | 3 |
| Settings | 4 |
| **TOTAL** | **74 routes** |
