import { Suspense } from 'react'
import { getLocalListings, getLocalStats } from '@/lib/data/local'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { formatNumber } from '@/lib/utils'

async function GbpData() {
  const [listings, stats] = await Promise.all([
    getLocalListings({ platform: 'google', limit: 20 }),
    getLocalStats(),
  ])

  const googleListings = listings.filter((l) => l.platform === 'google')

  const kpis = [
    { title: 'GBP Profiles', value: formatNumber(googleListings.length) },
    { title: 'Verified', value: formatNumber(googleListings.filter((l) => l.isVerified).length), trend: 'up' as const },
    { title: 'Avg. Rating', value: stats.averageRating.toFixed(1) },
    { title: 'Total Reviews', value: formatNumber(stats.totalReviews) },
  ]

  return (
    <div className="space-y-6">
      <KpiTileGrid tiles={kpis} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Google Business Profiles</h3>
          <div className="space-y-4">
            {googleListings.map((listing) => (
              <div key={listing.id} className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{listing.businessName}</h4>
                    {listing.isVerified && (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">✓ Verified</span>
                    )}
                  </div>
                  {listing.nap && (
                    <p className="mt-1 text-sm text-gray-500">{listing.nap.address}</p>
                  )}
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    {listing.rating && (
                      <span className="flex items-center gap-1">
                        ⭐ {listing.rating.toFixed(1)}
                      </span>
                    )}
                    <span>{listing.reviewCount} reviews</span>
                    <span className="text-gray-400">|</span>
                    <span className={listing.status === 'active' ? 'text-green-600' : 'text-yellow-600'}>
                      {listing.status}
                    </span>
                  </div>
                  {listing.issues.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {listing.issues.map((issue, i) => (
                        <span key={i} className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">
                          ⚠️ {issue}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100">
                  Manage
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50">
                📝 Update Business Info
              </button>
              <button className="w-full rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50">
                📸 Add Photos
              </button>
              <button className="w-full rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50">
                📢 Create Post
              </button>
              <button className="w-full rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50">
                💬 Respond to Reviews
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <h3 className="font-semibold text-yellow-800">Optimization Tips</h3>
            <ul className="mt-2 space-y-2 text-sm text-yellow-700">
              <li>• Add more photos to increase engagement</li>
              <li>• Post weekly updates</li>
              <li>• Respond to all reviews within 24h</li>
              <li>• Keep business hours updated</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GbpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Google Business Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your Google Business Profile listings
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
        <GbpData />
      </Suspense>
    </div>
  )
}
