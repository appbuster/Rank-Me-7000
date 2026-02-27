import { Suspense } from 'react'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { FilterBar } from '@/components/ui/FilterBar'
export const dynamic = 'force-dynamic'

const scheduledReports = [
  {
    id: '1',
    name: 'Weekly SEO Overview',
    template: 'SEO Overview',
    frequency: 'Weekly',
    nextRun: new Date('2024-02-26'),
    lastRun: new Date('2024-02-19'),
    recipients: ['team@company.com'],
    status: 'active',
  },
  {
    id: '2',
    name: 'Monthly Backlink Report',
    template: 'Backlink Analysis',
    frequency: 'Monthly',
    nextRun: new Date('2024-03-01'),
    lastRun: new Date('2024-02-01'),
    recipients: ['ceo@company.com', 'marketing@company.com'],
    status: 'active',
  },
  {
    id: '3',
    name: 'Bi-Weekly Traffic Report',
    template: 'Traffic Report',
    frequency: 'Bi-Weekly',
    nextRun: new Date('2024-02-28'),
    lastRun: new Date('2024-02-14'),
    recipients: ['analytics@company.com'],
    status: 'active',
  },
  {
    id: '4',
    name: 'Quarterly Competitive Analysis',
    template: 'Competitive Analysis',
    frequency: 'Quarterly',
    nextRun: new Date('2024-04-01'),
    lastRun: new Date('2024-01-01'),
    recipients: ['exec@company.com'],
    status: 'paused',
  },
]

async function ScheduleData() {
  const kpis = [
    { title: 'Scheduled Reports', value: scheduledReports.length.toString() },
    { title: 'Active', value: scheduledReports.filter((r) => r.status === 'active').length.toString() },
    { title: 'Next Report', value: 'Tomorrow' },
    { title: 'Recipients', value: '8' },
  ]

  const columns = [
    {
      accessorKey: 'name',
      header: 'Report Name',
      cell: ({ row }: { row: { original: (typeof scheduledReports)[0] } }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    { accessorKey: 'template', header: 'Template' },
    { accessorKey: 'frequency', header: 'Frequency' },
    {
      accessorKey: 'nextRun',
      header: 'Next Run',
      cell: ({ row }: { row: { original: (typeof scheduledReports)[0] } }) =>
        new Date(row.original.nextRun).toLocaleDateString(),
    },
    {
      accessorKey: 'lastRun',
      header: 'Last Run',
      cell: ({ row }: { row: { original: (typeof scheduledReports)[0] } }) =>
        new Date(row.original.lastRun).toLocaleDateString(),
    },
    {
      accessorKey: 'recipients',
      header: 'Recipients',
      cell: ({ row }: { row: { original: (typeof scheduledReports)[0] } }) => (
        <span className="text-sm">{row.original.recipients.length} recipient(s)</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: { original: (typeof scheduledReports)[0] } }) => {
        const status = row.original.status
        const colors: Record<string, string> = {
          active: 'bg-green-100 text-green-700',
          paused: 'bg-yellow-100 text-yellow-700',
        }
        return (
          <span className={`rounded px-2 py-0.5 text-xs capitalize ${colors[status]}`}>
            {status}
          </span>
        )
      },
    },
    {
      accessorKey: 'actions',
      header: '',
      cell: ({ row }: { row: { original: (typeof scheduledReports)[0] } }) => (
        <div className="flex gap-2">
          <button className="rounded border border-blue-600 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50">
            {row.original.status === 'active' ? 'Pause' : 'Resume'}
          </button>
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

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Schedule New Report</h3>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Report</label>
            <select className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2">
              <option>Select a report...</option>
              <option>Weekly SEO Overview</option>
              <option>Monthly Backlink Report</option>
              <option>Traffic Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency</label>
            <select className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Bi-Weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Day/Time</label>
            <input
              type="text"
              placeholder="e.g., Monday 9:00 AM"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Schedule
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Delivery Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Default Recipients</label>
              <input
                type="text"
                placeholder="email@company.com"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Default Format</label>
              <select className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2">
                <option>PDF</option>
                <option>Excel</option>
                <option>Both</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                <span className="text-sm">Include summary in email body</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                <span className="text-sm">Send notification on failure</span>
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Upcoming Reports</h3>
          <div className="space-y-3">
            {scheduledReports
              .filter((r) => r.status === 'active')
              .sort((a, b) => a.nextRun.getTime() - b.nextRun.getTime())
              .slice(0, 4)
              .map((report) => {
                const daysUntil = Math.ceil((report.nextRun.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                return (
                  <div key={report.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-gray-500">{report.frequency}</p>
                    </div>
                    <span className="text-sm text-blue-600">
                      {daysUntil <= 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      <VirtualizedDataTable
        title="Scheduled Reports"
        data={scheduledReports}
        columns={columns as never[]}
        pageSize={15}
      />
    </div>
  )
}

export default function ReportSchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Scheduled Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage automated report delivery
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
        <ScheduleData />
      </Suspense>
    </div>
  )
}
