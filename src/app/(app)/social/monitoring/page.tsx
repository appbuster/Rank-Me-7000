import { Suspense } from 'react'
import { getSocialPosts } from '@/lib/data/social'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function SocialMonitoringData() {
  const posts = await getSocialPosts({ limit: 50 })

  const kpis = [
    { title: 'Brand Mentions', value: '1,247' },
    { title: 'Sentiment Score', value: '78%', trend: 'up' as const },
    { title: 'Competitor Mentions', value: '432' },
    { title: 'Alerts Today', value: '5' },
  ]

  // Mock alerts data
  const alerts = [
    { type: 'mention', message: 'Your brand was mentioned by @influencer123', time: '2 hours ago', sentiment: 'positive' },
    { type: 'spike', message: 'Unusual spike in mentions detected', time: '4 hours ago', sentiment: 'neutral' },
    { type: 'negative', message: 'Negative review trending on Twitter', time: '6 hours ago', sentiment: 'negative' },
    { type: 'competitor', message: 'Competitor launched new campaign', time: '1 day ago', sentiment: 'neutral' },
  ]

  const columns = [
    {
      accessorKey: 'platform',
      header: 'Platform',
      cell: ({ row }: { row: { original: (typeof posts)[0] } }) => (
        <span className="capitalize">{row.original.platform}</span>
      ),
    },
    {
      accessorKey: 'content',
      header: 'Content',
      cell: ({ row }: { row: { original: (typeof posts)[0] } }) => (
        <div className="max-w-md truncate text-sm">{row.original.content || '—'}</div>
      ),
    },
    {
      accessorKey: 'impressions',
      header: 'Reach',
      cell: ({ row }: { row: { original: (typeof posts)[0] } }) => formatNumber(row.original.impressions),
    },
    {
      accessorKey: 'engagement',
      header: 'Engagement',
      cell: ({ row }: { row: { original: (typeof posts)[0] } }) => {
        const engagement = row.original.likes + row.original.comments + row.original.shares
        return formatNumber(engagement)
      },
    },
    {
      accessorKey: 'sentiment',
      header: 'Sentiment',
      cell: () => {
        const sentiments = ['positive', 'neutral', 'negative']
        const sentiment = sentiments[Math.floor(Math.random() * 3)]
        const colors: Record<string, string> = {
          positive: 'bg-green-100 text-green-700',
          neutral: 'bg-gray-100 text-gray-700',
          negative: 'bg-red-100 text-red-700',
        }
        return (
          <span className={`rounded px-2 py-0.5 text-xs capitalize ${colors[sentiment]}`}>
            {sentiment}
          </span>
        )
      },
    },
    {
      accessorKey: 'publishedAt',
      header: 'Date',
      cell: ({ row }: { row: { original: (typeof posts)[0] } }) =>
        new Date(row.original.publishedAt).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Monitoring Setup</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Keywords to Monitor</label>
              <input
                type="text"
                placeholder="Enter keywords separated by commas"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                defaultValue="brand name, product name, CEO name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Competitors</label>
              <input
                type="text"
                placeholder="Enter competitor names"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                defaultValue="competitor1, competitor2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alert Preferences</label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span className="text-sm">Email alerts for negative mentions</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span className="text-sm">Daily summary report</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-blue-600" />
                  <span className="text-sm">Real-time Slack notifications</span>
                </label>
              </div>
            </div>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Save Settings
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Recent Alerts</h3>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      alert.sentiment === 'positive'
                        ? 'bg-green-500'
                        : alert.sentiment === 'negative'
                          ? 'bg-red-500'
                          : 'bg-gray-400'
                    }`}
                  />
                  <span className="text-sm">{alert.message}</span>
                </div>
                <span className="text-xs text-gray-500">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <VirtualizedDataTable
        title="Monitored Mentions"
        data={posts}
        columns={columns as never[]}
        pageSize={15}
      />
    </div>
  )
}

export default function SocialMonitoringPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Social Monitoring</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor brand mentions, sentiment, and competitor activity
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
        <SocialMonitoringData />
      </Suspense>
    </div>
  )
}
