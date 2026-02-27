import { Suspense } from 'react'
import Link from 'next/link'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { FilterBar } from '@/components/ui/FilterBar'
export const dynamic = 'force-dynamic'

// Mock reports data
const reportsData = [
  { id: '1', name: 'Weekly SEO Overview', type: 'SEO', status: 'completed', createdAt: new Date('2024-02-20'), schedule: 'Weekly', lastRun: new Date('2024-02-19'), pages: 12 },
  { id: '2', name: 'Monthly Backlink Report', type: 'Backlinks', status: 'completed', createdAt: new Date('2024-02-15'), schedule: 'Monthly', lastRun: new Date('2024-02-01'), pages: 8 },
  { id: '3', name: 'Competitor Analysis Q1', type: 'Competitive', status: 'completed', createdAt: new Date('2024-02-10'), schedule: 'One-time', lastRun: new Date('2024-02-10'), pages: 24 },
  { id: '4', name: 'Traffic Insights', type: 'Traffic', status: 'scheduled', createdAt: new Date('2024-02-18'), schedule: 'Weekly', lastRun: new Date('2024-02-12'), pages: 10 },
  { id: '5', name: 'Content Performance', type: 'Content', status: 'draft', createdAt: new Date('2024-02-21'), schedule: 'None', lastRun: null, pages: 6 },
]

async function ReportsData() {
  const kpis = [
    { title: 'Total Reports', value: reportsData.length.toString() },
    { title: 'Scheduled', value: reportsData.filter((r) => r.schedule !== 'None' && r.schedule !== 'One-time').length.toString() },
    { title: 'Generated This Month', value: '12' },
    { title: 'Avg. Pages', value: Math.round(reportsData.reduce((a, r) => a + r.pages, 0) / reportsData.length).toString() },
  ]

  const columns = [
    {
      accessorKey: 'name',
      header: 'Report Name',
      cell: ({ row }: { row: { original: (typeof reportsData)[0] } }) => (
        <Link href={`/reports/${row.original.id}`} className="font-medium text-blue-600 hover:underline">
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }: { row: { original: (typeof reportsData)[0] } }) => (
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{row.original.type}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: { original: (typeof reportsData)[0] } }) => {
        const status = row.original.status
        const colors: Record<string, string> = {
          completed: 'bg-green-100 text-green-700',
          scheduled: 'bg-blue-100 text-blue-700',
          draft: 'bg-gray-100 text-gray-700',
          running: 'bg-yellow-100 text-yellow-700',
        }
        return (
          <span className={`rounded px-2 py-0.5 text-xs capitalize ${colors[status]}`}>
            {status}
          </span>
        )
      },
    },
    { accessorKey: 'schedule', header: 'Schedule' },
    {
      accessorKey: 'lastRun',
      header: 'Last Generated',
      cell: ({ row }: { row: { original: (typeof reportsData)[0] } }) =>
        row.original.lastRun ? new Date(row.original.lastRun).toLocaleDateString() : '—',
    },
    {
      accessorKey: 'pages',
      header: 'Pages',
    },
    {
      accessorKey: 'actions',
      header: '',
      cell: ({ row }: { row: { original: (typeof reportsData)[0] } }) => (
        <div className="flex gap-2">
          {row.original.status === 'completed' && (
            <button className="rounded border border-blue-600 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50">
              📥 Download
            </button>
          )}
          <button className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50">
            Edit
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link
          href="/reports/new"
          className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md"
        >
          <div className="rounded-full bg-blue-100 p-3 text-2xl">📊</div>
          <div>
            <h3 className="font-semibold">Create Report</h3>
            <p className="text-sm text-gray-500">Build a custom report</p>
          </div>
        </Link>
        <Link
          href="/reports/templates"
          className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md"
        >
          <div className="rounded-full bg-green-100 p-3 text-2xl">📋</div>
          <div>
            <h3 className="font-semibold">Templates</h3>
            <p className="text-sm text-gray-500">Start from a template</p>
          </div>
        </Link>
        <Link
          href="/reports/schedule"
          className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md"
        >
          <div className="rounded-full bg-purple-100 p-3 text-2xl">📅</div>
          <div>
            <h3 className="font-semibold">Scheduled</h3>
            <p className="text-sm text-gray-500">Manage scheduled reports</p>
          </div>
        </Link>
      </div>

      <VirtualizedDataTable
        title="My Reports"
        data={reportsData}
        columns={columns as never[]}
        pageSize={15}
      />
    </div>
  )
}

export default function MyReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create, manage, and schedule custom reports
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
        <ReportsData />
      </Suspense>
    </div>
  )
}
