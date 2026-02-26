import { prisma } from './db'

// ============================================================================
// TYPES
// ============================================================================

export interface DomainComparisonInput {
  primaryDomain: string
  competitorDomains: string[]
}

export interface KeywordGapResult {
  keyword: string
  keywordId: string
  volume: number
  difficulty: number
  intent: string
  positions: Record<string, number | null> // domain -> position
  type: 'shared' | 'missing' | 'weak' | 'strong' | 'untapped'
}

export interface KeywordGapSummary {
  primaryDomain: string
  competitors: string[]
  totalKeywords: number
  sharedCount: number
  missingCount: number
  weakCount: number
  strongCount: number
  untappedCount: number
  keywords: KeywordGapResult[]
}

export interface BacklinkGapResult {
  sourceDomain: string
  sourceAuthorityScore: number
  linksTo: Record<string, boolean> // domain -> has backlink
  type: 'shared' | 'exclusive' | 'opportunity'
}

export interface BacklinkGapSummary {
  primaryDomain: string
  competitors: string[]
  totalReferringDomains: number
  sharedCount: number
  exclusiveCount: number
  opportunityCount: number
  referringDomains: BacklinkGapResult[]
}

// ============================================================================
// KEYWORD GAP ANALYSIS
// ============================================================================

export async function getKeywordGap(input: DomainComparisonInput): Promise<KeywordGapSummary | null> {
  const { primaryDomain, competitorDomains } = input
  const allDomains = [primaryDomain, ...competitorDomains]

  // Get all domain IDs
  const domains = await prisma.domain.findMany({
    where: {
      domain: { in: allDomains },
    },
    select: { id: true, domain: true },
  })

  if (domains.length === 0) return null

  const domainNameMap = new Map(domains.map((d) => [d.id, d.domain]))

  // Get all organic ranks for these domains
  const organicRanks = await prisma.organicRank.findMany({
    where: {
      domainId: { in: domains.map((d) => d.id) },
    },
    include: {
      keyword: true,
    },
  })

  // Group by keyword
  const keywordMap = new Map<
    string,
    {
      keyword: string
      keywordId: string
      volume: number
      difficulty: number
      intent: string
      positions: Record<string, number | null>
    }
  >()

  for (const rank of organicRanks) {
    const domainName = domainNameMap.get(rank.domainId)
    if (!domainName) continue

    const existing = keywordMap.get(rank.keywordId)
    if (existing) {
      existing.positions[domainName] = rank.position
    } else {
      const positions: Record<string, number | null> = {}
      for (const d of allDomains) {
        positions[d] = null
      }
      positions[domainName] = rank.position
      keywordMap.set(rank.keywordId, {
        keyword: rank.keyword.keyword,
        keywordId: rank.keywordId,
        volume: rank.keyword.volume,
        difficulty: rank.keyword.difficulty,
        intent: rank.keyword.intent,
        positions,
      })
    }
  }

  // Classify keywords
  const results: KeywordGapResult[] = []
  let sharedCount = 0
  let missingCount = 0
  let weakCount = 0
  let strongCount = 0
  let untappedCount = 0

  for (const [, data] of keywordMap) {
    const primaryPos = data.positions[primaryDomain]
    const competitorPositions = competitorDomains.map((d) => data.positions[d]).filter((p) => p !== null)
    const hasCompetitorRanking = competitorPositions.length > 0
    const bestCompetitorPos = hasCompetitorRanking ? Math.min(...(competitorPositions as number[])) : null

    let type: KeywordGapResult['type']

    if (primaryPos === null && hasCompetitorRanking) {
      // Primary domain doesn't rank, but competitors do
      type = 'missing'
      missingCount++
    } else if (primaryPos !== null && !hasCompetitorRanking) {
      // Only primary domain ranks
      type = 'untapped'
      untappedCount++
    } else if (primaryPos !== null && bestCompetitorPos !== null) {
      if (primaryPos < bestCompetitorPos) {
        // Primary ranks better
        type = 'strong'
        strongCount++
      } else if (primaryPos > bestCompetitorPos) {
        // Competitors rank better
        type = 'weak'
        weakCount++
      } else {
        // Same position
        type = 'shared'
        sharedCount++
      }
    } else {
      type = 'shared'
      sharedCount++
    }

    results.push({
      ...data,
      type,
    })
  }

  // Sort by volume descending
  results.sort((a, b) => b.volume - a.volume)

  return {
    primaryDomain,
    competitors: competitorDomains,
    totalKeywords: results.length,
    sharedCount,
    missingCount,
    weakCount,
    strongCount,
    untappedCount,
    keywords: results.slice(0, 500), // Limit to 500 for performance
  }
}

// ============================================================================
// BACKLINK GAP ANALYSIS
// ============================================================================

export async function getBacklinkGap(input: DomainComparisonInput): Promise<BacklinkGapSummary | null> {
  const { primaryDomain, competitorDomains } = input
  const allDomains = [primaryDomain, ...competitorDomains]

  // Get all domain IDs
  const domains = await prisma.domain.findMany({
    where: {
      domain: { in: allDomains },
    },
    select: { id: true, domain: true },
  })

  if (domains.length === 0) return null

  const domainNameMap = new Map(domains.map((d) => [d.id, d.domain]))

  // Get all backlinks for these domains
  const backlinks = await prisma.backlink.findMany({
    where: {
      targetDomainId: { in: domains.map((d) => d.id) },
      isLost: false,
    },
    select: {
      sourceDomain: true,
      targetDomainId: true,
      authorityScore: true,
    },
  })

  // Group by source domain
  const sourceMap = new Map<
    string,
    {
      sourceDomain: string
      sourceAuthorityScore: number
      linksTo: Record<string, boolean>
    }
  >()

  for (const link of backlinks) {
    const targetDomain = domainNameMap.get(link.targetDomainId)
    if (!targetDomain) continue

    const existing = sourceMap.get(link.sourceDomain)
    if (existing) {
      existing.linksTo[targetDomain] = true
      // Keep highest authority score
      if (link.authorityScore > existing.sourceAuthorityScore) {
        existing.sourceAuthorityScore = link.authorityScore
      }
    } else {
      const linksTo: Record<string, boolean> = {}
      for (const d of allDomains) {
        linksTo[d] = false
      }
      linksTo[targetDomain] = true
      sourceMap.set(link.sourceDomain, {
        sourceDomain: link.sourceDomain,
        sourceAuthorityScore: link.authorityScore,
        linksTo,
      })
    }
  }

  // Classify referring domains
  const results: BacklinkGapResult[] = []
  let sharedCount = 0
  let exclusiveCount = 0
  let opportunityCount = 0

  for (const [, data] of sourceMap) {
    const linksToPrimary = data.linksTo[primaryDomain]
    const linksToCompetitors = competitorDomains.some((d) => data.linksTo[d])

    let type: BacklinkGapResult['type']

    if (linksToPrimary && linksToCompetitors) {
      type = 'shared'
      sharedCount++
    } else if (linksToPrimary && !linksToCompetitors) {
      type = 'exclusive'
      exclusiveCount++
    } else if (!linksToPrimary && linksToCompetitors) {
      type = 'opportunity'
      opportunityCount++
    } else {
      continue // Shouldn't happen
    }

    results.push({
      ...data,
      type,
    })
  }

  // Sort by authority score descending
  results.sort((a, b) => b.sourceAuthorityScore - a.sourceAuthorityScore)

  return {
    primaryDomain,
    competitors: competitorDomains,
    totalReferringDomains: results.length,
    sharedCount,
    exclusiveCount,
    opportunityCount,
    referringDomains: results.slice(0, 500), // Limit to 500
  }
}

// ============================================================================
// DOMAIN SEARCH (for autocomplete)
// ============================================================================

export async function searchDomainsForGap(query: string, limit = 10): Promise<string[]> {
  const domains = await prisma.domain.findMany({
    where: {
      domain: {
        contains: query.toLowerCase(),
      },
    },
    select: { domain: true },
    take: limit,
    orderBy: { authorityScore: 'desc' },
  })

  return domains.map((d) => d.domain)
}
