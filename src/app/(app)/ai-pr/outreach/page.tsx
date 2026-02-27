import { Suspense } from 'react'
import { getAIPrStats } from '@/lib/data/ai'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { FilterBar } from '@/components/ui/FilterBar'
export const dynamic = 'force-dynamic'

async function OutreachData() {
  const stats = await getAIPrStats()

  // Mock outreach data
  const outreachEmails = [
    { id: '1', recipient: 'john@techcrunch.com', name: 'John Smith', publication: 'TechCrunch', subject: 'Story Pitch: AI Revolution in SEO', status: 'opened', sentAt: new Date('2024-02-20'), openedAt: new Date('2024-02-20') },
    { id: '2', recipient: 'sarah@forbes.com', name: 'Sarah Johnson', publication: 'Forbes', subject: 'Exclusive: New Market Research', status: 'replied', sentAt: new Date('2024-02-19'), openedAt: new Date('2024-02-19'), repliedAt: new Date('2024-02-20') },
    { id: '3', recipient: 'mike@venturebeat.com', name: 'Mike Brown', publication: 'VentureBeat', subject: 'Expert Commentary Opportunity', status: 'sent', sentAt: new Date('2024-02-21') },
    { id: '4', recipient: 'lisa@theverge.com', name: 'Lisa Chen', publication: 'The Verge', subject: 'Product Launch Announcement', status: 'bounced', sentAt: new Date('2024-02-18') },
    { id: '5', recipient: 'david@wired.com', name: 'David Miller', publication: 'Wired', subject: 'Trend Story: Future of Marketing', status: 'clicked', sentAt: new Date('2024-02-17'), openedAt: new Date('2024-02-17') },
  ]

  const kpis = [
    { title: 'Emails Sent', value: stats.totalSent.toString() },
    { title: 'Open Rate', value: `${stats.avgOpenRate}%`, trend: 'up' as const },
    { title: 'Reply Rate', value: `${stats.avgReplyRate}%` },
    { title: 'Placements', value: stats.totalPlacements.toString(), trend: 'up' as const },
  ]

  // Mock funnel data
  const funnelData = [
    { name: 'Sent', value: stats.totalSent || 100 },
    { name: 'Opened', value: Math.round((stats.totalSent || 100) * (stats.avgOpenRate / 100)) },
    { name: 'Clicked', value: Math.round((stats.totalSent || 100) * 0.15) },
    { name: 'Replied', value: Math.round((stats.totalSent || 100) * (stats.avgReplyRate / 100)) },
    { name: 'Placed', value: stats.totalPlacements || 5 },
  ]

  const columns = [
    {
      accessorKey: 'recipient',
      header: 'Recipient',
      cell: ({ row }: { row: { original: (typeof outreachEmails)[0] } }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-gray-500">{row.original.recipient}</p>
        </div>
      ),
    },
    { accessorKey: 'publication', header: 'Publication' },
    {
      accessorKey: 'subject',
      header: 'Subject',
      cell: ({ row }: { row: { original: (typeof outreachEmails)[0] } }) => (
        <span className="max-w-xs truncate text-sm">{row.original.subject}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: { original: (typeof outreachEmails)[0] } }) => {
        const status = row.original.status
        const colors: Record<string, string> = {
          sent: 'bg-gray-100 text-gray-700',
          opened: 'bg-blue-100 text-blue-700',
          clicked: 'bg-purple-100 text-purple-700',
          replied: 'bg-green-100 text-green-700',
          bounced: 'bg-red-100 text-red-700',
        }
        const icons: Record<string, string> = {
          sent: '📤',
          opened: '👁️',
          clicked: '🖱️',
          replied: '💬',
          bounced: '❌',
        }
        return (
          <span className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs ${colors[status]}`}>
            {icons[status]} {status}
          </span>
        )
      },
    },
    {
      accessorKey: 'sentAt',
      header: 'Sent',
      cell: ({ row }: { row: { original: (typeof outreachEmails)[0] } }) =>
        new Date(row.original.sentAt).toLocaleDateString(),
    },
    {
      accessorKey: 'actions',
      header: '',
      cell: ({ row }: { row: { original: (typeof outreachEmails)[0] } }) => (
        <div className="flex gap-2">
          {row.original.status !== 'replied' && (
            <button className="rounded border border-blue-600 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50">
              Follow Up
            </button>
          )}
          <button className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50">
            View
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Compose New Pitch</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Recipients</label>
              <input
                type="text"
                placeholder="Select from media database or enter email..."
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject Line</label>
              <input
                type="text"
                placeholder="Compelling subject line..."
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                rows={6}
                placeholder="Write your pitch or use AI to generate..."
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Send Pitch
              </button>
              <button type="button" className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
                ✨ AI Generate
              </button>
            </div>
          </form>
        </div>

        <ChartContainer
          title="Outreach Funnel"
          data={funnelData}
          type="bar"
          dataKeys={[{ key: 'value', color: '#3b82f6', name: 'Count' }]}
          height={350}
        />
      </div>

      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <h3 className="font-semibold text-green-800">✨ AI Pitch Assistant</h3>
        <p className="mt-1 text-sm text-green-700">
          Our AI can personalize your pitch for each journalist based on their beat, recent articles, and interests.
          This increases reply rates by an average of 3x.
        </p>
      </div>

      <VirtualizedDataTable
        title="Recent Outreach"
        data={outreachEmails}
        columns={columns as never[]}
        pageSize={15}
      />
    </div>
  )
}

export default function OutreachPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Outreach</h1>
        <p className="mt-1 text-sm text-gray-500">
          Send and track PR pitches to journalists
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
        <OutreachData />
      </Suspense>
    </div>
  )
}
