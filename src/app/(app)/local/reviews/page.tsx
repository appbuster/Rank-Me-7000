import { Suspense } from 'react'
import { getReviews, getReviewStats, getLocalStats } from '@/lib/data/local'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function ReviewsData() {
  const [reviews, stats, localStats] = await Promise.all([
    getReviews({ limit: 100 }),
    getReviewStats(),
    getLocalStats(),
  ])

  const kpis = [
    { title: 'Total Reviews', value: formatNumber(stats.total) },
    { title: 'Avg. Rating', value: localStats.averageRating.toFixed(1), trend: localStats.averageRating >= 4 ? 'up' as const : 'down' as const },
    { title: 'Pending Response', value: formatNumber(localStats.pendingResponses), trend: 'down' as const },
    { title: 'Response Rate', value: `${Math.round(((stats.total - localStats.pendingResponses) / stats.total) * 100)}%` },
  ]

  const sentimentData = stats.bySentiment.map((s) => ({
    name: s.sentiment.charAt(0).toUpperCase() + s.sentiment.slice(1),
    count: s.count,
    color: s.sentiment === 'positive' ? '#22c55e' : s.sentiment === 'negative' ? '#ef4444' : '#6b7280',
  }))

  const ratingData = stats.byRating
    .sort((a, b) => a.rating - b.rating)
    .map((r) => ({
      name: `${r.rating} ⭐`,
      count: r.count,
    }))

  const columns = [
    { accessorKey: 'authorName', header: 'Author' },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }: { row: { original: typeof reviews[0] } }) => {
        const rating = row.original.rating
        const stars = '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
        return <span className="text-sm">{stars}</span>
      },
    },
    { accessorKey: 'platform', header: 'Platform' },
    {
      accessorKey: 'content',
      header: 'Review',
      cell: ({ row }: { row: { original: typeof reviews[0] } }) => (
        <div className="max-w-xs truncate text-sm">
          {row.original.content || <span className="text-gray-400">No text</span>}
        </div>
      ),
    },
    {
      accessorKey: 'sentiment',
      header: 'Sentiment',
      cell: ({ row }: { row: { original: typeof reviews[0] } }) => {
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
      accessorKey: 'isResponded',
      header: 'Responded',
      cell: ({ row }: { row: { original: typeof reviews[0] } }) =>
        row.original.isResponded ? (
          <span className="text-green-600">✓</span>
        ) : (
          <span className="text-yellow-600">⏳</span>
        ),
    },
    {
      accessorKey: 'publishedAt',
      header: 'Date',
      cell: ({ row }: { row: { original: typeof reviews[0] } }) =>
        new Date(row.original.publishedAt).toLocaleDateString(),
    },
  ]

  // Get unresponded negative reviews
  const urgentReviews = reviews.filter((r) => !r.isResponded && r.sentiment === 'negative')

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      {urgentReviews.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="font-semibold text-red-800">🚨 {urgentReviews.length} Negative Reviews Need Response</h3>
          <p className="mt-1 text-sm text-red-700">
            Respond to these reviews quickly to show customers you care about their feedback.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer
          title="Reviews by Rating"
          data={ratingData}
          type="bar"
          dataKeys={[{ key: 'count', color: '#3b82f6', name: 'Reviews' }]}
          height={250}
        />
        <ChartContainer
          title="Sentiment Distribution"
          data={sentimentData}
          type="pie"
          dataKeys={[{ key: 'count', color: '#3b82f6', name: 'Reviews' }]}
          height={250}
        />
      </div>

      <VirtualizedDataTable
        title="Recent Reviews"
        data={reviews}
        columns={columns as never[]}
        pageSize={20}
      />
    </div>
  )
}

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and respond to customer reviews across all platforms
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
        <ReviewsData />
      </Suspense>
    </div>
  )
}
