import { prisma } from './db'

export interface TrackedKeywordSummary {
  id: string
  keyword: string
  volume: number
  currentPosition: number | null
  previousPosition: number | null
  bestPosition: number | null
  worstPosition: number | null
  estimatedTraffic: number | null
  trend: 'up' | 'down' | 'stable'
}

export interface RankHistoryPoint {
  date: Date
  position: number | null
  url: string | null
  visibility: number | null
  estimatedTraffic: number | null
}

export interface ProjectTrackingSummary {
  totalKeywords: number
  avgPosition: number
  improved: number
  declined: number
  unchanged: number
  topPositions: number // positions 1-3
  firstPage: number // positions 1-10
}

export async function getProjectTrackingSummary(projectId: string): Promise<ProjectTrackingSummary> {
  const tracked = await prisma.trackedKeyword.findMany({
    where: { projectId },
    include: {
      rankHistory: {
        orderBy: { date: 'desc' },
        take: 2,
      },
    },
  })

  const totalKeywords = tracked.length
  let totalPosition = 0
  let positionCount = 0
  let improved = 0
  let declined = 0
  let unchanged = 0
  let topPositions = 0
  let firstPage = 0

  for (const kw of tracked) {
    const latest = kw.rankHistory[0]
    const previous = kw.rankHistory[1]

    if (latest?.position) {
      totalPosition += latest.position
      positionCount++

      if (latest.position <= 3) topPositions++
      if (latest.position <= 10) firstPage++

      if (previous?.position) {
        if (latest.position < previous.position) improved++
        else if (latest.position > previous.position) declined++
        else unchanged++
      }
    }
  }

  return {
    totalKeywords,
    avgPosition: positionCount > 0 ? Math.round(totalPosition / positionCount * 10) / 10 : 0,
    improved,
    declined,
    unchanged,
    topPositions,
    firstPage,
  }
}

export async function getTrackedKeywords(
  projectId: string,
  options: { limit?: number; offset?: number } = {}
): Promise<TrackedKeywordSummary[]> {
  const { limit = 100, offset = 0 } = options

  const tracked = await prisma.trackedKeyword.findMany({
    where: { projectId },
    include: {
      keyword: true,
      rankHistory: {
        orderBy: { date: 'desc' },
        take: 7, // Last week for trend calculation
      },
    },
    take: limit,
    skip: offset,
  })

  return tracked.map((t) => {
    const positions = t.rankHistory.filter((h) => h.position).map((h) => h.position!)
    const current = positions[0] ?? null
    const previous = positions[1] ?? null
    const best = positions.length > 0 ? Math.min(...positions) : null
    const worst = positions.length > 0 ? Math.max(...positions) : null

    let trend: 'up' | 'down' | 'stable' = 'stable'
    if (current && previous) {
      if (current < previous) trend = 'up'
      else if (current > previous) trend = 'down'
    }

    return {
      id: t.id,
      keyword: t.keyword.keyword,
      volume: t.keyword.volume,
      currentPosition: current,
      previousPosition: previous,
      bestPosition: best,
      worstPosition: worst,
      estimatedTraffic: t.rankHistory[0]?.estimatedTraffic ?? null,
      trend,
    }
  })
}

export async function getKeywordRankHistory(
  trackedKeywordId: string,
  days = 30
): Promise<RankHistoryPoint[]> {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const history = await prisma.rankHistory.findMany({
    where: {
      trackedKeywordId,
      date: { gte: since },
    },
    orderBy: { date: 'asc' },
  })

  return history.map((h) => ({
    date: h.date,
    position: h.position,
    url: h.url,
    visibility: h.visibility ? Number(h.visibility) : null,
    estimatedTraffic: h.estimatedTraffic,
  }))
}

export async function getAggregatedRankHistory(
  projectId: string,
  days = 30
): Promise<{ date: string; avgPosition: number; totalTraffic: number }[]> {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const history = await prisma.rankHistory.findMany({
    where: {
      trackedKeyword: { projectId },
      date: { gte: since },
    },
    orderBy: { date: 'asc' },
  })

  // Group by date
  const byDate = new Map<string, { positions: number[]; traffic: number }>()

  for (const h of history) {
    const dateStr = h.date.toISOString().split('T')[0]
    const existing = byDate.get(dateStr)
    if (existing) {
      if (h.position) existing.positions.push(h.position)
      existing.traffic += h.estimatedTraffic ?? 0
    } else {
      byDate.set(dateStr, {
        positions: h.position ? [h.position] : [],
        traffic: h.estimatedTraffic ?? 0,
      })
    }
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({
      date,
      avgPosition:
        data.positions.length > 0
          ? Math.round((data.positions.reduce((a, b) => a + b, 0) / data.positions.length) * 10) / 10
          : 0,
      totalTraffic: data.traffic,
    }))
}
