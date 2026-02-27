import { Suspense } from 'react'
import { getContentPieces } from '@/lib/data/content'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
export const dynamic = 'force-dynamic'

async function RepurposingData() {
  const pieces = await getContentPieces({ limit: 50 })

  // Filter for high-performing content suitable for repurposing
  const repurposeCandidates = pieces
    .filter((p) => p.seoScore >= 60 && p.wordCount > 1000)
    .sort((a, b) => b.seoScore - a.seoScore)

  const kpis = [
    { title: 'Repurposing Candidates', value: repurposeCandidates.length.toString() },
    { title: 'High-Value Content', value: pieces.filter((p) => p.seoScore >= 80).length.toString() },
    { title: 'Avg. Word Count', value: Math.round(repurposeCandidates.reduce((a, p) => a + p.wordCount, 0) / repurposeCandidates.length || 0).toLocaleString() },
    { title: 'Content Types', value: '6' },
  ]

  const repurposeFormats = [
    { icon: '📹', name: 'Video Script', desc: 'Convert to YouTube or social video' },
    { icon: '🎙️', name: 'Podcast Episode', desc: 'Transform into audio content' },
    { icon: '📊', name: 'Infographic', desc: 'Visual summary of key points' },
    { icon: '📧', name: 'Email Series', desc: 'Break into email newsletter' },
    { icon: '🐦', name: 'Social Posts', desc: 'Extract quotes and snippets' },
    { icon: '📑', name: 'Slide Deck', desc: 'Create presentation slides' },
  ]

  const columns = [
    { accessorKey: 'title', header: 'Content Title' },
    { accessorKey: 'wordCount', header: 'Words' },
    {
      accessorKey: 'seoScore',
      header: 'Performance',
      cell: ({ row }: { row: { original: (typeof pieces)[0] } }) => {
        const score = row.original.seoScore
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-12 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full bg-green-500" style={{ width: `${score}%` }} />
            </div>
            <span className="text-sm">{score}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'repurpose',
      header: 'Best Formats',
      cell: () => (
        <div className="flex gap-1">
          {['📹', '📊', '🐦'].map((icon, i) => (
            <span key={i} title="Recommended format" className="cursor-help">
              {icon}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'actions',
      header: '',
      cell: () => (
        <button className="rounded border border-blue-600 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50">
          Repurpose
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <KpiTileGrid tiles={kpis} />

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Repurposing Formats</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {repurposeFormats.map((format) => (
            <div
              key={format.name}
              className="cursor-pointer rounded-lg border border-gray-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <span className="text-2xl">{format.icon}</span>
              <p className="mt-2 font-medium">{format.name}</p>
              <p className="text-sm text-gray-500">{format.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <VirtualizedDataTable
        title="Content Ready for Repurposing"
        data={repurposeCandidates}
        columns={columns as never[]}
        pageSize={15}
      />
    </div>
  )
}

export default function RepurposingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Repurposing</h1>
        <p className="mt-1 text-sm text-gray-500">
          Transform existing content into multiple formats for maximum reach
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
        <RepurposingData />
      </Suspense>
    </div>
  )
}
