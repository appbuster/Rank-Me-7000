'use client'

import { useState } from 'react'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
import type { BacklinkGapSummary, BacklinkGapResult } from '@/lib/data/gaps'

interface Props {
  data: BacklinkGapSummary
}

type FilterType = 'all' | 'opportunity' | 'shared' | 'exclusive'

export function BacklinkGapClient({ data }: Props) {
  const [filterType, setFilterType] = useState<FilterType>('all')

  const allDomains = [data.primaryDomain, ...data.competitors]

  const kpis = [
    {
      title: 'Total Referring Domains',
      value: formatNumber(data.totalReferringDomains),
    },
    {
      title: 'Opportunities',
      value: formatNumber(data.opportunityCount),
      subtitle: 'Link to competitors only',
      trend: 'up' as const,
    },
    {
      title: 'Shared',
      value: formatNumber(data.sharedCount),
      subtitle: 'Link to both',
    },
    {
      title: 'Exclusive',
      value: formatNumber(data.exclusiveCount),
      subtitle: 'Link to you only',
    },
  ]

  // Chart data
  const overlapData = [
    { name: 'Opportunities', value: data.opportunityCount, color: '#22c55e' },
    { name: 'Shared', value: data.sharedCount, color: '#6b7280' },
    { name: 'Exclusive', value: data.exclusiveCount, color: '#3b82f6' },
  ]

  // Filter referring domains
  const filteredDomains =
    filterType === 'all'
      ? data.referringDomains
      : data.referringDomains.filter((d) => d.type === filterType)

  // Create dynamic columns
  const columns = [
    { 
      accessorKey: 'sourceDomain', 
      header: 'Referring Domain',
      cell: ({ row }: { row: { original: BacklinkGapResult } }) => (
        <a 
          href={`https://${row.original.sourceDomain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {row.original.sourceDomain}
        </a>
      ),
    },
    {
      accessorKey: 'sourceAuthorityScore',
      header: 'AS',
      cell: ({ row }: { row: { original: BacklinkGapResult } }) => {
        const score = row.original.sourceAuthorityScore
        const color =
          score >= 70 ? 'text-green-600 font-semibold' : score >= 40 ? 'text-blue-600' : 'text-gray-600'
        return <span className={color}>{score}</span>
      },
    },
    ...allDomains.map((domain) => ({
      accessorKey: `linksTo.${domain}`,
      header: domain.length > 12 ? domain.substring(0, 10) + '...' : domain,
      cell: ({ row }: { row: { original: BacklinkGapResult } }) => {
        const hasLink = row.original.linksTo[domain]
        return hasLink ? (
          <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">✓</span>
        ) : (
          <span className="text-gray-400">—</span>
        )
      },
    })),
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }: { row: { original: BacklinkGapResult } }) => {
        const type = row.original.type
        const styles: Record<string, { bg: string; text: string; label: string }> = {
          opportunity: { bg: 'bg-green-100', text: 'text-green-700', label: '🎯 Opportunity' },
          shared: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Shared' },
          exclusive: { bg: 'bg-blue-100', text: 'text-blue-700', label: '⭐ Exclusive' },
        }
        const style = styles[type] || styles.shared
        return (
          <span className={`rounded px-2 py-0.5 text-xs ${style.bg} ${style.text}`}>
            {style.label}
          </span>
        )
      },
    },
  ]

  const filterButtons: { label: string; value: FilterType; count: number }[] = [
    { label: 'All', value: 'all', count: data.totalReferringDomains },
    { label: '🎯 Opportunities', value: 'opportunity', count: data.opportunityCount },
    { label: 'Shared', value: 'shared', count: data.sharedCount },
    { label: '⭐ Exclusive', value: 'exclusive', count: data.exclusiveCount },
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

      {/* Opportunity highlight */}
      {data.opportunityCount > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <h3 className="font-semibold text-green-800">
            🎯 {formatNumber(data.opportunityCount)} Link Building Opportunities
          </h3>
          <p className="mt-1 text-sm text-green-700">
            These domains link to your competitors but not to you. They&apos;re more likely to link to
            you since they&apos;re already covering your niche!
          </p>
        </div>
      )}

      {/* Overlap chart */}
      <ChartContainer
        title="Backlink Overlap Analysis"
        subtitle={`Distribution of ${formatNumber(data.totalReferringDomains)} referring domains`}
        data={overlapData}
        type="pie"
        dataKeys={[{ key: 'value', color: '#3b82f6', name: 'Domains' }]}
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
        title={`${filterType === 'all' ? 'All' : filterType.charAt(0).toUpperCase() + filterType.slice(1)} Referring Domains`}
        data={filteredDomains}
        columns={columns as never[]}
        pageSize={20}
      />
    </div>
  )
}
