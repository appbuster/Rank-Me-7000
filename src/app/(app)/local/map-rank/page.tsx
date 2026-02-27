import { Suspense } from 'react'
import { getMapRankings, getMapRankingsByLocation } from '@/lib/data/local'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { FilterBar } from '@/components/ui/FilterBar'
export const dynamic = 'force-dynamic'

async function MapRankData() {
  const [rankings, byLocation] = await Promise.all([
    getMapRankings({ limit: 50 }),
    getMapRankingsByLocation(),
  ])

  const avgRank = rankings.length > 0 
    ? (rankings.reduce((a, r) => a + r.avgRank, 0) / rankings.length).toFixed(1)
    : '0'

  const topRankCount = rankings.filter((r) => r.topRank <= 3).length

  const kpis = [
    { title: 'Keywords Tracked', value: rankings.length.toString() },
    { title: 'Avg. Position', value: avgRank },
    { title: 'Top 3 Rankings', value: topRankCount.toString(), trend: 'up' as const },
    { title: 'Locations', value: byLocation.length.toString() },
  ]

  const locationChartData = byLocation.map((l) => ({
    name: l.location,
    avgRank: l.avgRank,
    keywords: l.count,
  }))

  const columns = [
    { accessorKey: 'keyword', header: 'Keyword' },
    { accessorKey: 'location', header: 'Location' },
    {
      accessorKey: 'avgRank',
      header: 'Avg. Rank',
      cell: ({ row }: { row: { original: (typeof rankings)[0] } }) => {
        const rank = row.original.avgRank
        const color = rank <= 3 ? 'text-green-600' : rank <= 10 ? 'text-blue-600' : rank <= 20 ? 'text-yellow-600' : 'text-red-600'
        return <span className={`font-medium ${color}`}>{rank.toFixed(1)}</span>
      },
    },
    {
      accessorKey: 'topRank',
      header: 'Best Position',
      cell: ({ row }: { row: { original: (typeof rankings)[0] } }) => {
        const rank = row.original.topRank
        const badge = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : ''
        return (
          <span>
            {badge} #{rank}
          </span>
        )
      },
    },
    {
      accessorKey: 'gridSize',
      header: 'Grid Size',
      cell: ({ row }: { row: { original: (typeof rankings)[0] } }) => (
        <span className="text-sm text-gray-600">{row.original.gridSize}x{row.original.gridSize}</span>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Last Check',
      cell: ({ row }: { row: { original: (typeof rankings)[0] } }) =>
        new Date(row.original.date).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="font-semibold text-blue-800">📍 Local Pack Tracking</h3>
        <p className="mt-1 text-sm text-blue-700">
          Monitor your Google Maps rankings across multiple grid points to see how visibility varies by location.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer
          title="Average Rank by Location"
          data={locationChartData}
          type="bar"
          dataKeys={[{ key: 'avgRank', color: '#3b82f6', name: 'Avg. Rank' }]}
          height={300}
        />
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Ranking Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Top 3 (Local Pack)</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full bg-green-500" style={{ width: `${(topRankCount / rankings.length) * 100}%` }} />
                </div>
                <span className="text-sm font-medium">{topRankCount}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Positions 4-10</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full bg-blue-500" style={{ width: `${(rankings.filter((r) => r.topRank > 3 && r.topRank <= 10).length / rankings.length) * 100}%` }} />
                </div>
                <span className="text-sm font-medium">{rankings.filter((r) => r.topRank > 3 && r.topRank <= 10).length}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Positions 11-20</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full bg-yellow-500" style={{ width: `${(rankings.filter((r) => r.topRank > 10 && r.topRank <= 20).length / rankings.length) * 100}%` }} />
                </div>
                <span className="text-sm font-medium">{rankings.filter((r) => r.topRank > 10 && r.topRank <= 20).length}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">20+</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full bg-red-500" style={{ width: `${(rankings.filter((r) => r.topRank > 20).length / rankings.length) * 100}%` }} />
                </div>
                <span className="text-sm font-medium">{rankings.filter((r) => r.topRank > 20).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VirtualizedDataTable
        title="Map Rankings"
        data={rankings}
        columns={columns as never[]}
        pageSize={15}
      />
    </div>
  )
}

export default function MapRankPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Map Rankings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your local search visibility across geographic grids
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
        <MapRankData />
      </Suspense>
    </div>
  )
}
