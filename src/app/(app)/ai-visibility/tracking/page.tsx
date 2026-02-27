import { Suspense } from 'react'
import { getAIMentions, getAIVisibilityStats } from '@/lib/data/ai'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { FilterBar } from '@/components/ui/FilterBar'
export const dynamic = 'force-dynamic'

async function AITrackingData() {
  const [mentions, stats] = await Promise.all([
    getAIMentions({ limit: 100 }),
    getAIVisibilityStats(),
  ])

  // Group by query for tracking view
  const queryMap = new Map<string, { query: string; platforms: string[]; lastMentioned: boolean; lastCheck: Date }>()
  mentions.forEach((m) => {
    const existing = queryMap.get(m.query)
    if (existing) {
      if (!existing.platforms.includes(m.aiPlatform)) {
        existing.platforms.push(m.aiPlatform)
      }
      if (m.checkedAt > existing.lastCheck) {
        existing.lastMentioned = m.mentioned
        existing.lastCheck = m.checkedAt
      }
    } else {
      queryMap.set(m.query, {
        query: m.query,
        platforms: [m.aiPlatform],
        lastMentioned: m.mentioned,
        lastCheck: m.checkedAt,
      })
    }
  })

  const trackedQueries = Array.from(queryMap.values())

  const kpis = [
    { title: 'Tracked Queries', value: trackedQueries.length.toString() },
    { title: 'Platforms Monitored', value: stats.platformBreakdown.length.toString() },
    { title: 'Mention Rate', value: `${stats.mentionRate}%` },
    { title: 'Checks Today', value: '47' },
  ]

  const columns = [
    {
      accessorKey: 'query',
      header: 'Query',
      cell: ({ row }: { row: { original: (typeof trackedQueries)[0] } }) => (
        <span className="font-medium">{row.original.query}</span>
      ),
    },
    {
      accessorKey: 'platforms',
      header: 'Platforms',
      cell: ({ row }: { row: { original: (typeof trackedQueries)[0] } }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.platforms.map((p) => (
            <span key={p} className="rounded bg-gray-100 px-2 py-0.5 text-xs">
              {p}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'lastMentioned',
      header: 'Last Result',
      cell: ({ row }: { row: { original: (typeof trackedQueries)[0] } }) =>
        row.original.lastMentioned ? (
          <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Mentioned</span>
        ) : (
          <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">Not Mentioned</span>
        ),
    },
    {
      accessorKey: 'lastCheck',
      header: 'Last Check',
      cell: ({ row }: { row: { original: (typeof trackedQueries)[0] } }) =>
        new Date(row.original.lastCheck).toLocaleString(),
    },
    {
      accessorKey: 'actions',
      header: '',
      cell: () => (
        <div className="flex gap-2">
          <button className="rounded border border-blue-600 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50">
            Check Now
          </button>
          <button className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50">
            Edit
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Add Query to Track</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Query</label>
            <input
              type="text"
              placeholder='e.g., "best CRM software for small business"'
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand/Product to Track</label>
            <input
              type="text"
              placeholder="Your brand or product name"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Platforms</label>
            <div className="mt-2 flex flex-wrap gap-4">
              {['ChatGPT', 'Claude', 'Perplexity', 'Gemini', 'Copilot'].map((platform) => (
                <label key={platform} className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span className="text-sm">{platform}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Check Frequency</label>
            <select className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2">
              <option>Every 6 hours</option>
              <option>Every 12 hours</option>
              <option>Daily</option>
              <option>Weekly</option>
            </select>
          </div>
          <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            Start Tracking
          </button>
        </form>
      </div>

      <VirtualizedDataTable
        title="Tracked Queries"
        data={trackedQueries}
        columns={columns as never[]}
        pageSize={15}
      />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="font-semibold text-blue-800">💡 Tips for Better AI Visibility</h3>
        <ul className="mt-2 space-y-1 text-sm text-blue-700">
          <li>• Track queries that your target audience commonly asks AI assistants</li>
          <li>• Include competitor names to monitor comparative mentions</li>
          <li>• Focus on long-tail queries where you have expertise</li>
          <li>• Update your content to directly answer tracked queries</li>
        </ul>
      </div>
    </div>
  )
}

export default function AITrackingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Query Tracking</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track specific queries across AI platforms
        </p>
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
        <AITrackingData />
      </Suspense>
    </div>
  )
}
