import { Suspense } from 'react'
import { getTopDomainsByTraffic } from '@/lib/data/traffic'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber, formatPercent } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function EyeOnData() {
  const competitors = await getTopDomainsByTraffic(30, 10)

  // Mock competitor monitoring data
  const competitorData = competitors.map((c, _i) => ({
    domain: c.domain,
    traffic: c.totalVisits,
    trafficChange: Math.random() * 30 - 10,
    keywords: Math.floor(Math.random() * 5000) + 1000,
    keywordsChange: Math.random() * 20 - 5,
    backlinks: Math.floor(Math.random() * 50000) + 10000,
    backlinksChange: Math.random() * 15 - 3,
    ads: Math.floor(Math.random() * 100),
    lastUpdate: new Date(Date.now() - Math.random() * 86400000 * 7),
  }))

  const kpis = [
    { title: 'Competitors Tracked', value: competitors.length.toString() },
    { title: 'Avg. Traffic Change', value: '+8.5%', trend: 'up' as const },
    { title: 'New Keywords Found', value: '1,247' },
    { title: 'Alerts Today', value: '3' },
  ]

  const trafficComparison = competitorData.slice(0, 5).map((c) => ({
    name: c.domain.length > 15 ? c.domain.substring(0, 15) + '...' : c.domain,
    traffic: c.traffic,
  }))

  const changeData = competitorData.slice(0, 5).map((c) => ({
    name: c.domain.length > 15 ? c.domain.substring(0, 15) + '...' : c.domain,
    change: c.trafficChange,
  }))

  const columns = [
    { accessorKey: 'domain', header: 'Domain' },
    {
      accessorKey: 'traffic',
      header: 'Traffic',
      cell: ({ row }: { row: { original: (typeof competitorData)[0] } }) => (
        <div>
          <span>{formatNumber(row.original.traffic)}</span>
          <span className={`ml-2 text-xs ${row.original.trafficChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercent(row.original.trafficChange)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'keywords',
      header: 'Keywords',
      cell: ({ row }: { row: { original: (typeof competitorData)[0] } }) => (
        <div>
          <span>{formatNumber(row.original.keywords)}</span>
          <span className={`ml-2 text-xs ${row.original.keywordsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercent(row.original.keywordsChange)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'backlinks',
      header: 'Backlinks',
      cell: ({ row }: { row: { original: (typeof competitorData)[0] } }) => formatNumber(row.original.backlinks),
    },
    {
      accessorKey: 'ads',
      header: 'Active Ads',
      cell: ({ row }: { row: { original: (typeof competitorData)[0] } }) => row.original.ads,
    },
    {
      accessorKey: 'lastUpdate',
      header: 'Last Update',
      cell: ({ row }: { row: { original: (typeof competitorData)[0] } }) =>
        new Date(row.original.lastUpdate).toLocaleDateString(),
    },
  ]

  // Mock alerts
  const alerts = [
    { type: 'traffic', message: 'competitor1.com traffic increased by 25%', time: '2 hours ago' },
    { type: 'keyword', message: 'competitor2.com now ranks for "best seo tool"', time: '5 hours ago' },
    { type: 'backlink', message: 'competitor3.com gained 150 new backlinks', time: '1 day ago' },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
        <h3 className="font-semibold text-purple-800">👁️ EyeOn Competitor Monitoring</h3>
        <p className="mt-1 text-sm text-purple-700">
          Track competitor movements in real-time. Get alerts when competitors change their SEO strategy, launch new ads, or gain significant traffic.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-2">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartContainer
              title="Traffic Comparison"
              data={trafficComparison}
              type="bar"
              dataKeys={[{ key: 'traffic', color: '#3b82f6', name: 'Traffic' }]}
              height={250}
            />
            <ChartContainer
              title="Traffic Change (%)"
              data={changeData}
              type="bar"
              dataKeys={[{ key: 'change', color: '#22c55e', name: 'Change %' }]}
              height={250}
            />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Recent Alerts</h3>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      alert.type === 'traffic' ? 'bg-blue-500' : alert.type === 'keyword' ? 'bg-green-500' : 'bg-purple-500'
                    }`}
                  />
                  <span className="text-sm">{alert.message}</span>
                </div>
                <span className="text-xs text-gray-500">{alert.time}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
            View All Alerts
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Add Competitor</h3>
        <form className="flex gap-4">
          <input
            type="text"
            placeholder="Enter competitor domain..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            Track Competitor
          </button>
        </form>
      </div>

      <VirtualizedDataTable
        title="Tracked Competitors"
        data={competitorData}
        columns={columns as never[]}
        pageSize={15}
      />
    </div>
  )
}

export default function EyeOnPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">EyeOn</h1>
        <p className="mt-1 text-sm text-gray-500">
          Real-time competitor monitoring and alerts
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
        <EyeOnData />
      </Suspense>
    </div>
  )
}
