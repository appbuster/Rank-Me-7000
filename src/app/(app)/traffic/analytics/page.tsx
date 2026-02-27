import { Suspense } from 'react'
import { getTrafficData, getTrafficSummary, getTopDomainsByTraffic } from '@/lib/data/traffic'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function TrafficAnalyticsData() {
  const topDomains = await getTopDomainsByTraffic(30, 20)

  // Use first domain's data as example
  const domain = topDomains[0]?.domain || 'example.com'
  const [trafficData, summary] = await Promise.all([
    getTrafficData(domain, 30),
    getTrafficSummary(domain, 30),
  ])

  const kpis = [
    { title: 'Total Visits', value: formatNumber(summary?.totalVisits || 0) },
    { title: 'Page Views', value: formatNumber(summary?.totalPageViews || 0) },
    { title: 'Avg. Bounce Rate', value: `${summary?.avgBounceRate || 0}%` },
    { title: 'Avg. Duration', value: `${Math.floor((summary?.avgDuration || 0) / 60)}m ${(summary?.avgDuration || 0) % 60}s` },
  ]

  const trafficSourceData = summary
    ? [
        { name: 'Direct', value: summary.trafficSources.direct },
        { name: 'Search', value: summary.trafficSources.search },
        { name: 'Social', value: summary.trafficSources.social },
        { name: 'Referral', value: summary.trafficSources.referral },
        { name: 'Paid', value: summary.trafficSources.paid },
      ]
    : []

  const timeSeriesData = trafficData.map((t) => ({
    name: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    visits: t.visits,
    pageViews: t.pageViews,
  }))

  const columns = [
    { accessorKey: 'domain', header: 'Domain' },
    {
      accessorKey: 'totalVisits',
      header: 'Total Visits',
      cell: ({ row }: { row: { original: (typeof topDomains)[0] } }) => formatNumber(row.original.totalVisits),
    },
    {
      accessorKey: 'avgBounceRate',
      header: 'Bounce Rate',
      cell: ({ row }: { row: { original: (typeof topDomains)[0] } }) => {
        const rate = row.original.avgBounceRate
        const color = rate < 40 ? 'text-green-600' : rate < 60 ? 'text-yellow-600' : 'text-red-600'
        return <span className={color}>{rate}%</span>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer
          title="Visits & Page Views (30 Days)"
          data={timeSeriesData}
          type="area"
          dataKeys={[
            { key: 'visits', color: '#3b82f6', name: 'Visits' },
            { key: 'pageViews', color: '#22c55e', name: 'Page Views' },
          ]}
          height={300}
        />
        <ChartContainer
          title="Traffic Sources"
          data={trafficSourceData}
          type="pie"
          dataKeys={[{ key: 'value', color: '#3b82f6', name: 'Share' }]}
          height={300}
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Domain Search</h3>
        <form className="flex gap-4">
          <input
            type="text"
            placeholder="Enter domain to analyze..."
            defaultValue={domain}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <select className="rounded-lg border border-gray-300 px-4 py-2">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
          <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            Analyze
          </button>
        </form>
      </div>

      <VirtualizedDataTable
        title="Top Domains by Traffic"
        data={topDomains}
        columns={columns as never[]}
        pageSize={15}
      />
    </div>
  )
}

export default function TrafficAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Traffic Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analyze website traffic patterns and visitor behavior
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
        <TrafficAnalyticsData />
      </Suspense>
    </div>
  )
}
