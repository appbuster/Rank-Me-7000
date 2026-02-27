import { Suspense } from 'react'
import { getAdCampaigns, getAdvertisingStats, getAdCreatives } from '@/lib/data/advertising'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber, formatCurrency } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function AdsHistoryData() {
  const [campaigns, stats, creatives] = await Promise.all([
    getAdCampaigns({ limit: 50 }),
    getAdvertisingStats(),
    getAdCreatives({ limit: 20 }),
  ])

  const kpis = [
    { title: 'Total Campaigns', value: formatNumber(stats.totalCampaigns) },
    { title: 'Total Spend', value: formatCurrency(stats.totalSpend) },
    { title: 'Total Impressions', value: formatNumber(stats.totalImpressions) },
    { title: 'Avg. CTR', value: `${stats.avgCtr.toFixed(2)}%` },
  ]

  // Group by platform
  const platformData = campaigns.reduce((acc: Record<string, number>, c) => {
    acc[c.platform] = (acc[c.platform] || 0) + c.spend
    return acc
  }, {})

  const platformChartData = Object.entries(platformData).map(([name, spend]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    spend,
  }))

  const campaignColumns = [
    { accessorKey: 'domain', header: 'Advertiser' },
    {
      accessorKey: 'platform',
      header: 'Platform',
      cell: ({ row }: { row: { original: (typeof campaigns)[0] } }) => (
        <span className="capitalize">{row.original.platform}</span>
      ),
    },
    { accessorKey: 'campaignType', header: 'Type' },
    {
      accessorKey: 'spend',
      header: 'Spend',
      cell: ({ row }: { row: { original: (typeof campaigns)[0] } }) => formatCurrency(row.original.spend),
    },
    {
      accessorKey: 'impressions',
      header: 'Impressions',
      cell: ({ row }: { row: { original: (typeof campaigns)[0] } }) => formatNumber(row.original.impressions),
    },
    {
      accessorKey: 'clicks',
      header: 'Clicks',
      cell: ({ row }: { row: { original: (typeof campaigns)[0] } }) => formatNumber(row.original.clicks),
    },
    {
      accessorKey: 'ctr',
      header: 'CTR',
      cell: ({ row }: { row: { original: (typeof campaigns)[0] } }) => `${row.original.ctr.toFixed(2)}%`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: { original: (typeof campaigns)[0] } }) => {
        const status = row.original.status
        const colors: Record<string, string> = {
          active: 'bg-green-100 text-green-700',
          paused: 'bg-yellow-100 text-yellow-700',
          ended: 'bg-gray-100 text-gray-700',
        }
        return (
          <span className={`rounded px-2 py-0.5 text-xs capitalize ${colors[status] || 'bg-gray-100'}`}>
            {status}
          </span>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer
          title="Spend by Platform"
          data={platformChartData}
          type="pie"
          dataKeys={[{ key: 'spend', color: '#3b82f6', name: 'Spend' }]}
          height={300}
        />
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Recent Ad Creatives</h3>
          <div className="space-y-3">
            {creatives.slice(0, 5).map((creative) => (
              <div key={creative.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-blue-600">{creative.headline}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{creative.description}</p>
                    {creative.displayUrl && (
                      <p className="mt-1 text-xs text-green-600">{creative.displayUrl}</p>
                    )}
                  </div>
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                    {creative.format}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <span>{formatNumber(creative.impressions)} impr.</span>
                  <span>{formatNumber(creative.clicks)} clicks</span>
                  <span>{creative.ctr.toFixed(2)}% CTR</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <VirtualizedDataTable
        title="Ad Campaign History"
        data={campaigns}
        columns={campaignColumns as never[]}
        pageSize={20}
      />
    </div>
  )
}

export default function AdsHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ads History</h1>
        <p className="mt-1 text-sm text-gray-500">
          View historical ad campaigns and creative performance
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
        <AdsHistoryData />
      </Suspense>
    </div>
  )
}
