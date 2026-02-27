import { prisma } from './db'

// ============================================================================
// TYPES
// ============================================================================

export interface LocalListing {
  id: string
  businessName: string
  platform: string
  profileUrl: string | null
  status: string
  nap: { name: string; address: string; phone: string } | null
  categories: string[]
  rating: number | null
  reviewCount: number
  isVerified: boolean
  lastSynced: Date
  issues: string[]
}

export interface Review {
  id: string
  listingId: string
  platform: string
  authorName: string
  rating: number
  content: string | null
  sentiment: string
  isResponded: boolean
  response: string | null
  publishedAt: Date
  respondedAt: Date | null
}

export interface MapRanking {
  id: string
  keyword: string
  location: string
  gridSize: number
  positions: number[]
  avgRank: number
  topRank: number
  date: Date
}

export interface LocalStats {
  totalListings: number
  verifiedListings: number
  averageRating: number
  totalReviews: number
  pendingResponses: number
  napIssues: number
}

// ============================================================================
// LISTINGS
// ============================================================================

export async function getLocalListings(options: {
  platform?: string
  status?: string
  limit?: number
} = {}): Promise<LocalListing[]> {
  const { platform, status, limit = 100 } = options

  const listings = await prisma.localListing.findMany({
    where: {
      ...(platform && { platform }),
      ...(status && { status }),
    },
    orderBy: { lastSynced: 'desc' },
    take: limit,
  })

  return listings.map((l) => ({
    id: l.id,
    businessName: l.businessName,
    platform: l.platform,
    profileUrl: l.profileUrl,
    status: l.status,
    nap: l.nap ? JSON.parse(l.nap) : null,
    categories: l.categories ? JSON.parse(l.categories) : [],
    rating: l.rating,
    reviewCount: l.reviewCount,
    isVerified: l.isVerified,
    lastSynced: l.lastSynced,
    issues: l.issues ? JSON.parse(l.issues) : [],
  }))
}

export async function getLocalStats(): Promise<LocalStats> {
  const [
    totalListings,
    verifiedListings,
    avgRating,
    totalReviews,
    pendingResponses,
    napIssues,
  ] = await Promise.all([
    prisma.localListing.count(),
    prisma.localListing.count({ where: { isVerified: true } }),
    prisma.localListing.aggregate({ _avg: { rating: true } }),
    prisma.review.count(),
    prisma.review.count({ where: { isResponded: false } }),
    prisma.localListing.count({
      where: { issues: { contains: 'NAP' } },
    }),
  ])

  return {
    totalListings,
    verifiedListings,
    averageRating: avgRating._avg.rating ? Number(avgRating._avg.rating.toFixed(1)) : 0,
    totalReviews,
    pendingResponses,
    napIssues,
  }
}

// ============================================================================
// REVIEWS
// ============================================================================

export async function getReviews(options: {
  platform?: string
  sentiment?: string
  responded?: boolean
  limit?: number
} = {}): Promise<Review[]> {
  const { platform, sentiment, responded, limit = 100 } = options

  const reviews = await prisma.review.findMany({
    where: {
      ...(platform && { platform }),
      ...(sentiment && { sentiment }),
      ...(responded !== undefined && { isResponded: responded }),
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })

  return reviews.map((r) => ({
    id: r.id,
    listingId: r.listingId,
    platform: r.platform,
    authorName: r.authorName,
    rating: r.rating,
    content: r.content,
    sentiment: r.sentiment,
    isResponded: r.isResponded,
    response: r.response,
    publishedAt: r.publishedAt,
    respondedAt: r.respondedAt,
  }))
}

export async function getReviewStats() {
  const [total, byRating, bySentiment] = await Promise.all([
    prisma.review.count(),
    prisma.review.groupBy({
      by: ['rating'],
      _count: { id: true },
    }),
    prisma.review.groupBy({
      by: ['sentiment'],
      _count: { id: true },
    }),
  ])

  return {
    total,
    byRating: byRating.map((r) => ({ rating: r.rating, count: r._count.id })),
    bySentiment: bySentiment.map((s) => ({ sentiment: s.sentiment, count: s._count.id })),
  }
}

// ============================================================================
// MAP RANKINGS
// ============================================================================

export async function getMapRankings(options: {
  keyword?: string
  location?: string
  limit?: number
} = {}): Promise<MapRanking[]> {
  const { keyword, location, limit = 50 } = options

  const rankings = await prisma.mapRanking.findMany({
    where: {
      ...(keyword && { keyword: { contains: keyword } }),
      ...(location && { location }),
    },
    orderBy: { date: 'desc' },
    take: limit,
  })

  return rankings.map((r) => ({
    id: r.id,
    keyword: r.keyword,
    location: r.location,
    gridSize: r.gridSize,
    positions: r.positions ? JSON.parse(r.positions) : [],
    avgRank: r.avgRank,
    topRank: r.topRank,
    date: r.date,
  }))
}

export async function getMapRankingsByLocation(): Promise<{ location: string; avgRank: number; count: number }[]> {
  const results = await prisma.mapRanking.groupBy({
    by: ['location'],
    _avg: { avgRank: true },
    _count: { id: true },
  })

  return results.map((r) => ({
    location: r.location,
    avgRank: Number((r._avg.avgRank || 0).toFixed(1)),
    count: r._count.id,
  }))
}
