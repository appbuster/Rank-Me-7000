'use client'

import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
import type { ProjectTrackingSummary, TrackedKeywordSummary } from '@/lib/data/tracking'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'

interface Props {
  projectName: string
  domain: string
  summary: ProjectTrackingSummary
  keywords: TrackedKeywordSummary[]
  history: { date: string; avgPosition: number; totalTraffic: number }[]
}

export function PositionTrackingClient({ projectName, domain, summary, keywords, history }: Props) {
  const kpis = [
    {
      title: 'Tracked Keywords',
      value: formatNumber(summary.totalKeywords),
    },
    {
      title: 'Average Position',
      value: summary.avgPosition.toFixed(1),
      change: -1.2,
      trend: 'up' as const,
    },
    {
      title: 'Top 3 Positions',
      value: formatNumber(summary.topPositions),
      change: 5,
      trend: 'up' as const,
    },
    {
      title: 'First Page (1-10)',
      value: formatNumber(summary.firstPage),
      change: 3,
      trend: 'up' as const,
    },
  ]

  // Transform history for chart
  const chartData = history.map((h) => ({
    name: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    position: h.avgPosition,
    traffic: Math.round(h.totalTraffic / 1000), // Convert to K
  }))

  const columns = [
    { accessorKey: 'keyword', header: 'Keyword' },
    {
      accessorKey: 'currentPosition',
      header: 'Position',
      cell: ({ row }: { row: { original: TrackedKeywordSummary } }) => {
        const pos = row.original.currentPosition
        return pos ? (
          <span className="font-medium">{pos}</span>
        ) : (
          <span className="text-gray-400">—</span>
        )
      },
    },
    {
      accessorKey: 'trend',
      header: 'Change',
      cell: ({ row }: { row: { original: TrackedKeywordSummary } }) => {
        const { currentPosition, previousPosition, trend } = row.original
        if (!currentPosition || !previousPosition) {
          return <span className="text-gray-400">—</span>
        }
        const change = previousPosition - currentPosition
        
        if (trend === 'up') {
          return (
            <span className="flex items-center gap-1 text-green-600">
              <ArrowUp className="h-4 w-4" /> {Math.abs(change)}
            </span>
          )
        }
        if (trend === 'down') {
          return (
            <span className="flex items-center gap-1 text-red-600">
              <ArrowDown className="h-4 w-4" /> {Math.abs(change)}
            </span>
          )
        }
        return (
          <span className="flex items-center gap-1 text-gray-500">
            <Minus className="h-4 w-4" />
          </span>
        )
      },
    },
    {
      accessorKey: 'bestPosition',
      header: 'Best',
      cell: ({ row }: { row: { original: TrackedKeywordSummary } }) => (
        <span className="text-green-600">{row.original.bestPosition ?? '—'}</span>
      ),
    },
    {
      accessorKey: 'volume',
      header: 'Volume',
      cell: ({ row }: { row: { original: TrackedKeywordSummary } }) =>
        formatNumber(row.original.volume),
    },
    {
      accessorKey: 'estimatedTraffic',
      header: 'Est. Traffic',
      cell: ({ row }: { row: { original: TrackedKeywordSummary } }) =>
        row.original.estimatedTraffic ? formatNumber(row.original.estimatedTraffic) : '—',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Project header */}
      <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
          <span className="text-lg font-bold text-purple-600">📊</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{projectName}</h2>
          <p className="text-sm text-gray-500">Tracking {domain}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
            <ArrowUp className="h-3 w-3" /> {summary.improved} improved
          </div>
          <div className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
            <ArrowDown className="h-3 w-3" /> {summary.declined} declined
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar
        filters={[
          {
            id: 'timeframe',
            label: 'Timeframe',
            type: 'select',
            options: [
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
              { value: '90d', label: 'Last 90 days' },
            ],
            defaultValue: '30d',
          },
        ]}
        showExport
      />

      {/* KPIs */}
      <KpiTileGrid tiles={kpis} />

      {/* Trend chart */}
      <ChartContainer
        title="Ranking Trend"
        subtitle="Average position over time (lower is better)"
        data={chartData}
        type="area"
        dataKeys={[
          { key: 'position', color: '#8b5cf6', name: 'Avg Position' },
        ]}
        height={300}
      />

      {/* Traffic trend */}
      <ChartContainer
        title="Estimated Traffic"
        subtitle="Daily estimated organic traffic (in thousands)"
        data={chartData}
        type="line"
        dataKeys={[
          { key: 'traffic', color: '#10b981', name: 'Traffic (K)' },
        ]}
        height={250}
      />

      {/* Keywords table */}
      <VirtualizedDataTable
        title={`Tracked Keywords (${keywords.length})`}
        data={keywords}
        columns={columns as never[]}
        pageSize={20}
      />
    </div>
  )
}
