import { Suspense } from 'react'
import { getAIMentions, getAIVisibilityStats } from '@/lib/data/ai'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { FilterBar } from '@/components/ui/FilterBar'
export const dynamic = 'force-dynamic'

async function AISentimentData() {
  const [mentions, stats] = await Promise.all([
    getAIMentions({ mentioned: true, limit: 100 }),
    getAIVisibilityStats(),
  ])

  const positive = stats.sentimentBreakdown.find((s) => s.sentiment === 'positive')?.count || 0
  const negative = stats.sentimentBreakdown.find((s) => s.sentiment === 'negative')?.count || 0
  const neutral = stats.sentimentBreakdown.find((s) => s.sentiment === 'neutral')?.count || 0
  const total = positive + negative + neutral

  const sentimentScore = total > 0 ? ((positive - negative) / total * 100).toFixed(0) : '0'

  const kpis = [
    { title: 'Sentiment Score', value: `${sentimentScore}`, trend: Number(sentimentScore) >= 0 ? 'up' as const : 'down' as const },
    { title: 'Positive Mentions', value: positive.toString(), trend: 'up' as const },
    { title: 'Negative Mentions', value: negative.toString(), trend: negative > 0 ? 'down' as const : undefined },
    { title: 'Neutral Mentions', value: neutral.toString() },
  ]

  const sentimentChart = [
    { name: 'Positive', value: positive, color: '#22c55e' },
    { name: 'Neutral', value: neutral, color: '#6b7280' },
    { name: 'Negative', value: negative, color: '#ef4444' },
  ]

  // Group by platform for sentiment comparison
  const platformSentiment = stats.platformBreakdown.map((p) => {
    const platformMentions = mentions.filter((m) => m.aiPlatform === p.platform)
    const pos = platformMentions.filter((m) => m.sentiment === 'positive').length
    const neg = platformMentions.filter((m) => m.sentiment === 'negative').length
    return {
      name: p.platform,
      positive: pos,
      negative: neg,
      neutral: platformMentions.length - pos - neg,
    }
  })

  const columns = [
    {
      accessorKey: 'aiPlatform',
      header: 'Platform',
    },
    {
      accessorKey: 'query',
      header: 'Query',
      cell: ({ row }: { row: { original: (typeof mentions)[0] } }) => (
        <span className="max-w-xs truncate text-sm">{row.original.query}</span>
      ),
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
        const icons: Record<string, string> = {
          positive: '😊',
          neutral: '😐',
          negative: '😞',
        }
        return (
          <span className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs ${colors[sentiment]}`}>
            {icons[sentiment]} {sentiment}
          </span>
        )
      },
    },
    {
      accessorKey: 'context',
      header: 'Context',
      cell: ({ row }: { row: { original: (typeof mentions)[0] } }) => (
        <span className="line-clamp-2 max-w-md text-sm text-gray-600">
          {row.original.context || 'No context available'}
        </span>
      ),
    },
    {
      accessorKey: 'checkedAt',
      header: 'Date',
      cell: ({ row }: { row: { original: (typeof mentions)[0] } }) =>
        new Date(row.original.checkedAt).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer
          title="Overall Sentiment Distribution"
          data={sentimentChart}
          type="pie"
          dataKeys={[{ key: 'value', color: '#3b82f6', name: 'Mentions' }]}
          height={300}
        />
        <ChartContainer
          title="Sentiment by Platform"
          data={platformSentiment}
          type="bar"
          dataKeys={[
            { key: 'positive', color: '#22c55e', name: 'Positive' },
            { key: 'neutral', color: '#6b7280', name: 'Neutral' },
            { key: 'negative', color: '#ef4444', name: 'Negative' },
          ]}
          height={300}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <h3 className="font-semibold text-green-800">👍 Positive Sentiment Drivers</h3>
          <ul className="mt-2 space-y-1 text-sm text-green-700">
            <li>• Product quality mentioned positively in 85% of responses</li>
            <li>• Customer support praised in comparison queries</li>
            <li>• Feature richness highlighted against competitors</li>
            <li>• Value for money consistently mentioned</li>
          </ul>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="font-semibold text-red-800">👎 Areas for Improvement</h3>
          <ul className="mt-2 space-y-1 text-sm text-red-700">
            <li>• Learning curve mentioned as potential barrier</li>
            <li>• Some pricing concerns in enterprise queries</li>
            <li>• Mobile app could be mentioned more often</li>
            <li>• Integration ecosystem needs more visibility</li>
          </ul>
        </div>
      </div>

      <VirtualizedDataTable
        title="Sentiment Analysis"
        data={mentions}
        columns={columns as never[]}
        pageSize={15}
      />
    </div>
  )
}

export default function AISentimentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Sentiment Analysis</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analyze how AI platforms describe your brand
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
        <AISentimentData />
      </Suspense>
    </div>
  )
}
