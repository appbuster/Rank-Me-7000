import { Suspense } from 'react'
import { getAIPrCampaigns } from '@/lib/data/ai'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function MediaDatabaseData() {
  await getAIPrCampaigns({ limit: 10 })

  // Mock media outlets data
  const mediaOutlets = [
    { id: '1', name: 'TechCrunch', type: 'Online Publication', domain: 'techcrunch.com', da: 93, monthlyVisits: 15000000, categories: ['Technology', 'Startups'], journalists: 45 },
    { id: '2', name: 'Forbes', type: 'Magazine', domain: 'forbes.com', da: 95, monthlyVisits: 85000000, categories: ['Business', 'Finance', 'Technology'], journalists: 120 },
    { id: '3', name: 'VentureBeat', type: 'Online Publication', domain: 'venturebeat.com', da: 91, monthlyVisits: 8500000, categories: ['AI', 'Technology'], journalists: 25 },
    { id: '4', name: 'The Verge', type: 'Online Publication', domain: 'theverge.com', da: 92, monthlyVisits: 25000000, categories: ['Technology', 'Consumer Electronics'], journalists: 55 },
    { id: '5', name: 'Wired', type: 'Magazine', domain: 'wired.com', da: 93, monthlyVisits: 18000000, categories: ['Technology', 'Culture'], journalists: 40 },
    { id: '6', name: 'Business Insider', type: 'Online Publication', domain: 'businessinsider.com', da: 94, monthlyVisits: 65000000, categories: ['Business', 'Finance', 'Tech'], journalists: 80 },
    { id: '7', name: 'Engadget', type: 'Online Publication', domain: 'engadget.com', da: 90, monthlyVisits: 12000000, categories: ['Technology', 'Gadgets'], journalists: 30 },
    { id: '8', name: 'CNET', type: 'Online Publication', domain: 'cnet.com', da: 93, monthlyVisits: 35000000, categories: ['Technology', 'Reviews'], journalists: 60 },
  ]

  const kpis = [
    { title: 'Media Outlets', value: '2,847' },
    { title: 'Journalists', value: '12,453' },
    { title: 'Avg. DA', value: '78' },
    { title: 'Categories', value: '45' },
  ]

  const categoryData = [
    { name: 'Technology', count: 850 },
    { name: 'Business', count: 620 },
    { name: 'Marketing', count: 480 },
    { name: 'Finance', count: 350 },
    { name: 'Lifestyle', count: 280 },
    { name: 'News', count: 267 },
  ]

  const columns = [
    {
      accessorKey: 'name',
      header: 'Publication',
      cell: ({ row }: { row: { original: (typeof mediaOutlets)[0] } }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-gray-500">{row.original.domain}</p>
        </div>
      ),
    },
    { accessorKey: 'type', header: 'Type' },
    {
      accessorKey: 'da',
      header: 'Domain Authority',
      cell: ({ row }: { row: { original: (typeof mediaOutlets)[0] } }) => (
        <span className="font-medium text-green-600">{row.original.da}</span>
      ),
    },
    {
      accessorKey: 'monthlyVisits',
      header: 'Monthly Visits',
      cell: ({ row }: { row: { original: (typeof mediaOutlets)[0] } }) => formatNumber(row.original.monthlyVisits),
    },
    {
      accessorKey: 'categories',
      header: 'Categories',
      cell: ({ row }: { row: { original: (typeof mediaOutlets)[0] } }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.categories.slice(0, 2).map((cat) => (
            <span key={cat} className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
              {cat}
            </span>
          ))}
          {row.original.categories.length > 2 && (
            <span className="text-xs text-gray-500">+{row.original.categories.length - 2}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'journalists',
      header: 'Journalists',
      cell: ({ row }: { row: { original: (typeof mediaOutlets)[0] } }) => row.original.journalists,
    },
    {
      accessorKey: 'actions',
      header: '',
      cell: () => (
        <button className="rounded border border-blue-600 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50">
          View Contacts
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Find Media Outlets</h3>
        <form className="flex gap-4">
          <input
            type="text"
            placeholder="Search publications, journalists, topics..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <select className="rounded-lg border border-gray-300 px-4 py-2">
            <option>All Categories</option>
            <option>Technology</option>
            <option>Business</option>
            <option>Marketing</option>
            <option>Finance</option>
          </select>
          <select className="rounded-lg border border-gray-300 px-4 py-2">
            <option>Any DA</option>
            <option>DA 80+</option>
            <option>DA 70+</option>
            <option>DA 60+</option>
          </select>
          <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer
          title="Media Outlets by Category"
          data={categoryData}
          type="bar"
          dataKeys={[{ key: 'count', color: '#3b82f6', name: 'Outlets' }]}
          height={300}
        />
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Saved Lists</h3>
          <div className="space-y-3">
            {[
              { name: 'Tech Journalists', count: 45, lastUsed: '2 days ago' },
              { name: 'Business Publications', count: 28, lastUsed: '1 week ago' },
              { name: 'Industry Analysts', count: 15, lastUsed: '3 days ago' },
            ].map((list) => (
              <div key={list.name} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div>
                  <p className="font-medium">{list.name}</p>
                  <p className="text-sm text-gray-500">{list.count} contacts • Used {list.lastUsed}</p>
                </div>
                <button className="text-blue-600 hover:underline">Use</button>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">
            + Create New List
          </button>
        </div>
      </div>

      <VirtualizedDataTable
        title="Media Outlets Database"
        data={mediaOutlets}
        columns={columns as never[]}
        pageSize={15}
      />
    </div>
  )
}

export default function MediaDatabasePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Media Database</h1>
        <p className="mt-1 text-sm text-gray-500">
          Find and connect with journalists and publications
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
        <MediaDatabaseData />
      </Suspense>
    </div>
  )
}
