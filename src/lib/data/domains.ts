import { prisma } from './db'

export interface DomainOverview {
  id: string
  domain: string
  industry: string | null
  authorityScore: number
  organicKeywords: number
  organicTraffic: number
  paidKeywords: number
  backlinksTotal: number
  referringDomains: number
}

export interface DomainRanking {
  id: string
  keyword: string
  position: number
  previousPosition: number | null
  volume: number
  url: string
  trafficPercent: number | null
  difficulty: number
}

export interface DomainBacklink {
  id: string
  sourceDomain: string
  sourceUrl: string
  targetUrl: string
  anchor: string | null
  isDofollow: boolean
  authorityScore: number
  firstSeen: Date
  isLost: boolean
  toxicityScore: number
}

export async function getDomainOverview(domain: string): Promise<DomainOverview | null> {
  const result = await prisma.domain.findUnique({
    where: { domain },
    include: {
      industry: true,
    },
  })

  if (!result) return null

  return {
    id: result.id,
    domain: result.domain,
    industry: result.industry?.name ?? null,
    authorityScore: result.authorityScore,
    organicKeywords: result.organicKeywords,
    organicTraffic: result.organicTraffic,
    paidKeywords: result.paidKeywords,
    backlinksTotal: result.backlinksTotal,
    referringDomains: result.referringDomains,
  }
}

export async function getDomainRankings(
  domainId: string,
  options: { limit?: number; offset?: number } = {}
): Promise<DomainRanking[]> {
  const { limit = 100, offset = 0 } = options

  const rankings = await prisma.organicRank.findMany({
    where: { domainId },
    include: {
      keyword: true,
    },
    orderBy: { position: 'asc' },
    take: limit,
    skip: offset,
  })

  return rankings.map((r) => ({
    id: r.id,
    keyword: r.keyword.keyword,
    position: r.position,
    previousPosition: r.previousPosition,
    volume: r.keyword.volume,
    url: r.url,
    trafficPercent: r.trafficPercent ? Number(r.trafficPercent) : null,
    difficulty: r.keyword.difficulty,
  }))
}

export async function getDomainBacklinks(
  domainId: string,
  options: { limit?: number; offset?: number } = {}
): Promise<DomainBacklink[]> {
  const { limit = 100, offset = 0 } = options

  const backlinks = await prisma.backlink.findMany({
    where: { targetDomainId: domainId },
    orderBy: { firstSeen: 'desc' },
    take: limit,
    skip: offset,
  })

  return backlinks.map((b) => ({
    id: b.id,
    sourceDomain: b.sourceDomain,
    sourceUrl: b.sourceUrl,
    targetUrl: b.targetUrl,
    anchor: b.anchor,
    isDofollow: b.isDofollow,
    authorityScore: b.authorityScore,
    firstSeen: b.firstSeen,
    isLost: b.isLost,
    toxicityScore: b.toxicityScore,
  }))
}

export async function searchDomains(query: string, limit = 10): Promise<DomainOverview[]> {
  const domains = await prisma.domain.findMany({
    where: {
      domain: {
        contains: query,
      },
    },
    include: {
      industry: true,
    },
    take: limit,
  })

  return domains.map((d) => ({
    id: d.id,
    domain: d.domain,
    industry: d.industry?.name ?? null,
    authorityScore: d.authorityScore,
    organicKeywords: d.organicKeywords,
    organicTraffic: d.organicTraffic,
    paidKeywords: d.paidKeywords,
    backlinksTotal: d.backlinksTotal,
    referringDomains: d.referringDomains,
  }))
}

export async function getTopDomains(limit = 10): Promise<DomainOverview[]> {
  const domains = await prisma.domain.findMany({
    include: {
      industry: true,
    },
    orderBy: { authorityScore: 'desc' },
    take: limit,
  })

  return domains.map((d) => ({
    id: d.id,
    domain: d.domain,
    industry: d.industry?.name ?? null,
    authorityScore: d.authorityScore,
    organicKeywords: d.organicKeywords,
    organicTraffic: d.organicTraffic,
    paidKeywords: d.paidKeywords,
    backlinksTotal: d.backlinksTotal,
    referringDomains: d.referringDomains,
  }))
}
