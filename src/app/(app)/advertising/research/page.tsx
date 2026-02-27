import { Suspense } from 'react'
import { getPpcKeywords } from '@/lib/data/advertising'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber, formatCurrency } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function PpcResearchData() {
  const keywords = await getPpcKeywords({ limit: 100 })

  const avgCpc = keywords.reduce((a, k) => a + k.cpc, 0) / keywords.length
  const avgVolume = keywords.reduce((a, k) => a + k.volume, 0) / keywords.length
  const lowCompetition = keywords.filter((k) => k.competition < 0.3).length

  const kpis = [
    { title: 'Keywords Found', value: formatNumber(keywords.length) },
    { title: 'Avg. CPC', value: formatCurrency(avgCpc) },
    { title: 'Avg. Volume', value: formatNumber(Math.round(avgVolume)) },
    { title: 'Low Competition', value: lowCompetition.toString() },
  ]

  // Competition distribution data
  const competitionData = [
    { name: 'Low (<30%)', count: keywords.filter((k) => k.competition < 0.3).length },
    { name: 'Medium (30-70%)', count: keywords.filter((k) => k.competition >= 0.3 && k.competition < 0.7).length },
    { name: 'High (>70%)', count: keywords.filter((k) => k.competition >= 0.7).length },
  ]

  const columns = [
    { accessorKey: 'keyword', header: 'Keyword' },
    {
      accessorKey: 'volume',
      header: 'Volume',
      cell: ({ row }: { row: { original: (typeof keywords)[0] } }) => formatNumber(row.original.volume),
    },
    {
      accessorKey: 'cpc',
      header: 'CPC',
      cell: ({ row }: { row: { original: (typeof keywords)[0] } }) => (
        <span className="font-medium">{formatCurrency(row.original.cpc)}</span>
      ),
    },
    {
      accessorKey: 'competition',
      header: 'Competition',
      cell: ({ row }: { row: { original: (typeof keywords)[0] } }) => {
        const comp = row.original.competition
        const color = comp < 0.3 ? 'bg-green-100 text-green-700' : comp < 0.7 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
        const label = comp < 0.3 ? 'Low' : comp < 0.7 ? 'Medium' : 'High'
        return (
          <span className={`rounded px-2 py-0.5 text-xs ${color}`}>
            {label} ({Math.round(comp * 100)}%)
          </span>
        )
      },
    },
    {
      accessorKey: 'competitorAds',
      header: 'Competitor Ads',
      cell: ({ row }: { row: { original: (typeof keywords)[0] } }) => row.original.competitorAds,
    },
    {
      accessorKey: 'lastSeen',
      header: 'Last Seen',
      cell: ({ row }: { row: { original: (typeof keywords)[0] } }) =>
        new Date(row.original.lastSeen).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">PPC Keyword Research</h3>
        <form className="flex gap-4">
          <input
            type="text"
            placeholder="Enter seed keyword..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <select className="rounded-lg border border-gray-300 px-4 py-2">
            <option>All match types</option>
            <option>Broad match</option>
            <option>Phrase match</option>
            <option>Exact match</option>
          </select>
          <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            Research
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer
          title="Competition Distribution"
          data={competitionData}
          type="pie"
          dataKeys={[{ key: 'count', color: '#3b82f6', name: 'Keywords' }]}
          height={250}
        />
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Keyword Opportunities</h3>
          <div className="space-y-3">
            {keywords
              .filter((k) => k.competition < 0.3 && k.volume > 500)
              .slice(0, 5)
              .map((kw) => (
                <div key={kw.id} className="flex items-center justify-between rounded-lg border border-green-100 bg-green-50 p-3">
                  <div>
                    <p className="font-medium">{kw.keyword}</p>
                    <p className="text-sm text-gray-500">
                      {formatNumber(kw.volume)} vol • {formatCurrency(kw.cpc)} CPC
                    </p>
                  </div>
                  <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                    Low competition
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <VirtualizedDataTable
        title="PPC Keywords"
        data={keywords}
        columns={columns as never[]}
        pageSize={20}
      />
    </div>
  )
}

export default function PpcResearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">PPC Keyword Research</h1>
        <p className="mt-1 text-sm text-gray-500">
          Find profitable keywords for your paid advertising campaigns
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
        <PpcResearchData />
      </Suspense>
    </div>
  )
}
