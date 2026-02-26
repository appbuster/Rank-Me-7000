# Data Model

## Entity Relationship Diagram (Text Form)

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    Workspace    │──1:N──│     Project     │──1:N──│ TrackedKeyword  │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                   │                        │
                                   │ 1:N                    │ 1:N
                                   ▼                        ▼
                          ┌─────────────────┐       ┌─────────────────┐
                          │   Competitor    │       │   RankHistory   │
                          └─────────────────┘       └─────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     Domain      │──1:N──│  OrganicRank    │──N:1──│     Keyword     │
└─────────────────┘       └─────────────────┘       └─────────────────┘
        │                                                   │
        │ 1:N                                               │ N:1
        ▼                                                   ▼
┌─────────────────┐                               ┌─────────────────┐
│    Backlink     │                               │  KeywordGroup   │
└─────────────────┘                               └─────────────────┘
        │
        │ N:1
        ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    AuditUrl     │──1:N──│   AuditIssue    │──N:1──│   IssueType     │
└─────────────────┘       └─────────────────┘       └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│    Industry     │──1:N──│     Domain      │
└─────────────────┘       └─────────────────┘
```

## Tables

### Core Entities

#### Workspace
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Workspace name |
| created_at | TIMESTAMP | NOT NULL | Creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update |

#### Project
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| workspace_id | UUID | FK → Workspace | Parent workspace |
| name | VARCHAR(255) | NOT NULL | Project name |
| target_domain | VARCHAR(255) | NOT NULL | Primary domain |
| location | VARCHAR(10) | NOT NULL | Target country (ISO) |
| device | ENUM | NOT NULL | desktop/mobile |
| crawl_limit | INT | DEFAULT 500 | Max pages to audit |
| created_at | TIMESTAMP | NOT NULL | Creation time |

#### Competitor
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| project_id | UUID | FK → Project | Parent project |
| domain | VARCHAR(255) | NOT NULL | Competitor domain |
| position | INT | NOT NULL | Display order |

### Domain & Keyword Data

#### Domain
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| domain | VARCHAR(255) | UNIQUE, NOT NULL | Domain name |
| industry_id | UUID | FK → Industry | Industry category |
| authority_score | INT | 0-100 | Computed score |
| organic_keywords | INT | DEFAULT 0 | Total ranking keywords |
| organic_traffic | BIGINT | DEFAULT 0 | Est. monthly traffic |
| paid_keywords | INT | DEFAULT 0 | PPC keywords |
| backlinks_total | BIGINT | DEFAULT 0 | Total backlinks |
| referring_domains | INT | DEFAULT 0 | Unique ref. domains |
| updated_at | TIMESTAMP | NOT NULL | Last data update |

#### Keyword
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| keyword | VARCHAR(500) | NOT NULL | Keyword text |
| country | VARCHAR(10) | NOT NULL | Target country |
| volume | INT | DEFAULT 0 | Monthly searches |
| cpc | DECIMAL(10,2) | DEFAULT 0 | Cost per click |
| difficulty | INT | 0-100 | Keyword difficulty |
| intent | ENUM | NOT NULL | informational/navigational/commercial/transactional |
| serp_features | JSONB | | Array of SERP features |
| trend | JSONB | | 12-month trend data |
| group_id | UUID | FK → KeywordGroup | Keyword group |
| updated_at | TIMESTAMP | NOT NULL | Last update |

**Index:** (keyword, country) UNIQUE

#### KeywordGroup
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Group name |
| parent_id | UUID | FK → KeywordGroup | Parent (for subgroups) |
| keyword_count | INT | DEFAULT 0 | Keywords in group |

#### OrganicRank
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| domain_id | UUID | FK → Domain | Ranking domain |
| keyword_id | UUID | FK → Keyword | Ranked keyword |
| position | INT | NOT NULL | SERP position |
| url | VARCHAR(2048) | NOT NULL | Ranking URL |
| traffic_percent | DECIMAL(5,2) | | % of domain traffic |
| previous_position | INT | | Last position |
| updated_at | TIMESTAMP | NOT NULL | Last update |

**Index:** (domain_id, keyword_id) UNIQUE

### Backlink Data

#### Backlink
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| target_domain_id | UUID | FK → Domain | Target domain |
| source_domain | VARCHAR(255) | NOT NULL | Linking domain |
| source_url | VARCHAR(2048) | NOT NULL | Linking URL |
| target_url | VARCHAR(2048) | NOT NULL | Target URL |
| anchor | VARCHAR(500) | | Anchor text |
| is_dofollow | BOOLEAN | DEFAULT true | Follow status |
| is_image | BOOLEAN | DEFAULT false | Image link |
| authority_score | INT | 0-100 | Source authority |
| first_seen | DATE | NOT NULL | Discovery date |
| last_seen | DATE | NOT NULL | Last crawl date |
| is_lost | BOOLEAN | DEFAULT false | Link lost |
| toxicity_score | INT | 0-100 | Spam score |

**Index:** (target_domain_id, source_url)

### Site Audit Data

#### AuditUrl
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| project_id | UUID | FK → Project | Parent project |
| url | VARCHAR(2048) | NOT NULL | Page URL |
| status_code | INT | | HTTP status |
| content_type | VARCHAR(100) | | MIME type |
| word_count | INT | | Content words |
| load_time_ms | INT | | Page load time |
| crawl_depth | INT | | Depth from root |
| internal_links | INT | | Outbound internal |
| external_links | INT | | Outbound external |
| crawled_at | TIMESTAMP | NOT NULL | Crawl time |

**Index:** (project_id, url)

#### AuditIssue
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| audit_url_id | UUID | FK → AuditUrl | Affected URL |
| issue_type_id | UUID | FK → IssueType | Issue type |
| details | JSONB | | Issue-specific data |
| created_at | TIMESTAMP | NOT NULL | Detection time |

#### IssueType
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| code | VARCHAR(50) | UNIQUE | Issue code |
| name | VARCHAR(255) | NOT NULL | Display name |
| severity | ENUM | NOT NULL | error/warning/notice |
| category | VARCHAR(50) | NOT NULL | Thematic category |
| description | TEXT | | What it means |
| fix_instructions | TEXT | | How to fix |

### Position Tracking

#### TrackedKeyword
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| project_id | UUID | FK → Project | Parent project |
| keyword_id | UUID | FK → Keyword | Tracked keyword |
| tags | JSONB | | Custom tags |
| created_at | TIMESTAMP | NOT NULL | Added date |

**Index:** (project_id, keyword_id) UNIQUE

#### RankHistory
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| tracked_keyword_id | UUID | FK → TrackedKeyword | Keyword ref |
| date | DATE | NOT NULL | Ranking date |
| position | INT | | Position (null = not ranked) |
| url | VARCHAR(2048) | | Ranking URL |
| visibility | DECIMAL(5,2) | | Visibility score |
| estimated_traffic | INT | | Est. daily traffic |

**Index:** (tracked_keyword_id, date) UNIQUE

### Reference Tables

#### Industry
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Industry name |
| slug | VARCHAR(100) | UNIQUE | URL slug |

## Cardinality Definitions

| Relationship | Cardinality | Notes |
|--------------|-------------|-------|
| Workspace → Project | 1:N | A workspace has many projects |
| Project → Competitor | 1:N | A project tracks multiple competitors |
| Project → TrackedKeyword | 1:N | A project tracks many keywords |
| Project → AuditUrl | 1:N | An audit crawls many URLs |
| Domain → OrganicRank | 1:N | A domain ranks for many keywords |
| Keyword → OrganicRank | 1:N | A keyword has many domain rankings |
| Domain → Backlink | 1:N | A domain has many backlinks |
| AuditUrl → AuditIssue | 1:N | A URL may have many issues |
| IssueType → AuditIssue | 1:N | An issue type appears on many URLs |
| TrackedKeyword → RankHistory | 1:N | 90+ days of history per keyword |
| KeywordGroup → Keyword | 1:N | Group contains many keywords |
| KeywordGroup → KeywordGroup | 1:N | Groups can have subgroups |
| Industry → Domain | 1:N | Industry contains many domains |

## Indexing Strategy

### Primary Indexes (Automatic)
- All `id` columns (PK)
- All foreign key columns

### Additional Indexes

```sql
-- Keyword search
CREATE INDEX idx_keyword_text ON keyword USING gin (keyword gin_trgm_ops);
CREATE INDEX idx_keyword_volume ON keyword (volume DESC);
CREATE INDEX idx_keyword_difficulty ON keyword (difficulty);

-- Domain lookup
CREATE INDEX idx_domain_name ON domain (domain);
CREATE INDEX idx_domain_authority ON domain (authority_score DESC);

-- Backlink queries
CREATE INDEX idx_backlink_target ON backlink (target_domain_id, first_seen DESC);
CREATE INDEX idx_backlink_toxicity ON backlink (toxicity_score DESC) WHERE toxicity_score > 50;

-- Audit queries
CREATE INDEX idx_audit_issue_severity ON audit_issue (issue_type_id);
CREATE INDEX idx_audit_url_status ON audit_url (project_id, status_code);

-- Rank tracking
CREATE INDEX idx_rank_history_date ON rank_history (tracked_keyword_id, date DESC);

-- Organic rankings
CREATE INDEX idx_organic_rank_position ON organic_rank (domain_id, position);
```

## Data Volumes (Mock Mode)

| Table | Row Count |
|-------|-----------|
| Industry | 10 |
| Domain | 50+ |
| Keyword | 25,000+ |
| KeywordGroup | 500+ |
| OrganicRank | 100,000+ |
| Backlink | 200,000+ |
| AuditUrl | 100,000+ |
| AuditIssue | 250,000+ |
| IssueType | 50 |
| RankHistory | 90 days × keywords tracked |
