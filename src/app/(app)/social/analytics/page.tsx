import { Suspense } from 'react'
import { getSocialStats, getTopPosts, getAggregatedMetrics, getProfilesByPlatform } from '@/lib/data/social'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function SocialAnalyticsData() {
  const [stats, topPosts, metrics, byPlatform] = await Promise.all([
    getSocialStats(),
    getTopPosts(10),
    getAggregatedMetrics(30),
    getProfilesByPlatform(),
  ])

  const kpis = [
    { title: 'Total Impressions', value: formatNumber(metrics.totalImpressions), trend: 'up' as const },
    { title: 'Total Engagements', value: formatNumber(metrics.totalEngagements), trend: 'up' as const },
    { title: 'Follower Growth', value: formatNumber(metrics.followerGrowth), trend: metrics.followerGrowth >= 0 ? 'up' as const : 'down' as const },
    { title: 'Avg. Engagement Rate', value: `${stats.avgEngagementRate}%` },
  ]

  const platformEngagement = byPlatform.map((p) => ({
    name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
    followers: p.followers,
    value: Math.round(p.followers / 1000),
  }))

  // Mock time series data for the chart
  const timeSeriesData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return {
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      impressions: Math.floor(Math.random() * 10000) + 5000,
      engagements: Math.floor(Math.random() * 500) + 200,
    }
  })

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer
          title="Impressions & Engagements (30 Days)"
          data={timeSeriesData}
          type="area"
          dataKeys={[
            { key: 'impressions', color: '#3b82f6', name: 'Impressions' },
            { key: 'engagements', color: '#22c55e', name: 'Engagements' },
          ]}
          height={300}
        />
        <ChartContainer
          title="Followers by Platform"
          data={platformEngagement}
          type="pie"
          dataKeys={[{ key: 'followers', color: '#3b82f6', name: 'Followers' }]}
          height={300}
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Top Performing Posts</h3>
        <div className="space-y-4">
          {topPosts.map((post, index) => (
            <div key={post.id} className="flex items-start gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                #{index + 1}
              </span>
              <div className="flex-1">
                <p className="line-clamp-2 text-sm">{post.content || 'No content available'}</p>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <span className="capitalize">{post.platform}</span>
                  <span>❤️ {formatNumber(post.likes)}</span>
                  <span>💬 {formatNumber(post.comments)}</span>
                  <span>🔄 {formatNumber(post.shares)}</span>
                  <span>👁️ {formatNumber(post.impressions)} impressions</span>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-2 text-lg font-semibold">Best Time to Post</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tuesday 10:00 AM</span>
              <span className="text-green-600">High engagement</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Wednesday 2:00 PM</span>
              <span className="text-green-600">High engagement</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Friday 4:00 PM</span>
              <span className="text-blue-600">Good engagement</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-2 text-lg font-semibold">Content Performance</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Videos</span>
              <span className="font-medium">4.2% engagement</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Images</span>
              <span className="font-medium">2.8% engagement</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Text</span>
              <span className="font-medium">1.5% engagement</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-2 text-lg font-semibold">Audience Growth</h3>
          <div className="text-3xl font-bold text-green-600">+{formatNumber(metrics.followerGrowth)}</div>
          <p className="text-sm text-gray-500">new followers this month</p>
          <div className="mt-2 text-sm">
            <span className="text-green-600">↑ 12%</span> vs last month
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SocialAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Social Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analyze your social media performance across all platforms
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
        <SocialAnalyticsData />
      </Suspense>
    </div>
  )
}
