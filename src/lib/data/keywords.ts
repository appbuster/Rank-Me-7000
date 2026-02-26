import { prisma } from './db'

export interface KeywordOverview {
  id: string
  keyword: string
  country: string
  volume: number
  cpc: number
  difficulty: number
  intent: string
  trend: string | null
}

export interface KeywordRanking {
  domain: string
  position: number
  url: string
  trafficPercent: number | null
  authorityScore: number
}

export interface KeywordGroup {
  id: string
  name: string
  keywordCount: number
  parentId: string | null
}

export async function getKeywordOverview(keyword: string, country = 'us'): Promise<KeywordOverview | null> {
  const result = await prisma.keyword.findFirst({
    where: { keyword, country },
  })

  if (!result) return null

  return {
    id: result.id,
    keyword: result.keyword,
    country: result.country,
    volume: result.volume,
    cpc: Number(result.cpc),
    difficulty: result.difficulty,
    intent: result.intent,
    trend: result.trend,
  }
}

export async function getKeywordRankings(keywordId: string, limit = 100): Promise<KeywordRanking[]> {
  const rankings = await prisma.organicRank.findMany({
    where: { keywordId },
    include: {
      domain: true,
    },
    orderBy: { position: 'asc' },
    take: limit,
  })

  return rankings.map((r) => ({
    domain: r.domain.domain,
    position: r.position,
    url: r.url,
    trafficPercent: r.trafficPercent ? Number(r.trafficPercent) : null,
    authorityScore: r.domain.authorityScore,
  }))
}

export async function searchKeywords(
  query: string,
  options: { limit?: number; country?: string } = {}
): Promise<KeywordOverview[]> {
  const { limit = 50, country } = options

  const keywords = await prisma.keyword.findMany({
    where: {
      keyword: {
        contains: query,
      },
      ...(country && { country }),
    },
    orderBy: { volume: 'desc' },
    take: limit,
  })

  return keywords.map((k) => ({
    id: k.id,
    keyword: k.keyword,
    country: k.country,
    volume: k.volume,
    cpc: Number(k.cpc),
    difficulty: k.difficulty,
    intent: k.intent,
    trend: k.trend,
  }))
}

export async function getKeywordGroups(parentId?: string): Promise<KeywordGroup[]> {
  const groups = await prisma.keywordGroup.findMany({
    where: parentId ? { parentId } : { parentId: null },
    include: {
      _count: {
        select: { keywords: true },
      },
    },
  })

  return groups.map((g) => ({
    id: g.id,
    name: g.name,
    keywordCount: g._count.keywords,
    parentId: g.parentId,
  }))
}

export async function getKeywordsByGroup(groupId: string, limit = 100): Promise<KeywordOverview[]> {
  const keywords = await prisma.keyword.findMany({
    where: { groupId },
    orderBy: { volume: 'desc' },
    take: limit,
  })

  return keywords.map((k) => ({
    id: k.id,
    keyword: k.keyword,
    country: k.country,
    volume: k.volume,
    cpc: Number(k.cpc),
    difficulty: k.difficulty,
    intent: k.intent,
    trend: k.trend,
  }))
}

export async function getTopKeywords(limit = 100): Promise<KeywordOverview[]> {
  const keywords = await prisma.keyword.findMany({
    orderBy: { volume: 'desc' },
    take: limit,
  })

  return keywords.map((k) => ({
    id: k.id,
    keyword: k.keyword,
    country: k.country,
    volume: k.volume,
    cpc: Number(k.cpc),
    difficulty: k.difficulty,
    intent: k.intent,
    trend: k.trend,
  }))
}
