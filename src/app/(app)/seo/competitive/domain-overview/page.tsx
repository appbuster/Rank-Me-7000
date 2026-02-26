import { Suspense } from 'react'
import { getDomainOverview, getDomainRankings, getDomainBacklinks, getTopDomains } from '@/lib/data'
import { DomainOverviewClient } from './client'

interface PageProps {
  searchParams: { domain?: string }
}

async function DomainData({ domain }: { domain: string }) {
  const overview = await getDomainOverview(domain)

  if (!overview) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        Domain &quot;{domain}&quot; not found. Try searching for another domain.
      </div>
    )
  }

  const [rankings, backlinks] = await Promise.all([
    getDomainRankings(overview.id, { limit: 50 }),
    getDomainBacklinks(overview.id, { limit: 50 }),
  ])

  return (
    <DomainOverviewClient
      overview={overview}
      rankings={rankings}
      backlinks={backlinks}
    />
  )
}

export default async function DomainOverviewPage({ searchParams }: PageProps) {
  const domain = searchParams.domain

  // Get sample domains for the search suggestions
  const sampleDomains = await getTopDomains(5)

  if (!domain) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Domain Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter a domain to see comprehensive SEO metrics
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <form method="GET" className="mx-auto max-w-md">
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
              Enter Domain
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                id="domain"
                name="domain"
                placeholder="example.com"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
              >
                Analyze
              </button>
            </div>
          </form>

          <div className="mt-8">
            <p className="text-sm text-gray-500">Try one of these domains:</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {sampleDomains.map((d) => (
                <a
                  key={d.id}
                  href={`?domain=${encodeURIComponent(d.domain)}`}
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Domain Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Comprehensive SEO analysis for {domain}
          </p>
        </div>
        <a
          href="/seo/competitive/domain-overview"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
        >
          New Analysis
        </a>
      </div>

      <Suspense
        fallback={
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 rounded-lg bg-gray-200" />
              ))}
            </div>
            <div className="h-64 rounded-lg bg-gray-200" />
          </div>
        }
      >
        <DomainData domain={domain} />
      </Suspense>
    </div>
  )
}
