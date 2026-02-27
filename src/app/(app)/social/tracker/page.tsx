import { Suspense } from 'react'
import { getSocialProfiles, getSocialStats, getProfilesByPlatform } from '@/lib/data/social'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function SocialTrackerData() {
  const [profiles, stats, byPlatform] = await Promise.all([
    getSocialProfiles({ limit: 50 }),
    getSocialStats(),
    getProfilesByPlatform(),
  ])

  const kpis = [
    { title: 'Profiles Tracked', value: formatNumber(stats.totalProfiles) },
    { title: 'Total Followers', value: formatNumber(stats.totalFollowers) },
    { title: 'Avg. Engagement', value: `${stats.avgEngagementRate}%` },
    { title: 'Total Posts', value: formatNumber(stats.totalPosts) },
  ]

  const platformData = byPlatform.map((p) => ({
    name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
    followers: p.followers,
    profiles: p.count,
  }))

  const columns = [
    {
      accessorKey: 'platform',
      header: 'Platform',
      cell: ({ row }: { row: { original: (typeof profiles)[0] } }) => {
        const platform = row.original.platform
        const icons: Record<string, string> = {
          twitter: '𝕏',
          instagram: '📷',
          facebook: '📘',
          linkedin: '💼',
          youtube: '▶️',
          tiktok: '🎵',
        }
        return (
          <span className="flex items-center gap-2">
            <span>{icons[platform] || '🌐'}</span>
            <span className="capitalize">{platform}</span>
          </span>
        )
      },
    },
    { accessorKey: 'handle', header: 'Handle' },
    { accessorKey: 'displayName', header: 'Name' },
    {
      accessorKey: 'followers',
      header: 'Followers',
      cell: ({ row }: { row: { original: (typeof profiles)[0] } }) => formatNumber(row.original.followers),
    },
    {
      accessorKey: 'engagementRate',
      header: 'Engagement',
      cell: ({ row }: { row: { original: (typeof profiles)[0] } }) => {
        const rate = row.original.engagementRate
        const color = rate >= 3 ? 'text-green-600' : rate >= 1 ? 'text-blue-600' : 'text-gray-600'
        return <span className={color}>{rate.toFixed(2)}%</span>
      },
    },
    {
      accessorKey: 'isVerified',
      header: 'Verified',
      cell: ({ row }: { row: { original: (typeof profiles)[0] } }) =>
        row.original.isVerified ? (
          <span className="text-blue-500">✓</span>
        ) : (
          <span className="text-gray-300">—</span>
        ),
    },
    {
      accessorKey: 'lastUpdated',
      header: 'Last Updated',
      cell: ({ row }: { row: { original: (typeof profiles)[0] } }) =>
        new Date(row.original.lastUpdated).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer
          title="Followers by Platform"
          data={platformData}
          type="bar"
          dataKeys={[{ key: 'followers', color: '#3b82f6', name: 'Followers' }]}
          height={300}
        />
        <ChartContainer
          title="Profiles by Platform"
          data={platformData}
          type="pie"
          dataKeys={[{ key: 'profiles', color: '#3b82f6', name: 'Profiles' }]}
          height={300}
        />
      </div>

      <VirtualizedDataTable
        title="Tracked Social Profiles"
        data={profiles}
        columns={columns as never[]}
        pageSize={15}
      />
    </div>
  )
}

export default function SocialTrackerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Social Tracker</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track competitor social media profiles and performance
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
        <SocialTrackerData />
      </Suspense>
    </div>
  )
}
