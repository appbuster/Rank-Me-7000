import { Suspense } from 'react'
import { getTopDomainsByTraffic } from '@/lib/data/traffic'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function RegionalTrafficData() {
  await getTopDomainsByTraffic(30, 10)

  // Mock regional data
  const regionalData = [
    { country: 'United States', visits: 1250000, share: 42.5, growth: 8.2 },
    { country: 'United Kingdom', visits: 380000, share: 12.9, growth: 5.1 },
    { country: 'Germany', visits: 295000, share: 10.0, growth: 12.3 },
    { country: 'Canada', visits: 215000, share: 7.3, growth: 3.8 },
    { country: 'Australia', visits: 185000, share: 6.3, growth: 7.5 },
    { country: 'France', visits: 165000, share: 5.6, growth: 4.2 },
    { country: 'India', visits: 145000, share: 4.9, growth: 22.1 },
    { country: 'Netherlands', visits: 98000, share: 3.3, growth: 9.8 },
    { country: 'Brazil', visits: 85000, share: 2.9, growth: 15.5 },
    { country: 'Japan', visits: 72000, share: 2.4, growth: 2.1 },
  ]

  const kpis = [
    { title: 'Countries', value: '127' },
    { title: 'Top Country', value: 'United States' },
    { title: 'Fastest Growing', value: 'India (+22%)' },
    { title: 'Avg. Global Bounce', value: '45.2%' },
  ]

  const continentData = [
    { name: 'North America', value: 52 },
    { name: 'Europe', value: 28 },
    { name: 'Asia Pacific', value: 12 },
    { name: 'South America', value: 5 },
    { name: 'Other', value: 3 },
  ]

  const columns = [
    { accessorKey: 'country', header: 'Country' },
    {
      accessorKey: 'visits',
      header: 'Visits',
      cell: ({ row }: { row: { original: (typeof regionalData)[0] } }) => formatNumber(row.original.visits),
    },
    {
      accessorKey: 'share',
      header: 'Share',
      cell: ({ row }: { row: { original: (typeof regionalData)[0] } }) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full bg-blue-500" style={{ width: `${row.original.share * 2}%` }} />
          </div>
          <span>{row.original.share}%</span>
        </div>
      ),
    },
    {
      accessorKey: 'growth',
      header: 'Growth',
      cell: ({ row }: { row: { original: (typeof regionalData)[0] } }) => {
        const growth = row.original.growth
        const color = growth > 10 ? 'text-green-600' : growth > 0 ? 'text-blue-600' : 'text-red-600'
        return <span className={color}>+{growth}%</span>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer
          title="Traffic by Continent"
          data={continentData}
          type="pie"
          dataKeys={[{ key: 'value', color: '#3b82f6', name: 'Share' }]}
          height={300}
        />
        <ChartContainer
          title="Top Countries by Traffic"
          data={regionalData.slice(0, 5).map((r) => ({ name: r.country, visits: r.visits }))}
          type="bar"
          dataKeys={[{ key: 'visits', color: '#22c55e', name: 'Visits' }]}
          height={300}
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">🌍 Geographic Distribution Map</h3>
        <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
          <div className="text-center">
            <p className="text-4xl">🗺️</p>
            <p className="mt-2">Interactive world map visualization</p>
            <p className="text-sm">Click on a country to see detailed traffic data</p>
          </div>
        </div>
      </div>

      <VirtualizedDataTable
        title="Regional Traffic Breakdown"
        data={regionalData}
        columns={columns as never[]}
        pageSize={15}
      />

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <h3 className="font-semibold text-yellow-800">📈 Regional Insights</h3>
        <ul className="mt-2 space-y-1 text-sm text-yellow-700">
          <li>• India shows the highest growth rate - consider localized content</li>
          <li>• European traffic is steady - GDPR compliance paying off</li>
          <li>• Low penetration in Asian markets presents expansion opportunity</li>
          <li>• Consider CDN optimization for Australian users (higher latency)</li>
        </ul>
      </div>
    </div>
  )
}

export default function RegionalTrafficPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Regional Traffic</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analyze traffic patterns across geographic regions
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
        <RegionalTrafficData />
      </Suspense>
    </div>
  )
}
