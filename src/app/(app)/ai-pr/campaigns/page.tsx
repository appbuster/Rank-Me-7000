import { Suspense } from 'react'
import { getAIPrCampaigns, getAIPrStats } from '@/lib/data/ai'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function PRCampaignsData() {
  const [campaigns, stats] = await Promise.all([
    getAIPrCampaigns({ limit: 50 }),
    getAIPrStats(),
  ])

  const kpis = [
    { title: 'Total Campaigns', value: formatNumber(stats.totalCampaigns) },
    { title: 'Active Campaigns', value: formatNumber(stats.activeCampaigns), trend: 'up' as const },
    { title: 'Total Placements', value: formatNumber(stats.totalPlacements) },
    { title: 'Avg. Open Rate', value: `${stats.avgOpenRate}%` },
  ]

  const columns = [
    { accessorKey: 'name', header: 'Campaign Name' },
    { accessorKey: 'brand', header: 'Brand' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: { original: (typeof campaigns)[0] } }) => {
        const status = row.original.status
        const colors: Record<string, string> = {
          active: 'bg-green-100 text-green-700',
          draft: 'bg-gray-100 text-gray-700',
          paused: 'bg-yellow-100 text-yellow-700',
          completed: 'bg-blue-100 text-blue-700',
        }
        return (
          <span className={`rounded px-2 py-0.5 text-xs capitalize ${colors[status] || 'bg-gray-100'}`}>
            {status}
          </span>
        )
      },
    },
    {
      accessorKey: 'sentCount',
      header: 'Sent',
      cell: ({ row }: { row: { original: (typeof campaigns)[0] } }) => formatNumber(row.original.sentCount),
    },
    {
      accessorKey: 'openRate',
      header: 'Open Rate',
      cell: ({ row }: { row: { original: (typeof campaigns)[0] } }) => {
        const rate = row.original.sentCount > 0 
          ? ((row.original.openCount / row.original.sentCount) * 100).toFixed(1) 
          : '0'
        return `${rate}%`
      },
    },
    {
      accessorKey: 'replyCount',
      header: 'Replies',
      cell: ({ row }: { row: { original: (typeof campaigns)[0] } }) => row.original.replyCount,
    },
    {
      accessorKey: 'placementCount',
      header: 'Placements',
      cell: ({ row }: { row: { original: (typeof campaigns)[0] } }) => (
        <span className={row.original.placementCount > 0 ? 'font-medium text-green-600' : ''}>
          {row.original.placementCount}
        </span>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }: { row: { original: (typeof campaigns)[0] } }) =>
        new Date(row.original.updatedAt).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Create New Campaign</h3>
            <p className="text-sm text-gray-500">Launch an AI-powered PR outreach campaign</p>
          </div>
          <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            + New Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.totalSent}</div>
          <p className="text-sm text-gray-500">Total Pitches Sent</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{stats.avgReplyRate}%</div>
          <p className="text-sm text-gray-500">Average Reply Rate</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.totalPlacements}</div>
          <p className="text-sm text-gray-500">Media Placements</p>
        </div>
      </div>

      <VirtualizedDataTable
        title="PR Campaigns"
        data={campaigns}
        columns={columns as never[]}
        pageSize={15}
      />
    </div>
  )
}

export default function PRCampaignsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">PR Campaigns</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage AI-powered PR outreach campaigns
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
        <PRCampaignsData />
      </Suspense>
    </div>
  )
}
