import { prisma } from './db'

// ============================================================================
// TYPES
// ============================================================================

export interface PpcKeyword {
  id: string
  keyword: string
  volume: number
  cpc: number
  competition: number
  competitorAds: number
  trend: number[]
  lastSeen: Date
  adCopies: { headline: string; description: string }[]
}

export interface AdCampaign {
  id: string
  domain: string
  platform: string
  campaignType: string
  budget: number | null
  startDate: Date
  endDate: Date | null
  status: string
  impressions: number
  clicks: number
  conversions: number
  spend: number
  ctr: number
  conversionRate: number
}

export interface AdCreative {
  id: string
  campaignId: string
  headline: string
  description: string | null
  displayUrl: string | null
  finalUrl: string | null
  format: string
  impressions: number
  clicks: number
  ctr: number
  firstSeen: Date
  lastSeen: Date
}

export interface AdvertisingStats {
  totalCampaigns: number
  activeCampaigns: number
  totalSpend: number
  totalImpressions: number
  totalClicks: number
  avgCtr: number
}

// ============================================================================
// PPC KEYWORDS
// ============================================================================

export async function getPpcKeywords(options: {
  minVolume?: number
  maxCpc?: number
  limit?: number
} = {}): Promise<PpcKeyword[]> {
  const { minVolume = 0, maxCpc, limit = 100 } = options

  const keywords = await prisma.ppcKeyword.findMany({
    where: {
      volume: { gte: minVolume },
      ...(maxCpc !== undefined && { cpc: { lte: maxCpc } }),
    },
    orderBy: { volume: 'desc' },
    take: limit,
  })

  return keywords.map((k) => ({
    id: k.id,
    keyword: k.keyword,
    volume: k.volume,
    cpc: k.cpc,
    competition: k.competition,
    competitorAds: k.competitorAds,
    trend: k.trend ? JSON.parse(k.trend) : [],
    lastSeen: k.lastSeen,
    adCopies: k.adCopies ? JSON.parse(k.adCopies) : [],
  }))
}

export async function searchPpcKeywords(query: string, limit = 20): Promise<PpcKeyword[]> {
  const keywords = await prisma.ppcKeyword.findMany({
    where: {
      keyword: { contains: query },
    },
    orderBy: { volume: 'desc' },
    take: limit,
  })

  return keywords.map((k) => ({
    id: k.id,
    keyword: k.keyword,
    volume: k.volume,
    cpc: k.cpc,
    competition: k.competition,
    competitorAds: k.competitorAds,
    trend: k.trend ? JSON.parse(k.trend) : [],
    lastSeen: k.lastSeen,
    adCopies: k.adCopies ? JSON.parse(k.adCopies) : [],
  }))
}

// ============================================================================
// AD CAMPAIGNS
// ============================================================================

export async function getAdCampaigns(options: {
  domain?: string
  platform?: string
  status?: string
  limit?: number
} = {}): Promise<AdCampaign[]> {
  const { domain, platform, status, limit = 50 } = options

  const campaigns = await prisma.adCampaign.findMany({
    where: {
      ...(domain && { domain: { contains: domain } }),
      ...(platform && { platform }),
      ...(status && { status }),
    },
    orderBy: { startDate: 'desc' },
    take: limit,
  })

  return campaigns.map((c) => ({
    id: c.id,
    domain: c.domain,
    platform: c.platform,
    campaignType: c.campaignType,
    budget: c.budget,
    startDate: c.startDate,
    endDate: c.endDate,
    status: c.status,
    impressions: c.impressions,
    clicks: c.clicks,
    conversions: c.conversions,
    spend: c.spend,
    ctr: c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0,
    conversionRate: c.clicks > 0 ? (c.conversions / c.clicks) * 100 : 0,
  }))
}

export async function getAdvertisingStats(): Promise<AdvertisingStats> {
  const [total, active, aggregates] = await Promise.all([
    prisma.adCampaign.count(),
    prisma.adCampaign.count({ where: { status: 'active' } }),
    prisma.adCampaign.aggregate({
      _sum: {
        spend: true,
        impressions: true,
        clicks: true,
      },
    }),
  ])

  const totalImpressions = aggregates._sum.impressions || 0
  const totalClicks = aggregates._sum.clicks || 0

  return {
    totalCampaigns: total,
    activeCampaigns: active,
    totalSpend: aggregates._sum.spend || 0,
    totalImpressions,
    totalClicks,
    avgCtr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
  }
}

// ============================================================================
// AD CREATIVES
// ============================================================================

export async function getAdCreatives(options: {
  campaignId?: string
  format?: string
  limit?: number
} = {}): Promise<AdCreative[]> {
  const { campaignId, format, limit = 50 } = options

  const creatives = await prisma.adCreative.findMany({
    where: {
      ...(campaignId && { campaignId }),
      ...(format && { format }),
    },
    orderBy: { impressions: 'desc' },
    take: limit,
  })

  return creatives.map((c) => ({
    id: c.id,
    campaignId: c.campaignId,
    headline: c.headline,
    description: c.description,
    displayUrl: c.displayUrl,
    finalUrl: c.finalUrl,
    format: c.format,
    impressions: c.impressions,
    clicks: c.clicks,
    ctr: c.ctr,
    firstSeen: c.firstSeen,
    lastSeen: c.lastSeen,
  }))
}

export async function getCompetitorAds(domain: string, limit = 20): Promise<AdCreative[]> {
  const campaigns = await prisma.adCampaign.findMany({
    where: { domain: { contains: domain } },
    select: { id: true },
  })

  const campaignIds = campaigns.map((c) => c.id)

  const creatives = await prisma.adCreative.findMany({
    where: { campaignId: { in: campaignIds } },
    orderBy: { lastSeen: 'desc' },
    take: limit,
  })

  return creatives.map((c) => ({
    id: c.id,
    campaignId: c.campaignId,
    headline: c.headline,
    description: c.description,
    displayUrl: c.displayUrl,
    finalUrl: c.finalUrl,
    format: c.format,
    impressions: c.impressions,
    clicks: c.clicks,
    ctr: c.ctr,
    firstSeen: c.firstSeen,
    lastSeen: c.lastSeen,
  }))
}
