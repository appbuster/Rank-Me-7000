import { Suspense } from 'react'
import { getBacklinkGap } from '@/lib/data/gaps'
import { getTopDomains } from '@/lib/data/domains'
import { BacklinkGapClient } from './client'

interface PageProps {
  searchParams: {
    primary?: string
    competitors?: string | string[]
  }
}

async function BacklinkGapData({
  primary,
  competitors,
}: {
  primary: string
  competitors: string[]
}) {
  const data = await getBacklinkGap({
    primaryDomain: primary,
    competitorDomains: competitors,
  })

  if (!data || data.totalReferringDomains === 0) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
        <h3 className="text-lg font-medium text-yellow-800">No Backlink Data Found</h3>
        <p className="mt-2 text-sm text-yellow-700">
          We couldn&apos;t find enough backlink data for these domains. Try different domains or
          check that they exist in the database.
        </p>
      </div>
    )
  }

  return <BacklinkGapClient data={data} />
}

export default async function BacklinkGapPage({ searchParams }: PageProps) {
  const primary = searchParams.primary
  const competitorsParam = searchParams.competitors

  // Parse competitors
  const competitors: string[] = competitorsParam
    ? Array.isArray(competitorsParam)
      ? competitorsParam
      : [competitorsParam]
    : []

  // Get sample domains
  const sampleDomains = await getTopDomains(10)

  if (!primary || competitors.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backlink Gap</h1>
          <p className="mt-1 text-sm text-gray-500">
            Compare backlink profiles to find link building opportunities
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8">
          <form method="GET" className="space-y-6">
            <div>
              <label htmlFor="primary" className="block text-sm font-medium text-gray-700">
                Your Domain (Primary)
              </label>
              <input
                type="text"
                id="primary"
                name="primary"
                placeholder="yourdomain.com"
                defaultValue={primary || ''}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Competitor Domains (up to 4)
              </label>
              <div className="mt-2 space-y-2">
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    type="text"
                    name="competitors"
                    placeholder={`competitor${i + 1}.com`}
                    defaultValue={competitors[i] || ''}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Enter at least one competitor to find domains that link to them but not to you.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              Analyze Backlink Gap
            </button>
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">Try with these sample domains:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sampleDomains.slice(0, 5).map((d) => (
                <a
                  key={d.id}
                  href={`?primary=${encodeURIComponent(d.domain)}&competitors=${encodeURIComponent(sampleDomains[5]?.domain || '')}&competitors=${encodeURIComponent(sampleDomains[6]?.domain || '')}`}
                  className="rounded-full border border-gray-300 px-3 py-1 text-sm hover:border-blue-500 hover:text-blue-600"
                >
                  {d.domain}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Filter empty competitors
  const validCompetitors = competitors.filter((c) => c && c.trim() !== '')

  if (validCompetitors.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backlink Gap</h1>
          <p className="mt-1 text-sm text-gray-500">
            Compare backlink profiles to find link building opportunities
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Please enter at least one competitor domain.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backlink Gap</h1>
          <p className="mt-1 text-sm text-gray-500">
            Comparing {primary} against {validCompetitors.length} competitor
            {validCompetitors.length > 1 ? 's' : ''}
          </p>
        </div>
        <a
          href="/seo/competitive/backlink-gap"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
        >
          New Comparison
        </a>
      </div>

      <Suspense
        fallback={
          <div className="animate-pulse space-y-4">
            <div className="h-16 rounded-lg bg-gray-200" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 rounded-lg bg-gray-200" />
              ))}
            </div>
            <div className="h-64 rounded-lg bg-gray-200" />
          </div>
        }
      >
        <BacklinkGapData primary={primary} competitors={validCompetitors} />
      </Suspense>
    </div>
  )
}
