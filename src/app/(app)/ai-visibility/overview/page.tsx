import { Suspense } from 'react'
import { getAIMentions, getAIVisibilityStats, getBrandMentionTrend } from '@/lib/data/ai'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function AIVisibilityData() {
  const [mentions, stats] = await Promise.all([
    getAIMentions({ limit: 50 }),
    getAIVisibilityStats(),
  ])

  // Get trend for first brand if available
  const brand = mentions[0]?.brand || 'Example Brand'
  const trend = await getBrandMentionTrend(brand, 30)

  const kpis = [
    { title: 'Total Queries', value: formatNumber(stats.totalQueries) },
    { title: 'Mention Rate', value: `${stats.mentionRate}%`, trend: stats.mentionRate > 50 ? 'up' as const : 'down' as const },
    { title: 'Avg. Position', value: stats.avgPosition.toString() },
    { title: 'AI Platforms', value: stats.platformBreakdown.length.toString() },
  ]

  const sentimentChart = stats.sentimentBreakdown.map((s) => ({
    name: s.sentiment.charAt(0).toUpperCase() + s.sentiment.slice(1),
    count: s.count,
    color: s.sentiment === 'positive' ? '#22c55e' : s.sentiment === 'negative' ? '#ef4444' : '#6b7280',
  }))

  const platformChart = stats.platformBreakdown.map((p) => ({
    name: p.platform,
    mentions: p.mentions,
    total: p.total,
  }))

  const trendChart = trend.map((t) => ({
    name: t.date,
    mentioned: t.mentioned,
    notMentioned: t.notMentioned,
  }))

  const columns = [
    {
      accessorKey: 'aiPlatform',
      header: 'AI Platform',
      cell: ({ row }: { row: { original: (typeof mentions)[0] } }) => {
        const icons: Record<string, string> = {
          chatgpt: '🤖',
          claude: '🧠',
          perplexity: '🔍',
          gemini: '💫',
          copilot: '✨',
        }
        return (
          <span className="flex items-center gap-2">
            <span>{icons[row.original.aiPlatform.toLowerCase()] || '🤖'}</span>
            <span>{row.original.aiPlatform}</span>
          </span>
        )
      },
    },
    {
      accessorKey: 'query',
      header: 'Query',
      cell: ({ row }: { row: { original: (typeof mentions)[0] } }) => (
        <span className="max-w-xs truncate text-sm">{row.original.query}</span>
      ),
    },
    {
      accessorKey: 'mentioned',
      header: 'Mentioned',
      cell: ({ row }: { row: { original: (typeof mentions)[0] } }) =>
        row.original.mentioned ? (
          <span className="text-green-600">✓ Yes</span>
        ) : (
          <span className="text-red-600">✗ No</span>
        ),
    },
    {
      accessorKey: 'position',
      header: 'Position',
      cell: ({ row }: { row: { original: (typeof mentions)[0] } }) =>
        row.original.position ? `#${row.original.position}` : '—',
    },
    {
      accessorKey: 'sentiment',
      header: 'Sentiment',
      cell: ({ row }: { row: { original: (typeof mentions)[0] } }) => {
        const sentiment = row.original.sentiment
        const colors: Record<string, string> = {
          positive: 'bg-green-100 text-green-700',
          neutral: 'bg-gray-100 text-gray-700',
          negative: 'bg-red-100 text-red-700',
        }
        return (
          <span className={`rounded px-2 py-0.5 text-xs capitalize ${colors[sentiment]}`}>
            {sentiment}
          </span>
        )
      },
    },
    {
      accessorKey: 'checkedAt',
      header: 'Checked',
      cell: ({ row }: { row: { original: (typeof mentions)[0] } }) =>
        new Date(row.original.checkedAt).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
        <h3 className="font-semibold text-purple-800">🤖 AI Visibility Overview</h3>
        <p className="mt-1 text-sm text-purple-700">
          Track how often your brand is mentioned by AI assistants like ChatGPT, Claude, Perplexity, and others. 
          Optimize your content to improve AI visibility.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartContainer
          title="Mention Trend (30 Days)"
          data={trendChart}
          type="area"
          dataKeys={[
            { key: 'mentioned', color: '#22c55e', name: 'Mentioned' },
            { key: 'notMentioned', color: '#ef4444', name: 'Not Mentioned' },
          ]}
          height={250}
        />
        <ChartContainer
          title="Sentiment Breakdown"
          data={sentimentChart}
          type="pie"
          dataKeys={[{ key: 'count', color: '#3b82f6', name: 'Count' }]}
          height={250}
        />
        <ChartContainer
          title="Mentions by Platform"
          data={platformChart}
          type="bar"
          dataKeys={[{ key: 'mentions', color: '#8b5cf6', name: 'Mentions' }]}
          height={250}
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Track New Query</h3>
        <form className="flex gap-4">
          <input
            type="text"
            placeholder="Enter query to track (e.g., 'best SEO tools 2024')..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <select className="rounded-lg border border-gray-300 px-4 py-2">
            <option>All Platforms</option>
            <option>ChatGPT</option>
            <option>Claude</option>
            <option>Perplexity</option>
            <option>Gemini</option>
          </select>
          <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            Track Query
          </button>
        </form>
      </div>

      <VirtualizedDataTable
        title="AI Mention History"
        data={mentions}
        columns={columns as never[]}
        pageSize={15}
      />
    </div>
  )
}

export default function AIVisibilityOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Visibility Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor your brand presence across AI platforms
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
        <AIVisibilityData />
      </Suspense>
    </div>
  )
}
