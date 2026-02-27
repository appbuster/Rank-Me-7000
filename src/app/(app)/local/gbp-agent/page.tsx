import { Suspense } from 'react'
import { getLocalStats, getReviews } from '@/lib/data/local'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { formatNumber } from '@/lib/utils'

async function GbpAgentData() {
  const [stats, recentReviews] = await Promise.all([
    getLocalStats(),
    getReviews({ responded: false, limit: 5 }),
  ])

  const kpis = [
    { title: 'Tasks Completed', value: '127' },
    { title: 'Auto-Responses', value: '45' },
    { title: 'Posts Scheduled', value: '12' },
    { title: 'Pending Reviews', value: formatNumber(stats.pendingResponses) },
  ]

  return (
    <div className="space-y-6">
      <KpiTileGrid tiles={kpis} />

      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
        <h3 className="font-semibold text-purple-800">🤖 GBP AI Agent</h3>
        <p className="mt-1 text-sm text-purple-700">
          Automate your Google Business Profile management with AI-powered responses, post scheduling, and optimization suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Agent Tasks</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-green-100 p-2 text-green-600">✓</span>
                <div>
                  <p className="font-medium">Auto-respond to reviews</p>
                  <p className="text-sm text-gray-500">Drafts responses for approval</p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" defaultChecked className="peer sr-only" />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:outline-none"></div>
              </label>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-blue-100 p-2 text-blue-600">📅</span>
                <div>
                  <p className="font-medium">Schedule weekly posts</p>
                  <p className="text-sm text-gray-500">AI generates engaging content</p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" defaultChecked className="peer sr-only" />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:outline-none"></div>
              </label>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-yellow-100 p-2 text-yellow-600">📊</span>
                <div>
                  <p className="font-medium">Monitor competitors</p>
                  <p className="text-sm text-gray-500">Track nearby business changes</p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:outline-none"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Pending Review Responses</h3>
          {recentReviews.length > 0 ? (
            <div className="space-y-3">
              {recentReviews.map((review) => (
                <div key={review.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{review.authorName}</span>
                    <span className="text-sm">{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">{review.content}</p>
                  <div className="mt-2 flex gap-2">
                    <button className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700">
                      Generate Response
                    </button>
                    <button className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100">
                      Skip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">All reviews have been responded to! 🎉</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Recent Agent Activity</h3>
        <div className="space-y-2">
          {[
            { time: '2 hours ago', action: 'Generated response for 5-star review', status: 'completed' },
            { time: '4 hours ago', action: 'Scheduled post: "Weekend Special Deals"', status: 'completed' },
            { time: '1 day ago', action: 'Updated business hours for holiday', status: 'completed' },
            { time: '2 days ago', action: 'Flagged NAP inconsistency detected', status: 'alert' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0">
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-sm">{activity.action}</span>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function GbpAgentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">GBP AI Agent</h1>
        <p className="mt-1 text-sm text-gray-500">
          Automated Google Business Profile management
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
        <GbpAgentData />
      </Suspense>
    </div>
  )
}
