'use client'

import { useState } from 'react'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
import type { KeywordGapSummary, KeywordGapResult } from '@/lib/data/gaps'

interface Props {
  data: KeywordGapSummary
}

type FilterType = 'all' | 'missing' | 'weak' | 'strong' | 'shared' | 'untapped'

export function KeywordGapClient({ data }: Props) {
  const [filterType, setFilterType] = useState<FilterType>('all')

  const allDomains = [data.primaryDomain, ...data.competitors]

  const kpis = [
    {
      title: 'Total Keywords',
      value: formatNumber(data.totalKeywords),
    },
    {
      title: 'Missing',
      value: formatNumber(data.missingCount),
      subtitle: 'Competitors rank, you don\'t',
    },
    {
      title: 'Weak',
      value: formatNumber(data.weakCount),
      subtitle: 'Competitors rank higher',
    },
    {
      title: 'Strong',
      value: formatNumber(data.strongCount),
      subtitle: 'You rank higher',
    },
    {
      title: 'Untapped',
      value: formatNumber(data.untappedCount),
      subtitle: 'Only you rank',
    },
  ]

  // Chart data for overlap
  const overlapData = [
    { name: 'Missing', value: data.missingCount, color: '#ef4444' },
    { name: 'Weak', value: data.weakCount, color: '#f59e0b' },
    { name: 'Shared', value: data.sharedCount, color: '#6b7280' },
    { name: 'Strong', value: data.strongCount, color: '#22c55e' },
    { name: 'Untapped', value: data.untappedCount, color: '#3b82f6' },
  ]

  // Filter keywords
  const filteredKeywords = filterType === 'all' 
    ? data.keywords 
    : data.keywords.filter(k => k.type === filterType)

  // Create dynamic columns based on domains
  const columns = [
    { accessorKey: 'keyword', header: 'Keyword' },
    { accessorKey: 'volume', header: 'Volume' },
    { accessorKey: 'difficulty', header: 'KD' },
    {
      accessorKey: 'intent',
      header: 'Intent',
      cell: ({ row }: { row: { original: KeywordGapResult } }) => {
        const intent = row.original.intent
        const colors: Record<string, string> = {
          informational: 'bg-blue-100 text-blue-700',
          navigational: 'bg-purple-100 text-purple-700',
          commercial: 'bg-yellow-100 text-yellow-700',
          transactional: 'bg-green-100 text-green-700',
        }
        return (
          <span className={`rounded px-2 py-0.5 text-xs ${colors[intent] || 'bg-gray-100 text-gray-700'}`}>
            {intent.charAt(0).toUpperCase()}
          </span>
        )
      },
    },
    ...allDomains.map((domain) => ({
      accessorKey: `positions.${domain}`,
      header: domain.length > 15 ? domain.substring(0, 12) + '...' : domain,
      cell: ({ row }: { row: { original: KeywordGapResult } }) => {
        const pos = row.original.positions[domain]
        if (pos === null) return <span className="text-gray-400">—</span>
        const color = pos <= 3 ? 'text-green-600 font-semibold' : pos <= 10 ? 'text-blue-600' : 'text-gray-600'
        return <span className={color}>{pos}</span>
      },
    })),
    {
      accessorKey: 'type',
      header: 'Status',
      cell: ({ row }: { row: { original: KeywordGapResult } }) => {
        const type = row.original.type
        const styles: Record<string, string> = {
          missing: 'bg-red-100 text-red-700',
          weak: 'bg-yellow-100 text-yellow-700',
          shared: 'bg-gray-100 text-gray-700',
          strong: 'bg-green-100 text-green-700',
          untapped: 'bg-blue-100 text-blue-700',
        }
        return (
          <span className={`rounded px-2 py-0.5 text-xs capitalize ${styles[type]}`}>
            {type}
          </span>
        )
      },
    },
  ]

  const filterButtons: { label: string; value: FilterType; count: number }[] = [
    { label: 'All', value: 'all', count: data.totalKeywords },
    { label: 'Missing', value: 'missing', count: data.missingCount },
    { label: 'Weak', value: 'weak', count: data.weakCount },
    { label: 'Shared', value: 'shared', count: data.sharedCount },
    { label: 'Strong', value: 'strong', count: data.strongCount },
    { label: 'Untapped', value: 'untapped', count: data.untappedCount },
  ]

  return (
    <div className="space-y-6">
      {/* Domain comparison header */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Primary:</span>
            <span className="rounded bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
              {data.primaryDomain}
            </span>
          </div>
          <span className="text-gray-400">vs</span>
          <div className="flex flex-wrap items-center gap-2">
            {data.competitors.map((comp) => (
              <span key={comp} className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700">
                {comp}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar showExport />

      {/* KPIs */}
      <KpiTileGrid tiles={kpis} />

      {/* Overlap chart */}
      <ChartContainer
        title="Keyword Overlap Analysis"
        subtitle={`Distribution of ${formatNumber(data.totalKeywords)} keywords across domains`}
        data={overlapData}
        type="pie"
        dataKeys={[{ key: 'value', color: '#3b82f6', name: 'Keywords' }]}
        height={300}
      />

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilterType(btn.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filterType === btn.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {btn.label} ({formatNumber(btn.count)})
          </button>
        ))}
      </div>

      {/* Data table */}
      <VirtualizedDataTable
        title={`${filterType === 'all' ? 'All' : filterType.charAt(0).toUpperCase() + filterType.slice(1)} Keywords`}
        data={filteredKeywords}
        columns={columns as never[]}
        pageSize={20}
      />
    </div>
  )
}
