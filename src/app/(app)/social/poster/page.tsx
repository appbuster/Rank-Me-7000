import { Suspense } from 'react'
import { getSocialProfiles, getSocialStats } from '@/lib/data/social'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { formatNumber } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function SocialPosterData() {
  const [profiles, stats] = await Promise.all([
    getSocialProfiles({ limit: 10 }),
    getSocialStats(),
  ])

  const kpis = [
    { title: 'Connected Accounts', value: profiles.length.toString() },
    { title: 'Posts Scheduled', value: '24' },
    { title: 'Posts This Week', value: '18' },
    { title: 'Avg. Reach', value: formatNumber(stats.totalImpressions / stats.totalPosts || 0) },
  ]

  return (
    <div className="space-y-6">
      <KpiTileGrid tiles={kpis} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Create Post</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Post Content</label>
              <textarea
                rows={4}
                placeholder="What would you like to share?"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
              <div className="mt-1 text-right text-xs text-gray-500">0/280 characters</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Platforms</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {['Twitter/X', 'Instagram', 'Facebook', 'LinkedIn', 'TikTok'].map((platform) => (
                  <label key={platform} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-sm">{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Media</label>
              <div className="mt-1 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <p className="text-sm text-gray-500">Drag & drop images or videos, or click to browse</p>
                <button type="button" className="mt-2 text-sm text-blue-600 hover:underline">
                  Browse files
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Schedule</label>
                <select className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2">
                  <option>Post now</option>
                  <option>Schedule for later</option>
                  <option>Save as draft</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Schedule Post
              </button>
              <button type="button" className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
                ✨ AI Assist
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Connected Accounts</h3>
            <div className="space-y-2">
              {profiles.slice(0, 5).map((profile) => (
                <div key={profile.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-2">
                  <div className="flex items-center gap-2">
                    <span className="capitalize">{profile.platform}</span>
                    <span className="text-sm text-gray-500">@{profile.handle}</span>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-green-500" title="Connected" />
                </div>
              ))}
              <button className="w-full rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">
                + Connect Account
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Upcoming Posts</h3>
            <div className="space-y-2">
              {[
                { time: 'Today 3:00 PM', platform: 'Twitter', content: 'New blog post announcement...' },
                { time: 'Tomorrow 10:00 AM', platform: 'LinkedIn', content: 'Weekly industry insights...' },
                { time: 'Wed 2:00 PM', platform: 'Instagram', content: 'Behind the scenes look...' },
              ].map((post, i) => (
                <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{post.time}</span>
                    <span className="font-medium">{post.platform}</span>
                  </div>
                  <p className="mt-1 truncate text-sm">{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SocialPosterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Social Poster</h1>
        <p className="mt-1 text-sm text-gray-500">
          Schedule and publish posts across all social platforms
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
        <SocialPosterData />
      </Suspense>
    </div>
  )
}
