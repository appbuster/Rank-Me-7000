import { prisma } from './db'

// ============================================================================
// TYPES
// ============================================================================

export interface AIMention {
  id: string
  brand: string
  aiPlatform: string
  query: string
  mentioned: boolean
  position: number | null
  sentiment: string
  context: string | null
  competitors: string[]
  checkedAt: Date
}

export interface AIPrCampaign {
  id: string
  name: string
  brand: string
  status: string
  targetAudience: string[]
  keyMessages: string[]
  mediaOutlets: string[]
  pitchTemplate: string | null
  sentCount: number
  openCount: number
  replyCount: number
  placementCount: number
  createdAt: Date
  updatedAt: Date
}

export interface AIVisibilityStats {
  totalQueries: number
  mentionRate: number
  avgPosition: number
  sentimentBreakdown: { sentiment: string; count: number }[]
  platformBreakdown: { platform: string; mentions: number; total: number }[]
}

export interface AIPrStats {
  totalCampaigns: number
  activeCampaigns: number
  totalSent: number
  totalPlacements: number
  avgOpenRate: number
  avgReplyRate: number
}

// ============================================================================
// AI VISIBILITY
// ============================================================================

export async function getAIMentions(options: {
  brand?: string
  aiPlatform?: string
  mentioned?: boolean
  limit?: number
} = {}): Promise<AIMention[]> {
  const { brand, aiPlatform, mentioned, limit = 100 } = options

  const mentions = await prisma.aIMention.findMany({
    where: {
      ...(brand && { brand: { contains: brand } }),
      ...(aiPlatform && { aiPlatform }),
      ...(mentioned !== undefined && { mentioned }),
    },
    orderBy: { checkedAt: 'desc' },
    take: limit,
  })

  return mentions.map((m) => ({
    id: m.id,
    brand: m.brand,
    aiPlatform: m.aiPlatform,
    query: m.query,
    mentioned: m.mentioned,
    position: m.position,
    sentiment: m.sentiment,
    context: m.context,
    competitors: m.competitors ? JSON.parse(m.competitors) : [],
    checkedAt: m.checkedAt,
  }))
}

export async function getAIVisibilityStats(brand?: string): Promise<AIVisibilityStats> {
  const where = brand ? { brand: { contains: brand } } : {}

  const [total, mentioned, avgPosition, sentiments, platforms] = await Promise.all([
    prisma.aIMention.count({ where }),
    prisma.aIMention.count({ where: { ...where, mentioned: true } }),
    prisma.aIMention.aggregate({
      where: { ...where, mentioned: true, position: { not: null } },
      _avg: { position: true },
    }),
    prisma.aIMention.groupBy({
      by: ['sentiment'],
      where: { ...where, mentioned: true },
      _count: { id: true },
    }),
    prisma.aIMention.groupBy({
      by: ['aiPlatform'],
      where,
      _count: { id: true },
    }),
  ])

  // Get mentions per platform
  const platformMentions = await prisma.aIMention.groupBy({
    by: ['aiPlatform'],
    where: { ...where, mentioned: true },
    _count: { id: true },
  })

  const platformMap = new Map(platformMentions.map((p) => [p.aiPlatform, p._count.id]))

  return {
    totalQueries: total,
    mentionRate: total > 0 ? Number(((mentioned / total) * 100).toFixed(1)) : 0,
    avgPosition: avgPosition._avg.position ? Number(avgPosition._avg.position.toFixed(1)) : 0,
    sentimentBreakdown: sentiments.map((s) => ({
      sentiment: s.sentiment,
      count: s._count.id,
    })),
    platformBreakdown: platforms.map((p) => ({
      platform: p.aiPlatform,
      mentions: platformMap.get(p.aiPlatform) || 0,
      total: p._count.id,
    })),
  }
}

export async function getBrandMentionTrend(brand: string, days = 30): Promise<{
  date: string
  mentioned: number
  notMentioned: number
}[]> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const mentions = await prisma.aIMention.findMany({
    where: {
      brand: { contains: brand },
      checkedAt: { gte: startDate },
    },
    select: { checkedAt: true, mentioned: true },
    orderBy: { checkedAt: 'asc' },
  })

  // Group by date
  const byDate = new Map<string, { mentioned: number; notMentioned: number }>()

  for (const m of mentions) {
    const dateStr = m.checkedAt.toISOString().split('T')[0]
    const existing = byDate.get(dateStr) || { mentioned: 0, notMentioned: 0 }
    if (m.mentioned) {
      existing.mentioned++
    } else {
      existing.notMentioned++
    }
    byDate.set(dateStr, existing)
  }

  return Array.from(byDate.entries()).map(([date, data]) => ({
    date,
    ...data,
  }))
}

// ============================================================================
// AI PR CAMPAIGNS
// ============================================================================

export async function getAIPrCampaigns(options: {
  brand?: string
  status?: string
  limit?: number
} = {}): Promise<AIPrCampaign[]> {
  const { brand, status, limit = 50 } = options

  const campaigns = await prisma.aIPrCampaign.findMany({
    where: {
      ...(brand && { brand: { contains: brand } }),
      ...(status && { status }),
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
  })

  return campaigns.map((c) => ({
    id: c.id,
    name: c.name,
    brand: c.brand,
    status: c.status,
    targetAudience: c.targetAudience ? JSON.parse(c.targetAudience) : [],
    keyMessages: c.keyMessages ? JSON.parse(c.keyMessages) : [],
    mediaOutlets: c.mediaOutlets ? JSON.parse(c.mediaOutlets) : [],
    pitchTemplate: c.pitchTemplate,
    sentCount: c.sentCount,
    openCount: c.openCount,
    replyCount: c.replyCount,
    placementCount: c.placementCount,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }))
}

export async function getAIPrStats(): Promise<AIPrStats> {
  const [total, active, aggregates] = await Promise.all([
    prisma.aIPrCampaign.count(),
    prisma.aIPrCampaign.count({ where: { status: 'active' } }),
    prisma.aIPrCampaign.aggregate({
      _sum: {
        sentCount: true,
        openCount: true,
        replyCount: true,
        placementCount: true,
      },
    }),
  ])

  const totalSent = aggregates._sum.sentCount || 0
  const totalOpen = aggregates._sum.openCount || 0
  const totalReply = aggregates._sum.replyCount || 0

  return {
    totalCampaigns: total,
    activeCampaigns: active,
    totalSent,
    totalPlacements: aggregates._sum.placementCount || 0,
    avgOpenRate: totalSent > 0 ? Number(((totalOpen / totalSent) * 100).toFixed(1)) : 0,
    avgReplyRate: totalSent > 0 ? Number(((totalReply / totalSent) * 100).toFixed(1)) : 0,
  }
}
