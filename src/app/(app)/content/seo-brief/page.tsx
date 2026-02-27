import { Suspense } from 'react'
import { getContentPieces, getContentStats } from '@/lib/data/content'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function SeoBriefData() {
  const [pieces, stats] = await Promise.all([getContentPieces({ limit: 50 }), getContentStats()])

  const kpis = [
    { title: 'Total Briefs', value: formatNumber(stats.totalPieces) },
    { title: 'Avg. SEO Score', value: stats.averageSeoScore.toString() },
    { title: 'In Progress', value: stats.byStatus.find((s) => s.status === 'in-progress')?.count.toString() || '0' },
    { title: 'Completed', value: stats.byStatus.find((s) => s.status === 'published')?.count.toString() || '0' },
  ]

  const columns = [
    { accessorKey: 'title', header: 'Content Title' },
    { accessorKey: 'targetKeyword', header: 'Target Keyword' },
    {
      accessorKey: 'seoScore',
      header: 'SEO Score',
      cell: ({ row }: { row: { original: (typeof pieces)[0] } }) => {
        const score = row.original.seoScore
        const color = score >= 80 ? 'bg-green-100 text-green-700' : score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
        return <span className={`rounded px-2 py-0.5 text-xs ${color}`}>{score}</span>
      },
    },
    { accessorKey: 'wordCount', header: 'Word Count' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: { original: (typeof pieces)[0] } }) => {
        const status = row.original.status
        const colors: Record<string, string> = {
          draft: 'bg-gray-100 text-gray-700',
          'in-progress': 'bg-blue-100 text-blue-700',
          review: 'bg-yellow-100 text-yellow-700',
          published: 'bg-green-100 text-green-700',
          'needs-update': 'bg-red-100 text-red-700',
        }
        return (
          <span className={`rounded px-2 py-0.5 text-xs capitalize ${colors[status] || 'bg-gray-100'}`}>
            {status}
          </span>
        )
      },
    },
    {
      accessorKey: 'lastUpdated',
      header: 'Last Updated',
      cell: ({ row }: { row: { original: (typeof pieces)[0] } }) =>
        new Date(row.original.lastUpdated).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Create New SEO Brief</h3>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
                Target Keyword
              </label>
              <input
                type="text"
                id="keyword"
                placeholder="e.g., email marketing software"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="intent" className="block text-sm font-medium text-gray-700">
                Search Intent
              </label>
              <select id="intent" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2">
                <option>Informational</option>
                <option>Commercial</option>
                <option>Transactional</option>
                <option>Navigational</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Generate SEO Brief
          </button>
        </form>
      </div>

      <VirtualizedDataTable
        title="Content Briefs"
        data={pieces}
        columns={columns as never[]}
        pageSize={15}
      />
    </div>
  )
}

export default function SeoBriefPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SEO Content Brief</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create comprehensive content briefs optimized for search
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
        <SeoBriefData />
      </Suspense>
    </div>
  )
}
