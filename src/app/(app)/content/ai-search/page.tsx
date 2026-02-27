import { Suspense } from 'react'
import { getContentPieces, getLowScoringContent } from '@/lib/data/content'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
export const dynamic = 'force-dynamic'

async function AISearchData() {
  const [pieces, lowScoring] = await Promise.all([
    getContentPieces({ limit: 50 }),
    getLowScoringContent(10),
  ])

  const kpis = [
    { title: 'Pages Analyzed', value: pieces.length.toString() },
    { title: 'AI-Ready', value: pieces.filter((p) => p.seoScore >= 80).length.toString() },
    { title: 'Needs Optimization', value: lowScoring.length.toString() },
    { title: 'Avg. Readability', value: Math.round(pieces.reduce((a, p) => a + p.readability, 0) / pieces.length).toString() },
  ]

  const columns = [
    { accessorKey: 'title', header: 'Page Title' },
    { accessorKey: 'url', header: 'URL' },
    {
      accessorKey: 'seoScore',
      header: 'AI-Readiness',
      cell: ({ row }: { row: { original: (typeof pieces)[0] } }) => {
        const score = row.original.seoScore
        const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor'
        const color = score >= 80 ? 'bg-green-100 text-green-700' : score >= 60 ? 'bg-blue-100 text-blue-700' : score >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-blue-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className={`rounded px-2 py-0.5 text-xs ${color}`}>{label}</span>
          </div>
        )
      },
    },
    { accessorKey: 'readability', header: 'Readability' },
    {
      accessorKey: 'issues',
      header: 'Issues',
      cell: ({ row }: { row: { original: (typeof pieces)[0] } }) => {
        const issues = row.original.issues
        return issues.length > 0 ? (
          <span className="text-sm text-red-600">{issues.length} issues</span>
        ) : (
          <span className="text-sm text-green-600">✓ Clear</span>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <KpiTileGrid tiles={kpis} />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="font-semibold text-blue-800">🤖 AI Search Optimization</h3>
        <p className="mt-1 text-sm text-blue-700">
          Ensure your content is structured and clear for AI platforms like ChatGPT, Claude, and Perplexity to reference accurately.
        </p>
      </div>

      {lowScoring.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <h3 className="font-semibold text-yellow-800">⚠️ Priority Optimizations</h3>
          <p className="mt-1 text-sm text-yellow-700">
            These {lowScoring.length} pages need improvement for better AI visibility:
          </p>
          <ul className="mt-2 space-y-1">
            {lowScoring.slice(0, 5).map((p) => (
              <li key={p.id} className="text-sm text-yellow-800">
                • {p.title} (Score: {p.seoScore})
              </li>
            ))}
          </ul>
        </div>
      )}

      <VirtualizedDataTable
        title="Content AI-Readiness Audit"
        data={pieces}
        columns={columns as never[]}
        pageSize={15}
      />
    </div>
  )
}

export default function AISearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Search Optimization</h1>
        <p className="mt-1 text-sm text-gray-500">
          Optimize content for AI-powered search engines and assistants
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
        <AISearchData />
      </Suspense>
    </div>
  )
}
