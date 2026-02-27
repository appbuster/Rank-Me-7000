import { Suspense } from 'react'
import { getTopDomainsByTraffic, getTrafficSummary } from '@/lib/data/traffic'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'

async function TrafficDistributionData() {
  const topDomains = await getTopDomainsByTraffic(30, 10)
  const domain = topDomains[0]?.domain || 'example.com'
  const summary = await getTrafficSummary(domain, 30)

  const kpis = [
    { title: 'Total Traffic', value: formatNumber(summary?.totalVisits || 0) },
    { title: 'Direct', value: `${summary?.trafficSources.direct || 0}%` },
    { title: 'Organic Search', value: `${summary?.trafficSources.search || 0}%` },
    { title: 'Paid', value: `${summary?.trafficSources.paid || 0}%` },
  ]

  const channelData = summary
    ? [
        { name: 'Direct', value: summary.trafficSources.direct, color: '#3b82f6' },
        { name: 'Organic Search', value: summary.trafficSources.search, color: '#22c55e' },
        { name: 'Social', value: summary.trafficSources.social, color: '#f59e0b' },
        { name: 'Referral', value: summary.trafficSources.referral, color: '#8b5cf6' },
        { name: 'Paid', value: summary.trafficSources.paid, color: '#ef4444' },
      ]
    : []

  // Mock referral sources
  const referralData = [
    { name: 'google.com', visits: 45000 },
    { name: 'facebook.com', visits: 12000 },
    { name: 'twitter.com', visits: 8500 },
    { name: 'linkedin.com', visits: 6200 },
    { name: 'reddit.com', visits: 4800 },
    { name: 'youtube.com', visits: 3500 },
    { name: 'medium.com', visits: 2800 },
    { name: 'techcrunch.com', visits: 2100 },
  ]

  // Mock search engine distribution
  const searchEngineData = [
    { name: 'Google', value: 85 },
    { name: 'Bing', value: 8 },
    { name: 'DuckDuckGo', value: 4 },
    { name: 'Yahoo', value: 2 },
    { name: 'Other', value: 1 },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer
          title="Traffic by Channel"
          data={channelData}
          type="pie"
          dataKeys={[{ key: 'value', color: '#3b82f6', name: 'Share' }]}
          height={300}
        />
        <ChartContainer
          title="Search Engine Distribution"
          data={searchEngineData}
          type="pie"
          dataKeys={[{ key: 'value', color: '#22c55e', name: 'Share' }]}
          height={300}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Top Referral Sources</h3>
          <div className="space-y-3">
            {referralData.map((source) => (
              <div key={source.name} className="flex items-center justify-between">
                <span className="text-sm">{source.name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(source.visits / referralData[0].visits) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{formatNumber(source.visits)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Channel Performance</h3>
          <div className="space-y-4">
            {channelData.map((channel) => (
              <div key={channel.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{channel.name}</span>
                  <span className="font-medium">{channel.value}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full bg-blue-500" style={{ width: `${channel.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="font-semibold text-blue-800">💡 Channel Insights</h3>
        <ul className="mt-2 space-y-1 text-sm text-blue-700">
          <li>• Organic search is your strongest channel - maintain SEO efforts</li>
          <li>• Social traffic has grown 15% this month</li>
          <li>• Consider increasing paid spend on high-converting keywords</li>
          <li>• Referral from linkedin.com shows high engagement rates</li>
        </ul>
      </div>
    </div>
  )
}

export default function TrafficDistributionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Traffic Distribution</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analyze traffic sources and channel performance
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
        <TrafficDistributionData />
      </Suspense>
    </div>
  )
}
