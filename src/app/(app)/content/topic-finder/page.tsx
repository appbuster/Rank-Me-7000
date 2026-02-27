import { Suspense } from 'react'
import { getTopicIdeas, getTrendingTopics } from '@/lib/data/content'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function TopicData() {
  const [topics, trending] = await Promise.all([
    getTopicIdeas({ limit: 100 }),
    getTrendingTopics(10),
  ])

  const kpis = [
    { title: 'Topic Ideas', value: formatNumber(topics.length) },
    { title: 'Avg. Volume', value: formatNumber(Math.round(topics.reduce((a, t) => a + t.volume, 0) / topics.length)) },
    { title: 'Avg. Difficulty', value: Math.round(topics.reduce((a, t) => a + t.difficulty, 0) / topics.length).toString() },
    { title: 'Trending Topics', value: trending.filter(t => t.trendScore > 70).length.toString() },
  ]

  const columns = [
    { accessorKey: 'topic', header: 'Topic' },
    { accessorKey: 'keyword', header: 'Target Keyword' },
    { accessorKey: 'volume', header: 'Volume' },
    {
      accessorKey: 'difficulty',
      header: 'Difficulty',
      cell: ({ row }: { row: { original: typeof topics[0] } }) => {
        const kd = row.original.difficulty
        const color = kd < 30 ? 'text-green-600' : kd < 60 ? 'text-yellow-600' : 'text-red-600'
        return <span className={color}>{kd}</span>
      },
    },
    {
      accessorKey: 'trendScore',
      header: 'Trend',
      cell: ({ row }: { row: { original: typeof topics[0] } }) => {
        const score = row.original.trendScore
        const color = score > 70 ? 'text-green-600' : score > 40 ? 'text-gray-600' : 'text-red-600'
        return (
          <div className="flex items-center gap-1">
            <span className={color}>{score > 70 ? '📈' : score > 40 ? '➡️' : '📉'}</span>
            <span>{score}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'contentType',
      header: 'Type',
      cell: ({ row }: { row: { original: typeof topics[0] } }) => (
        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 capitalize">
          {row.original.contentType}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      {/* Trending topics highlight */}
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <h3 className="font-semibold text-green-800">🔥 Trending Topics</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {trending.slice(0, 5).map((t) => (
            <span key={t.id} className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
              {t.topic} ({formatNumber(t.volume)} vol)
            </span>
          ))}
        </div>
      </div>

      <VirtualizedDataTable
        title="Content Topic Ideas"
        data={topics}
        columns={columns as never[]}
        pageSize={20}
      />
    </div>
  )
}

export default function TopicFinderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Topic Research</h1>
        <p className="mt-1 text-sm text-gray-500">
          Discover content ideas and trending topics in your niche
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
        <TopicData />
      </Suspense>
    </div>
  )
}
