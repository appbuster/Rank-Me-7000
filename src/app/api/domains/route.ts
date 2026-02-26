import { NextRequest, NextResponse } from 'next/server'
import { getTopDomains, searchDomains } from '@/lib/data'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const limit = parseInt(searchParams.get('limit') ?? '10')

  try {
    const domains = query
      ? await searchDomains(query, limit)
      : await getTopDomains(limit)

    return NextResponse.json(domains)
  } catch (error) {
    console.error('Error fetching domains:', error)
    return NextResponse.json({ error: 'Failed to fetch domains' }, { status: 500 })
  }
}
