'use client'

import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
import type { DomainOverview, DomainRanking, DomainBacklink } from '@/lib/data/domains'
import { useState } from 'react'

interface Props {
  overview: DomainOverview
  rankings: DomainRanking[]
  backlinks: DomainBacklink[]
}

export function DomainOverviewClient({ overview, rankings, backlinks }: Props) {
  const [activeTab, setActiveTab] = useState<'rankings' | 'backlinks'>('rankings')

  const kpis = [
    {
      title: 'Authority Score',
      value: overview.authorityScore.toString(),
      change: 5.2,
      trend: 'up' as const,
    },
    {
      title: 'Organic Keywords',
      value: formatNumber(overview.organicKeywords),
      change: 12.3,
      trend: 'up' as const,
    },
    {
      title: 'Monthly Traffic',
      value: formatNumber(overview.organicTraffic),
      change: 8.1,
      trend: 'up' as const,
    },
    {
      title: 'Backlinks',
      value: formatNumber(overview.backlinksTotal),
      change: -2.4,
      trend: 'down' as const,
    },
  ]

  // Create chart data from rankings
  const positionDistribution = [
    { name: '1-3', count: rankings.filter((r) => r.position <= 3).length },
    { name: '4-10', count: rankings.filter((r) => r.position > 3 && r.position <= 10).length },
    { name: '11-20', count: rankings.filter((r) => r.position > 10 && r.position <= 20).length },
    { name: '21-50', count: rankings.filter((r) => r.position > 20 && r.position <= 50).length },
    { name: '51-100', count: rankings.filter((r) => r.position > 50).length },
  ]

  const rankingColumns = [
    { accessorKey: 'keyword', header: 'Keyword' },
    { accessorKey: 'position', header: 'Position' },
    {
      accessorKey: 'previousPosition',
      header: 'Change',
      cell: ({ row }: { row: { original: DomainRanking } }) => {
        const current = row.original.position
        const previous = row.original.previousPosition
        if (!previous) return '—'
        const change = previous - current
        if (change > 0) return <span className="text-green-600">↑ {change}</span>
        if (change < 0) return <span className="text-red-600">↓ {Math.abs(change)}</span>
        return <span className="text-gray-500">—</span>
      },
    },
    { accessorKey: 'volume', header: 'Volume' },
    { accessorKey: 'difficulty', header: 'KD' },
    {
      accessorKey: 'url',
      header: 'URL',
      cell: ({ row }: { row: { original: DomainRanking } }) => (
        <span className="max-w-xs truncate text-blue-600">{row.original.url}</span>
      ),
    },
  ]

  const backlinkColumns = [
    { accessorKey: 'sourceDomain', header: 'Source Domain' },
    { accessorKey: 'anchor', header: 'Anchor Text' },
    { accessorKey: 'authorityScore', header: 'AS' },
    {
      accessorKey: 'isDofollow',
      header: 'Type',
      cell: ({ row }: { row: { original: DomainBacklink } }) =>
        row.original.isDofollow ? (
          <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Follow</span>
        ) : (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">Nofollow</span>
        ),
    },
    {
      accessorKey: 'toxicityScore',
      header: 'Toxicity',
      cell: ({ row }: { row: { original: DomainBacklink } }) => {
        const score = row.original.toxicityScore
        const color =
          score < 30 ? 'text-green-600' : score < 60 ? 'text-yellow-600' : 'text-red-600'
        return <span className={color}>{score}</span>
      },
    },
    {
      accessorKey: 'firstSeen',
      header: 'First Seen',
      cell: ({ row }: { row: { original: DomainBacklink } }) =>
        new Date(row.original.firstSeen).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Domain header */}
      <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
          <span className="text-lg font-bold text-blue-600">
            {overview.domain.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{overview.domain}</h2>
          {overview.industry && (
            <p className="text-sm text-gray-500">Industry: {overview.industry}</p>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar showExport />

      {/* KPIs */}
      <KpiTileGrid tiles={kpis} />

      {/* Position distribution chart */}
      <ChartContainer
        title="Ranking Distribution"
        subtitle={`Position distribution for ${rankings.length} keywords`}
        data={positionDistribution}
        type="bar"
        dataKeys={[{ key: 'count', color: '#3b82f6', name: 'Keywords' }]}
        height={300}
      />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-4">
          <button
            onClick={() => setActiveTab('rankings')}
            className={`border-b-2 pb-2 text-sm font-medium ${
              activeTab === 'rankings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Organic Rankings ({rankings.length})
          </button>
          <button
            onClick={() => setActiveTab('backlinks')}
            className={`border-b-2 pb-2 text-sm font-medium ${
              activeTab === 'backlinks'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Backlinks ({backlinks.length})
          </button>
        </nav>
      </div>

      {/* Data table */}
      {activeTab === 'rankings' ? (
        <VirtualizedDataTable
          title="Organic Rankings"
          data={rankings}
          columns={rankingColumns as never[]}
          pageSize={20}
        />
      ) : (
        <VirtualizedDataTable
          title="Backlinks"
          data={backlinks}
          columns={backlinkColumns as never[]}
          pageSize={20}
        />
      )}
    </div>
  )
}
