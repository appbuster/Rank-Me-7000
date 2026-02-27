import { prisma } from './db'

// ============================================================================
// TYPES
// ============================================================================

export interface TrafficData {
  id: string
  domain: string
  date: Date
  visits: number
  pageViews: number
  bounceRate: number
  avgDuration: number
  pagesPerVisit: number
  directTraffic: number
  searchTraffic: number
  socialTraffic: number
  referralTraffic: number
  paidTraffic: number
}

export interface MarketData {
  id: string
  industrySlug: string
  domain: string
  marketShare: number
  traffic: number
  growthRate: number
  date: Date
}

export interface TrafficSummary {
  totalVisits: number
  totalPageViews: number
  avgBounceRate: number
  avgDuration: number
  trafficSources: {
    direct: number
    search: number
    social: number
    referral: number
    paid: number
  }
}

// ============================================================================
// TRAFFIC DATA
// ============================================================================

export async function getTrafficData(domain: string, days = 30): Promise<TrafficData[]> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const traffic = await prisma.trafficData.findMany({
    where: {
      domain,
      date: { gte: startDate },
    },
    orderBy: { date: 'asc' },
  })

  return traffic.map((t) => ({
    id: t.id,
    domain: t.domain,
    date: t.date,
    visits: t.visits,
    pageViews: t.pageViews,
    bounceRate: t.bounceRate,
    avgDuration: t.avgDuration,
    pagesPerVisit: t.pagesPerVisit,
    directTraffic: t.directTraffic,
    searchTraffic: t.searchTraffic,
    socialTraffic: t.socialTraffic,
    referralTraffic: t.referralTraffic,
    paidTraffic: t.paidTraffic,
  }))
}

export async function getTrafficSummary(domain: string, days = 30): Promise<TrafficSummary | null> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const aggregates = await prisma.trafficData.aggregate({
    where: {
      domain,
      date: { gte: startDate },
    },
    _sum: {
      visits: true,
      pageViews: true,
    },
    _avg: {
      bounceRate: true,
      avgDuration: true,
      directTraffic: true,
      searchTraffic: true,
      socialTraffic: true,
      referralTraffic: true,
      paidTraffic: true,
    },
  })

  if (!aggregates._sum.visits) return null

  return {
    totalVisits: aggregates._sum.visits || 0,
    totalPageViews: aggregates._sum.pageViews || 0,
    avgBounceRate: Number((aggregates._avg.bounceRate || 0).toFixed(1)),
    avgDuration: Math.round(aggregates._avg.avgDuration || 0),
    trafficSources: {
      direct: Number((aggregates._avg.directTraffic || 0).toFixed(1)),
      search: Number((aggregates._avg.searchTraffic || 0).toFixed(1)),
      social: Number((aggregates._avg.socialTraffic || 0).toFixed(1)),
      referral: Number((aggregates._avg.referralTraffic || 0).toFixed(1)),
      paid: Number((aggregates._avg.paidTraffic || 0).toFixed(1)),
    },
  }
}

export async function getTopDomainsByTraffic(days = 30, limit = 20): Promise<{
  domain: string
  totalVisits: number
  avgBounceRate: number
}[]> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const results = await prisma.trafficData.groupBy({
    by: ['domain'],
    where: { date: { gte: startDate } },
    _sum: { visits: true },
    _avg: { bounceRate: true },
    orderBy: { _sum: { visits: 'desc' } },
    take: limit,
  })

  return results.map((r) => ({
    domain: r.domain,
    totalVisits: r._sum.visits || 0,
    avgBounceRate: Number((r._avg.bounceRate || 0).toFixed(1)),
  }))
}

// ============================================================================
// MARKET DATA
// ============================================================================

export async function getMarketOverview(industrySlug: string): Promise<MarketData[]> {
  const latestDate = await prisma.marketData.findFirst({
    where: { industrySlug },
    orderBy: { date: 'desc' },
    select: { date: true },
  })

  if (!latestDate) return []

  const market = await prisma.marketData.findMany({
    where: {
      industrySlug,
      date: latestDate.date,
    },
    orderBy: { marketShare: 'desc' },
    take: 20,
  })

  return market.map((m) => ({
    id: m.id,
    industrySlug: m.industrySlug,
    domain: m.domain,
    marketShare: m.marketShare,
    traffic: m.traffic,
    growthRate: m.growthRate,
    date: m.date,
  }))
}

export async function getIndustryList(): Promise<string[]> {
  const industries = await prisma.marketData.groupBy({
    by: ['industrySlug'],
  })

  return industries.map((i) => i.industrySlug)
}

export async function getDomainMarketTrend(
  domain: string,
  days = 30
): Promise<{ date: Date; marketShare: number; traffic: number }[]> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const data = await prisma.marketData.findMany({
    where: {
      domain,
      date: { gte: startDate },
    },
    orderBy: { date: 'asc' },
    select: { date: true, marketShare: true, traffic: true },
  })

  return data.map((d) => ({
    date: d.date,
    marketShare: d.marketShare,
    traffic: d.traffic,
  }))
}
