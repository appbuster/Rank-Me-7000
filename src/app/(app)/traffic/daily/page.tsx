import { Suspense } from 'react'
import { getTopDomainsByTraffic, getTrafficData } from '@/lib/data/traffic'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function DailyTrafficData() {
  const topDomains = await getTopDomainsByTraffic(30, 10)
  const domain = topDomains[0]?.domain || 'example.com'
  const trafficData = await getTrafficData(domain, 30)

  const today = trafficData[trafficData.length - 1]
  const yesterday = trafficData[trafficData.length - 2]
  const changePercent = yesterday ? ((today?.visits || 0) - yesterday.visits) / yesterday.visits * 100 : 0

  const kpis = [
    { title: 'Today\'s Visits', value: formatNumber(today?.visits || 0), trend: changePercent >= 0 ? 'up' as const : 'down' as const },
    { title: 'Page Views', value: formatNumber(today?.pageViews || 0) },
    { title: 'Bounce Rate', value: `${today?.bounceRate?.toFixed(1) || 0}%` },
    { title: 'Avg. Duration', value: `${Math.floor((today?.avgDuration || 0) / 60)}:${String((today?.avgDuration || 0) % 60).padStart(2, '0')}` },
  ]

  const chartData = trafficData.map((t) => ({
    name: new Date(t.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    visits: t.visits,
    pageViews: t.pageViews,
  }))

  // Hourly distribution (mock)
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    name: `${i}:00`,
    visits: Math.floor(Math.random() * 500) + 100,
  }))

  const columns = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }: { row: { original: (typeof trafficData)[0] } }) =>
        new Date(row.original.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    },
    {
      accessorKey: 'visits',
      header: 'Visits',
      cell: ({ row }: { row: { original: (typeof trafficData)[0] } }) => formatNumber(row.original.visits),
    },
    {
      accessorKey: 'pageViews',
      header: 'Page Views',
      cell: ({ row }: { row: { original: (typeof trafficData)[0] } }) => formatNumber(row.original.pageViews),
    },
    {
      accessorKey: 'bounceRate',
      header: 'Bounce Rate',
      cell: ({ row }: { row: { original: (typeof trafficData)[0] } }) => `${row.original.bounceRate.toFixed(1)}%`,
    },
    {
      accessorKey: 'avgDuration',
      header: 'Avg. Duration',
      cell: ({ row }: { row: { original: (typeof trafficData)[0] } }) => {
        const dur = row.original.avgDuration
        return `${Math.floor(dur / 60)}:${String(dur % 60).padStart(2, '0')}`
      },
    },
    {
      accessorKey: 'pagesPerVisit',
      header: 'Pages/Visit',
      cell: ({ row }: { row: { original: (typeof trafficData)[0] } }) => row.original.pagesPerVisit.toFixed(1),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer
          title="Daily Traffic (30 Days)"
          data={chartData}
          type="area"
          dataKeys={[
            { key: 'visits', color: '#3b82f6', name: 'Visits' },
            { key: 'pageViews', color: '#22c55e', name: 'Page Views' },
          ]}
          height={300}
        />
        <ChartContainer
          title="Today's Hourly Distribution"
          data={hourlyData}
          type="bar"
          dataKeys={[{ key: 'visits', color: '#8b5cf6', name: 'Visits' }]}
          height={300}
        />
      </div>

      <VirtualizedDataTable
        title="Daily Traffic Log"
        data={trafficData.slice().reverse()}
        columns={columns as never[]}
        pageSize={15}
      />
    </div>
  )
}

export default function DailyTrafficPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Daily Traffic</h1>
        <p className="mt-1 text-sm text-gray-500">
          Day-by-day traffic metrics and trends
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
        <DailyTrafficData />
      </Suspense>
    </div>
  )
}
