import { Suspense } from 'react'
import { getAdCampaigns, getAdCreatives } from '@/lib/data/advertising'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber, formatCurrency } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function AdClarityData() {
  const [campaigns, creatives] = await Promise.all([
    getAdCampaigns({ limit: 50 }),
    getAdCreatives({ format: 'display', limit: 30 }),
  ])

  // Filter for display campaigns
  const displayCampaigns = campaigns.filter((c) => c.campaignType === 'display')
  const displaySpend = displayCampaigns.reduce((a, c) => a + c.spend, 0)
  const displayImpressions = displayCampaigns.reduce((a, c) => a + c.impressions, 0)

  const kpis = [
    { title: 'Display Campaigns', value: displayCampaigns.length.toString() },
    { title: 'Display Spend', value: formatCurrency(displaySpend) },
    { title: 'Display Impressions', value: formatNumber(displayImpressions) },
    { title: 'Active Creatives', value: creatives.length.toString() },
  ]

  // Mock ad placement data
  const placementData = [
    { name: 'Google Display', value: 45 },
    { name: 'Facebook Audience', value: 25 },
    { name: 'Programmatic', value: 20 },
    { name: 'Direct Buys', value: 10 },
  ]

  // Mock format distribution
  const formatData = [
    { name: 'Banner (300x250)', count: 35 },
    { name: 'Leaderboard (728x90)', count: 25 },
    { name: 'Skyscraper (160x600)', count: 20 },
    { name: 'Large Rectangle (336x280)', count: 15 },
    { name: 'Other', count: 5 },
  ]

  const creativeColumns = [
    {
      accessorKey: 'headline',
      header: 'Creative',
      cell: ({ row }: { row: { original: (typeof creatives)[0] } }) => (
        <div>
          <p className="font-medium">{row.original.headline}</p>
          {row.original.description && (
            <p className="line-clamp-1 text-sm text-gray-500">{row.original.description}</p>
          )}
        </div>
      ),
    },
    { accessorKey: 'format', header: 'Format' },
    {
      accessorKey: 'impressions',
      header: 'Impressions',
      cell: ({ row }: { row: { original: (typeof creatives)[0] } }) => formatNumber(row.original.impressions),
    },
    {
      accessorKey: 'clicks',
      header: 'Clicks',
      cell: ({ row }: { row: { original: (typeof creatives)[0] } }) => formatNumber(row.original.clicks),
    },
    {
      accessorKey: 'ctr',
      header: 'CTR',
      cell: ({ row }: { row: { original: (typeof creatives)[0] } }) => `${row.original.ctr.toFixed(2)}%`,
    },
    {
      accessorKey: 'firstSeen',
      header: 'First Seen',
      cell: ({ row }: { row: { original: (typeof creatives)[0] } }) =>
        new Date(row.original.firstSeen).toLocaleDateString(),
    },
    {
      accessorKey: 'lastSeen',
      header: 'Last Seen',
      cell: ({ row }: { row: { original: (typeof creatives)[0] } }) =>
        new Date(row.original.lastSeen).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="font-semibold text-blue-800">🎯 Display Advertising Intelligence</h3>
        <p className="mt-1 text-sm text-blue-700">
          Monitor competitor display ads, discover creative strategies, and find placement opportunities across the web.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer
          title="Ad Placement Distribution"
          data={placementData}
          type="pie"
          dataKeys={[{ key: 'value', color: '#3b82f6', name: 'Share' }]}
          height={300}
        />
        <ChartContainer
          title="Ad Format Distribution"
          data={formatData}
          type="bar"
          dataKeys={[{ key: 'count', color: '#22c55e', name: 'Creatives' }]}
          height={300}
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Competitor Ad Search</h3>
        <form className="flex gap-4">
          <input
            type="text"
            placeholder="Enter competitor domain..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <select className="rounded-lg border border-gray-300 px-4 py-2">
            <option>All Networks</option>
            <option>Google Display</option>
            <option>Facebook</option>
            <option>Programmatic</option>
          </select>
          <select className="rounded-lg border border-gray-300 px-4 py-2">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
          <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-2 text-lg font-semibold">Top Publishers</h3>
          <div className="space-y-2">
            {['news.com', 'techblog.io', 'lifestyle.net', 'sports.tv', 'weather.com'].map((site, i) => (
              <div key={site} className="flex items-center justify-between text-sm">
                <span>{site}</span>
                <span className="text-gray-500">{formatNumber(10000 - i * 1500)} impr.</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-2 text-lg font-semibold">Ad Technologies</h3>
          <div className="space-y-2">
            {[
              { name: 'Google Ads', share: '45%' },
              { name: 'DV360', share: '20%' },
              { name: 'Trade Desk', share: '15%' },
              { name: 'Amazon DSP', share: '12%' },
              { name: 'Other', share: '8%' },
            ].map((tech) => (
              <div key={tech.name} className="flex items-center justify-between text-sm">
                <span>{tech.name}</span>
                <span className="font-medium">{tech.share}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-2 text-lg font-semibold">Creative Insights</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Most used CTA:</span> &quot;Learn More&quot;
            </p>
            <p>
              <span className="font-medium">Avg. headline length:</span> 32 chars
            </p>
            <p>
              <span className="font-medium">Top color:</span> Blue (#3B82F6)
            </p>
            <p>
              <span className="font-medium">Image vs Video:</span> 78% / 22%
            </p>
          </div>
        </div>
      </div>

      <VirtualizedDataTable
        title="Display Ad Creatives"
        data={creatives}
        columns={creativeColumns as never[]}
        pageSize={15}
      />
    </div>
  )
}

export default function AdClarityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Display Advertising Intelligence</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analyze competitor display ads and discover placement opportunities
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
        <AdClarityData />
      </Suspense>
    </div>
  )
}
