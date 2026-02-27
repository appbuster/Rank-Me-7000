import { Suspense } from 'react'
import { getMarketOverview, getIndustryList } from '@/lib/data/traffic'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber, formatPercent } from '@/lib/utils'
export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: { industry?: string }
}

async function MarketOverviewData({ industry }: { industry: string }) {
  const [marketData, industries] = await Promise.all([
    getMarketOverview(industry),
    getIndustryList(),
  ])

  const totalTraffic = marketData.reduce((a, m) => a + m.traffic, 0)
  const avgGrowth = marketData.length > 0
    ? marketData.reduce((a, m) => a + m.growthRate, 0) / marketData.length
    : 0

  const kpis = [
    { title: 'Market Players', value: marketData.length.toString() },
    { title: 'Total Traffic', value: formatNumber(totalTraffic) },
    { title: 'Avg. Growth', value: formatPercent(avgGrowth), trend: avgGrowth >= 0 ? 'up' as const : 'down' as const },
    { title: 'Industries', value: industries.length.toString() },
  ]

  const marketShareData = marketData.slice(0, 10).map((m) => ({
    name: m.domain.length > 15 ? m.domain.substring(0, 15) + '...' : m.domain,
    marketShare: m.marketShare,
  }))

  const trafficData = marketData.slice(0, 10).map((m) => ({
    name: m.domain.length > 15 ? m.domain.substring(0, 15) + '...' : m.domain,
    traffic: m.traffic,
    growth: m.growthRate,
  }))

  const columns = [
    { accessorKey: 'domain', header: 'Domain' },
    {
      accessorKey: 'marketShare',
      header: 'Market Share',
      cell: ({ row }: { row: { original: (typeof marketData)[0] } }) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full bg-blue-500" style={{ width: `${Math.min(row.original.marketShare * 100, 100)}%` }} />
          </div>
          <span className="text-sm">{(row.original.marketShare * 100).toFixed(1)}%</span>
        </div>
      ),
    },
    {
      accessorKey: 'traffic',
      header: 'Traffic',
      cell: ({ row }: { row: { original: (typeof marketData)[0] } }) => formatNumber(row.original.traffic),
    },
    {
      accessorKey: 'growthRate',
      header: 'Growth',
      cell: ({ row }: { row: { original: (typeof marketData)[0] } }) => {
        const growth = row.original.growthRate
        const color = growth > 0 ? 'text-green-600' : growth < 0 ? 'text-red-600' : 'text-gray-600'
        return <span className={color}>{formatPercent(growth)}</span>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Select Industry</h3>
        <form className="flex gap-4">
          <select
            name="industry"
            defaultValue={industry}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
          >
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
          <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            Analyze Market
          </button>
        </form>
      </div>

      <KpiTileGrid tiles={kpis} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer
          title="Market Share Distribution"
          data={marketShareData}
          type="pie"
          dataKeys={[{ key: 'marketShare', color: '#3b82f6', name: 'Market Share' }]}
          height={300}
        />
        <ChartContainer
          title="Traffic by Player"
          data={trafficData}
          type="bar"
          dataKeys={[{ key: 'traffic', color: '#22c55e', name: 'Traffic' }]}
          height={300}
        />
      </div>

      <VirtualizedDataTable
        title={`Market Players - ${industry.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`}
        data={marketData}
        columns={columns as never[]}
        pageSize={15}
      />
    </div>
  )
}

export default async function MarketOverviewPage({ searchParams }: PageProps) {
  const industry = searchParams.industry || 'technology'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Market Explorer</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analyze market share and competitive landscape by industry
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
        <MarketOverviewData industry={industry} />
      </Suspense>
    </div>
  )
}
