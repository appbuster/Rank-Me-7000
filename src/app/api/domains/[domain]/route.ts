import { NextRequest, NextResponse } from 'next/server'
import { getDomainOverview, getDomainRankings, getDomainBacklinks } from '@/lib/data'

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string } }
) {
  const domain = decodeURIComponent(params.domain)
  const searchParams = request.nextUrl.searchParams
  const include = searchParams.get('include')?.split(',') ?? []

  try {
    const overview = await getDomainOverview(domain)

    if (!overview) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
    }

    const result: Record<string, unknown> = { ...overview }

    if (include.includes('rankings')) {
      result.rankings = await getDomainRankings(overview.id, { limit: 100 })
    }

    if (include.includes('backlinks')) {
      result.backlinks = await getDomainBacklinks(overview.id, { limit: 100 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching domain:', error)
    return NextResponse.json({ error: 'Failed to fetch domain data' }, { status: 500 })
  }
}
