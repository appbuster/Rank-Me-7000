import { Suspense } from 'react'
import { getLocalListings, getLocalStats } from '@/lib/data/local'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function ListingsData() {
  const [listings, stats] = await Promise.all([
    getLocalListings({ limit: 100 }),
    getLocalStats(),
  ])

  const kpis = [
    { title: 'Total Listings', value: formatNumber(stats.totalListings) },
    { title: 'Verified', value: formatNumber(stats.verifiedListings), trend: 'up' as const },
    { title: 'Avg. Rating', value: stats.averageRating.toFixed(1), trend: stats.averageRating >= 4 ? 'up' as const : 'neutral' as const },
    { title: 'NAP Issues', value: stats.napIssues.toString(), trend: 'down' as const },
  ]

  const columns = [
    { accessorKey: 'businessName', header: 'Business Name' },
    {
      accessorKey: 'platform',
      header: 'Platform',
      cell: ({ row }: { row: { original: typeof listings[0] } }) => {
        const platformColors: Record<string, string> = {
          'Google Business': 'bg-blue-100 text-blue-700',
          'Yelp': 'bg-red-100 text-red-700',
          'Facebook': 'bg-indigo-100 text-indigo-700',
          'Apple Maps': 'bg-gray-100 text-gray-700',
          'Bing Places': 'bg-cyan-100 text-cyan-700',
          'TripAdvisor': 'bg-green-100 text-green-700',
        }
        return (
          <span className={`rounded px-2 py-0.5 text-xs ${platformColors[row.original.platform] || 'bg-gray-100'}`}>
            {row.original.platform}
          </span>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: { original: typeof listings[0] } }) => {
        const statusColors: Record<string, string> = {
          active: 'bg-green-100 text-green-700',
          pending: 'bg-yellow-100 text-yellow-700',
          inactive: 'bg-gray-100 text-gray-700',
          duplicate: 'bg-red-100 text-red-700',
        }
        return (
          <span className={`rounded px-2 py-0.5 text-xs capitalize ${statusColors[row.original.status]}`}>
            {row.original.status}
          </span>
        )
      },
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }: { row: { original: typeof listings[0] } }) => {
        const rating = row.original.rating
        if (!rating) return <span className="text-gray-400">—</span>
        return (
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span>{rating.toFixed(1)}</span>
          </div>
        )
      },
    },
    { accessorKey: 'reviewCount', header: 'Reviews' },
    {
      accessorKey: 'isVerified',
      header: 'Verified',
      cell: ({ row }: { row: { original: typeof listings[0] } }) =>
        row.original.isVerified ? (
          <span className="text-green-600">✓</span>
        ) : (
          <span className="text-red-600">✗</span>
        ),
    },
    {
      accessorKey: 'issues',
      header: 'Issues',
      cell: ({ row }: { row: { original: typeof listings[0] } }) => {
        const issues = row.original.issues
        if (issues.length === 0) return <span className="text-green-600">None</span>
        return (
          <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">
            {issues.length} issue{issues.length > 1 ? 's' : ''}
          </span>
        )
      },
    },
    {
      accessorKey: 'lastSynced',
      header: 'Last Synced',
      cell: ({ row }: { row: { original: typeof listings[0] } }) =>
        new Date(row.original.lastSynced).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      {stats.napIssues > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <h3 className="font-semibold text-yellow-800">⚠️ NAP Consistency Issues</h3>
          <p className="mt-1 text-sm text-yellow-700">
            {stats.napIssues} listings have inconsistent Name, Address, or Phone information.
            Fix these to improve local SEO.
          </p>
        </div>
      )}

      <VirtualizedDataTable
        title="Local Listings"
        data={listings}
        columns={columns as never[]}
        pageSize={20}
      />
    </div>
  )
}

export default function LocalListingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Listing Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and monitor your business listings across platforms
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
        <ListingsData />
      </Suspense>
    </div>
  )
}
