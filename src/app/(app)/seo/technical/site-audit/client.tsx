'use client'

import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
import type { AuditSummary, AuditUrlWithIssues, IssueTypeCount } from '@/lib/data/audit'
import { useState } from 'react'
import { AlertCircle, AlertTriangle, Info } from 'lucide-react'

interface Props {
  projectName: string
  domain: string
  summary: AuditSummary
  urls: AuditUrlWithIssues[]
  issues: IssueTypeCount[]
}

export function SiteAuditClient({ projectName, domain, summary, urls, issues }: Props) {
  const [activeTab, setActiveTab] = useState<'urls' | 'issues'>('issues')

  // Calculate health score (0-100)
  const healthScore = Math.round(
    100 - (summary.errors * 3 + summary.warnings * 1.5 + summary.notices * 0.5) / summary.totalUrls * 10
  )

  const kpis = [
    {
      title: 'Site Health',
      value: `${Math.max(0, Math.min(100, healthScore))}%`,
      trend: healthScore > 70 ? ('up' as const) : ('down' as const),
    },
    {
      title: 'Pages Crawled',
      value: formatNumber(summary.totalUrls),
    },
    {
      title: 'Healthy Pages',
      value: formatNumber(summary.healthy),
      trend: 'up' as const,
    },
    {
      title: 'Avg Load Time',
      value: `${(summary.avgLoadTime / 1000).toFixed(2)}s`,
      trend: summary.avgLoadTime < 2000 ? ('up' as const) : ('down' as const),
    },
  ]

  // Issues by severity
  const issueBySeverity = [
    { name: 'Errors', count: summary.errors, color: '#ef4444' },
    { name: 'Warnings', count: summary.warnings, color: '#f59e0b' },
    { name: 'Notices', count: summary.notices, color: '#6b7280' },
  ]

  // Issues by category
  const issuesByCategory = issues.reduce((acc, issue) => {
    const existing = acc.find((i) => i.name === issue.category)
    if (existing) {
      existing.count += issue.count
    } else {
      acc.push({ name: issue.category, count: issue.count })
    }
    return acc
  }, [] as { name: string; count: number }[])

  const urlColumns = [
    {
      accessorKey: 'url',
      header: 'URL',
      cell: ({ row }: { row: { original: AuditUrlWithIssues } }) => (
        <span className="max-w-md truncate text-blue-600">{row.original.url}</span>
      ),
    },
    {
      accessorKey: 'statusCode',
      header: 'Status',
      cell: ({ row }: { row: { original: AuditUrlWithIssues } }) => {
        const code = row.original.statusCode
        const color = code === 200 ? 'bg-green-100 text-green-700' :
          code && code >= 300 && code < 400 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
        return (
          <span className={`rounded px-2 py-0.5 text-xs ${color}`}>
            {code ?? '—'}
          </span>
        )
      },
    },
    {
      accessorKey: 'loadTimeMs',
      header: 'Load Time',
      cell: ({ row }: { row: { original: AuditUrlWithIssues } }) => {
        const time = row.original.loadTimeMs
        if (!time) return '—'
        const color = time < 1000 ? 'text-green-600' : time < 3000 ? 'text-yellow-600' : 'text-red-600'
        return <span className={color}>{(time / 1000).toFixed(2)}s</span>
      },
    },
    { accessorKey: 'wordCount', header: 'Words' },
    {
      accessorKey: 'issueCount',
      header: 'Issues',
      cell: ({ row }: { row: { original: AuditUrlWithIssues } }) => {
        const count = row.original.issueCount
        if (count === 0) return <span className="text-green-600">✓</span>
        return <span className="text-red-600">{count}</span>
      },
    },
  ]

  const issueColumns = [
    {
      accessorKey: 'severity',
      header: '',
      cell: ({ row }: { row: { original: IssueTypeCount } }) => {
        const severity = row.original.severity
        if (severity === 'error') return <AlertCircle className="h-4 w-4 text-red-500" />
        if (severity === 'warning') return <AlertTriangle className="h-4 w-4 text-yellow-500" />
        return <Info className="h-4 w-4 text-gray-400" />
      },
    },
    { accessorKey: 'name', header: 'Issue' },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'count', header: 'Affected Pages' },
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }: { row: { original: IssueTypeCount } }) => (
        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{row.original.code}</code>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Project header */}
      <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
          style={{
            background: `conic-gradient(${healthScore > 70 ? '#10b981' : healthScore > 40 ? '#f59e0b' : '#ef4444'} ${healthScore}%, #e5e7eb ${healthScore}%)`,
          }}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-900">
            {healthScore}
          </span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{projectName}</h2>
          <p className="text-sm text-gray-500">{domain}</p>
        </div>
        <div className="ml-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-red-600">{summary.errors}</p>
            <p className="text-xs text-gray-500">Errors</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">{summary.warnings}</p>
            <p className="text-xs text-gray-500">Warnings</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-600">{summary.notices}</p>
            <p className="text-xs text-gray-500">Notices</p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar showExport />

      {/* KPIs */}
      <KpiTileGrid tiles={kpis} />

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <ChartContainer
          title="Issues by Severity"
          data={issueBySeverity}
          type="bar"
          dataKeys={[{ key: 'count', color: '#6366f1', name: 'Issues' }]}
          height={250}
        />
        <ChartContainer
          title="Issues by Category"
          data={issuesByCategory}
          type="bar"
          dataKeys={[{ key: 'count', color: '#8b5cf6', name: 'Issues' }]}
          height={250}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-4">
          <button
            onClick={() => setActiveTab('issues')}
            className={`border-b-2 pb-2 text-sm font-medium ${
              activeTab === 'issues'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            All Issues ({issues.length} types)
          </button>
          <button
            onClick={() => setActiveTab('urls')}
            className={`border-b-2 pb-2 text-sm font-medium ${
              activeTab === 'urls'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Crawled Pages ({urls.length})
          </button>
        </nav>
      </div>

      {/* Data table */}
      {activeTab === 'issues' ? (
        <VirtualizedDataTable
          title="Issues"
          data={issues}
          columns={issueColumns as never[]}
          pageSize={15}
        />
      ) : (
        <VirtualizedDataTable
          title="Crawled Pages"
          data={urls}
          columns={urlColumns as never[]}
          pageSize={20}
        />
      )}
    </div>
  )
}
