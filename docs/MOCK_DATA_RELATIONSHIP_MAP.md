# Mock Data Relationship Map

## Overview

The mock data must be **coherent** across all tools. A keyword appearing in one tool must appear with the same data in other tools. This document defines how entities relate and how consistency is enforced.

## Core Entity Relationships

### Domain ↔ Keyword Relationships

```
Domain (e.g., "techstartup.com")
    │
    ├── ranks for → Keywords (via OrganicRank)
    │   ├── "startup marketing" (position 3)
    │   ├── "tech startup guide" (position 7)
    │   └── "saas growth" (position 15)
    │
    └── consistency check:
        • Same keywords appear in:
          - Domain Overview → keyword count
          - Organic Rankings → full list
          - Keyword Overview → when searched
          - Keyword Magic Tool → when matching
```

### Keyword Coherence Rules

1. **Keyword → Multiple Domains**
   - A keyword can have rankings for multiple domains
   - OrganicRank table stores position per domain
   - Traffic estimates derived from position + volume

2. **Keyword → Keyword Magic Tool**
   - Keywords belong to KeywordGroups
   - Groups have subgroups (max 3 levels deep)
   - Same keyword appears when:
     - Seed matches (broad/phrase/exact)
     - Group is expanded

3. **Keyword → Position Tracking**
   - TrackedKeyword links Project to Keyword
   - RankHistory stores daily positions
   - Must use same keyword_id as OrganicRank

### Domain ↔ Backlink Relationships

```
Domain (e.g., "techstartup.com")
    │
    ├── has → Backlinks
    │   ├── from "forbes.com/article" → "/about"
    │   ├── from "techcrunch.com/post" → "/product"
    │   └── from "blog.example.com" → "/blog/post-1"
    │
    └── consistency check:
        • Target URLs must exist in AuditUrl table
        • Source domains must exist in Domain table
        • Anchor text distribution realistic
```

### Backlink Coherence Rules

1. **Backlink → Target URL**
   - Every backlink `target_url` must exist in AuditUrl
   - If AuditUrl has `/about`, backlinks can point to it

2. **Backlink → Source Domain**
   - Source domain should exist in Domain table
   - Source domain has its own authority_score
   - Source metrics affect backlink value

3. **Backlink → Audit**
   - AuditUrl external_links should count outbound
   - Internal linking structure affects crawlability

### Project ↔ Audit Relationships

```
Project (target: "techstartup.com")
    │
    ├── has → AuditUrls (crawled pages)
    │   ├── "/" (homepage)
    │   ├── "/about"
    │   ├── "/blog/post-1"
    │   └── ... (up to crawl_limit)
    │
    ├── has → AuditIssues (per URL)
    │   ├── "/" → [missing_h1, slow_load]
    │   ├── "/about" → [no_meta_desc]
    │   └── "/blog/post-1" → [broken_link]
    │
    └── consistency check:
        • Issue URLs must exist in AuditUrl
        • Issue types must exist in IssueType
        • Broken link targets must be traceable
```

### Position Tracking Coherence

```
Project
    │
    ├── tracks → Keywords (via TrackedKeyword)
    │   ├── "startup marketing"
    │   └── "saas growth"
    │
    ├── has → RankHistory (per keyword, per day)
    │   ├── "startup marketing" Day1: pos 5, Day2: pos 4...
    │   └── "saas growth" Day1: pos 12, Day2: pos 11...
    │
    └── consistency check:
        • Keywords must exist in Keyword table
        • Position changes should be gradual (±3 typical)
        • Visibility formula consistent with positions
```

## Data Generation Flow

### Step 1: Generate Industries (10)
```
industries = [
  { name: "SaaS", slug: "saas" },
  { name: "E-commerce", slug: "ecommerce" },
  { name: "Finance", slug: "finance" },
  ...
]
```

### Step 2: Generate Domains (50+)
```
for each industry:
  generate 5+ domains
  assign authority_score based on:
    - industry competitiveness
    - random variance
  assign traffic estimates based on:
    - authority_score correlation
```

### Step 3: Generate Keywords (25,000+)
```
for each industry:
  generate keyword clusters:
    - seed keywords (500)
    - variations (2,000)
    - long-tail (7,500)
  
  for each keyword:
    - assign volume (log-normal distribution)
    - assign difficulty (correlated with volume)
    - assign intent (based on keyword patterns)
    - assign to KeywordGroup
```

### Step 4: Generate OrganicRanks (100,000+)
```
for each domain:
  sample keywords from domain's industry
  
  for each sampled keyword:
    - assign position (weighted by authority)
    - assign URL (realistic path)
    - compute traffic_percent
```

### Step 5: Generate Backlinks (200,000+)
```
for each domain:
  compute backlink count based on authority
  
  for each backlink:
    - select source domain (authority correlation)
    - select target URL (from domain's AuditUrls)
    - generate anchor text (branded/keyword/generic mix)
    - assign dates (first_seen, last_seen)
    - compute toxicity (based on source patterns)
```

### Step 6: Generate Audit Data (100,000+ URLs)
```
for each project:
  crawl_limit = project.crawl_limit
  
  generate URLs:
    - homepage
    - main sections (/about, /contact, /blog, etc.)
    - blog posts (/blog/post-{n})
    - product pages (/products/{slug})
  
  for each URL:
    - assign status_code (mostly 200, some 404, 301, 500)
    - generate realistic metrics
    - create AuditIssues based on patterns
```

### Step 7: Generate Rank History (90 days)
```
for each TrackedKeyword:
  start_position = current OrganicRank position
  
  for day in range(90):
    position = start_position + random_walk(±3)
    position = clamp(1, 100)
    
    create RankHistory entry
    compute visibility from position
    compute estimated_traffic from position + volume
```

## Validation Queries

### No Orphan Foreign Keys
```sql
-- Keywords without domain rankings
SELECT k.id FROM keyword k
LEFT JOIN organic_rank r ON k.id = r.keyword_id
WHERE r.id IS NULL;
-- Expected: 0 rows (all keywords have at least 1 ranking)

-- Backlinks to non-existent URLs
SELECT b.id FROM backlink b
LEFT JOIN audit_url a ON b.target_url = a.url AND b.target_domain_id = a.project_id
WHERE a.id IS NULL;
-- Expected: 0 rows
```

### No Keyword Without Domain Mapping
```sql
SELECT k.id FROM keyword k
WHERE NOT EXISTS (
  SELECT 1 FROM organic_rank r WHERE r.keyword_id = k.id
);
-- Expected: 0 rows
```

### No Backlink Without Valid URL
```sql
-- All backlink target URLs exist in audit
SELECT COUNT(*) FROM backlink b
WHERE NOT EXISTS (
  SELECT 1 FROM audit_url a 
  WHERE a.url = b.target_url
);
-- Expected: 0
```

### No Rank Record Without Keyword
```sql
SELECT rh.id FROM rank_history rh
JOIN tracked_keyword tk ON rh.tracked_keyword_id = tk.id
WHERE NOT EXISTS (
  SELECT 1 FROM keyword k WHERE k.id = tk.keyword_id
);
-- Expected: 0 rows
```

## Cross-Tool Data Consistency Matrix

| Data Point | Domain Overview | Organic Rankings | Keyword Magic | Position Tracking | Backlinks |
|------------|-----------------|------------------|---------------|-------------------|-----------|
| Keyword text | Count only | Full list | Searchable | Tracked subset | N/A |
| Keyword volume | Aggregate | Per keyword | Per keyword | Per keyword | N/A |
| Position | Avg position | Per keyword | N/A | Historical | N/A |
| Traffic | Total estimate | Per keyword | N/A | Estimated | N/A |
| Backlinks | Count only | N/A | N/A | N/A | Full list |
| Referring domains | Count only | N/A | N/A | N/A | Aggregated |

## Seed Determinism

To ensure reproducible builds:

```typescript
import { createSeedRandom } from './seed-utils';

const SEED = 'rank-me-7000-v1';
const random = createSeedRandom(SEED);

// Use random.next() instead of Math.random()
// This ensures same data on every seed run
```
