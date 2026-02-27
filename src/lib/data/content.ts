import { prisma } from './db'

// ============================================================================
// TYPES
// ============================================================================

export interface TopicIdea {
  id: string
  topic: string
  keyword: string
  volume: number
  difficulty: number
  trendScore: number
  questions: string[]
  relatedTopics: string[]
  contentType: string
}

export interface ContentPiece {
  id: string
  url: string
  title: string
  wordCount: number
  readingTime: number
  seoScore: number
  readability: number
  targetKeyword: string | null
  lastUpdated: Date
  status: string
  issues: string[]
}

export interface ContentStats {
  totalPieces: number
  averageSeoScore: number
  averageWordCount: number
  needsUpdate: number
  byStatus: { status: string; count: number }[]
}

// ============================================================================
// TOPIC RESEARCH
// ============================================================================

export async function getTopicIdeas(options: {
  contentType?: string
  minVolume?: number
  limit?: number
} = {}): Promise<TopicIdea[]> {
  const { contentType, minVolume = 0, limit = 50 } = options

  const topics = await prisma.topicIdea.findMany({
    where: {
      ...(contentType && { contentType }),
      volume: { gte: minVolume },
    },
    orderBy: { trendScore: 'desc' },
    take: limit,
  })

  return topics.map((t) => ({
    id: t.id,
    topic: t.topic,
    keyword: t.keyword,
    volume: t.volume,
    difficulty: t.difficulty,
    trendScore: t.trendScore,
    questions: t.questions ? JSON.parse(t.questions) : [],
    relatedTopics: t.relatedTopics ? JSON.parse(t.relatedTopics) : [],
    contentType: t.contentType,
  }))
}

export async function getTrendingTopics(limit = 10): Promise<TopicIdea[]> {
  return getTopicIdeas({ limit })
}

// ============================================================================
// CONTENT AUDIT
// ============================================================================

export async function getContentPieces(options: {
  status?: string
  minSeoScore?: number
  maxSeoScore?: number
  limit?: number
} = {}): Promise<ContentPiece[]> {
  const { status, minSeoScore, maxSeoScore, limit = 100 } = options

  const pieces = await prisma.contentPiece.findMany({
    where: {
      ...(status && { status }),
      ...(minSeoScore !== undefined && { seoScore: { gte: minSeoScore } }),
      ...(maxSeoScore !== undefined && { seoScore: { lte: maxSeoScore } }),
    },
    orderBy: { seoScore: 'asc' },
    take: limit,
  })

  return pieces.map((p) => ({
    id: p.id,
    url: p.url,
    title: p.title,
    wordCount: p.wordCount,
    readingTime: p.readingTime,
    seoScore: p.seoScore,
    readability: p.readability,
    targetKeyword: p.targetKeyword,
    lastUpdated: p.lastUpdated,
    status: p.status,
    issues: p.issues ? JSON.parse(p.issues) : [],
  }))
}

export async function getContentStats(): Promise<ContentStats> {
  const [pieces, statusCounts] = await Promise.all([
    prisma.contentPiece.aggregate({
      _count: { id: true },
      _avg: { seoScore: true, wordCount: true },
    }),
    prisma.contentPiece.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
  ])

  const needsUpdate = await prisma.contentPiece.count({
    where: { status: 'needs-update' },
  })

  return {
    totalPieces: pieces._count.id,
    averageSeoScore: Math.round(pieces._avg.seoScore || 0),
    averageWordCount: Math.round(pieces._avg.wordCount || 0),
    needsUpdate,
    byStatus: statusCounts.map((s) => ({
      status: s.status,
      count: s._count.id,
    })),
  }
}

export async function getLowScoringContent(limit = 20): Promise<ContentPiece[]> {
  return getContentPieces({ maxSeoScore: 60, limit })
}
