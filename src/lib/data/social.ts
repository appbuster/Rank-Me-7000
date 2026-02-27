import { prisma } from './db'

// ============================================================================
// TYPES
// ============================================================================

export interface SocialProfile {
  id: string
  platform: string
  handle: string
  displayName: string | null
  followers: number
  following: number
  postCount: number
  engagementRate: number
  profileUrl: string | null
  isVerified: boolean
  lastUpdated: Date
}

export interface SocialPost {
  id: string
  profileId: string
  platform: string
  content: string | null
  postType: string
  likes: number
  comments: number
  shares: number
  impressions: number
  reach: number
  publishedAt: Date
  url: string | null
}

export interface SocialMetric {
  id: string
  profileId: string
  date: Date
  followers: number
  followersChange: number
  impressions: number
  engagements: number
  reach: number
}

export interface SocialStats {
  totalProfiles: number
  totalFollowers: number
  avgEngagementRate: number
  totalPosts: number
  totalImpressions: number
}

// ============================================================================
// PROFILES
// ============================================================================

export async function getSocialProfiles(options: {
  platform?: string
  limit?: number
} = {}): Promise<SocialProfile[]> {
  const { platform, limit = 50 } = options

  const profiles = await prisma.socialProfile.findMany({
    where: {
      ...(platform && { platform }),
    },
    orderBy: { followers: 'desc' },
    take: limit,
  })

  return profiles.map((p) => ({
    id: p.id,
    platform: p.platform,
    handle: p.handle,
    displayName: p.displayName,
    followers: p.followers,
    following: p.following,
    postCount: p.postCount,
    engagementRate: p.engagementRate,
    profileUrl: p.profileUrl,
    isVerified: p.isVerified,
    lastUpdated: p.lastUpdated,
  }))
}

export async function getSocialStats(): Promise<SocialStats> {
  const [profiles, posts] = await Promise.all([
    prisma.socialProfile.aggregate({
      _count: { id: true },
      _sum: { followers: true },
      _avg: { engagementRate: true },
    }),
    prisma.socialPost.aggregate({
      _count: { id: true },
      _sum: { impressions: true },
    }),
  ])

  return {
    totalProfiles: profiles._count.id,
    totalFollowers: profiles._sum.followers || 0,
    avgEngagementRate: Number((profiles._avg.engagementRate || 0).toFixed(2)),
    totalPosts: posts._count.id,
    totalImpressions: posts._sum.impressions || 0,
  }
}

export async function getProfilesByPlatform(): Promise<{ platform: string; count: number; followers: number }[]> {
  const results = await prisma.socialProfile.groupBy({
    by: ['platform'],
    _count: { id: true },
    _sum: { followers: true },
  })

  return results.map((r) => ({
    platform: r.platform,
    count: r._count.id,
    followers: r._sum.followers || 0,
  }))
}

// ============================================================================
// POSTS
// ============================================================================

export async function getSocialPosts(options: {
  profileId?: string
  platform?: string
  postType?: string
  limit?: number
} = {}): Promise<SocialPost[]> {
  const { profileId, platform, postType, limit = 50 } = options

  const posts = await prisma.socialPost.findMany({
    where: {
      ...(profileId && { profileId }),
      ...(platform && { platform }),
      ...(postType && { postType }),
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })

  return posts.map((p) => ({
    id: p.id,
    profileId: p.profileId,
    platform: p.platform,
    content: p.content,
    postType: p.postType,
    likes: p.likes,
    comments: p.comments,
    shares: p.shares,
    impressions: p.impressions,
    reach: p.reach,
    publishedAt: p.publishedAt,
    url: p.url,
  }))
}

export async function getTopPosts(limit = 10): Promise<SocialPost[]> {
  const posts = await prisma.socialPost.findMany({
    orderBy: { impressions: 'desc' },
    take: limit,
  })

  return posts.map((p) => ({
    id: p.id,
    profileId: p.profileId,
    platform: p.platform,
    content: p.content,
    postType: p.postType,
    likes: p.likes,
    comments: p.comments,
    shares: p.shares,
    impressions: p.impressions,
    reach: p.reach,
    publishedAt: p.publishedAt,
    url: p.url,
  }))
}

// ============================================================================
// METRICS
// ============================================================================

export async function getSocialMetrics(profileId: string, days = 30): Promise<SocialMetric[]> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const metrics = await prisma.socialMetric.findMany({
    where: {
      profileId,
      date: { gte: startDate },
    },
    orderBy: { date: 'asc' },
  })

  return metrics.map((m) => ({
    id: m.id,
    profileId: m.profileId,
    date: m.date,
    followers: m.followers,
    followersChange: m.followersChange,
    impressions: m.impressions,
    engagements: m.engagements,
    reach: m.reach,
  }))
}

export async function getAggregatedMetrics(days = 30): Promise<{
  totalImpressions: number
  totalEngagements: number
  followerGrowth: number
}> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const metrics = await prisma.socialMetric.aggregate({
    where: { date: { gte: startDate } },
    _sum: {
      impressions: true,
      engagements: true,
      followersChange: true,
    },
  })

  return {
    totalImpressions: metrics._sum.impressions || 0,
    totalEngagements: metrics._sum.engagements || 0,
    followerGrowth: metrics._sum.followersChange || 0,
  }
}
