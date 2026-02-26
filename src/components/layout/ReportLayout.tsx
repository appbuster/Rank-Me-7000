'use client'

import { cn } from '@/lib/utils'
import { Breadcrumbs } from './Breadcrumbs'
import { KpiTileGrid } from '../ui/KpiTileGrid'
import { KpiTileProps } from '../ui/KpiTile'
import { ChartContainer, ChartDataPoint } from '../ui/ChartContainer'
import { VirtualizedDataTable } from '../ui/VirtualizedDataTable'
import { FilterBar, FilterOption } from '../ui/FilterBar'
import { ColumnDef } from '@tanstack/react-table'

interface ReportLayoutProps {
  title: string
  description?: string
  kpis?: KpiTileProps[]
  chartData?: ChartDataPoint[]
  chartTitle?: string
  chartType?: 'line' | 'bar' | 'area'
  chartDataKeys?: { key: string; color: string; name?: string }[]
  tableData?: Record<string, unknown>[]
  tableColumns?: ColumnDef<Record<string, unknown>>[]
  tableTitle?: string
  filters?: FilterOption[]
  children?: React.ReactNode
  className?: string
}

// Default dummy KPIs for skeleton
const defaultKpis: KpiTileProps[] = [
  { title: 'Total Keywords', value: '12,847', change: 12.5, trend: 'up' },
  { title: 'Avg Position', value: '14.3', change: -2.1, trend: 'up' },
  { title: 'Traffic Estimate', value: '847K', change: 8.7, trend: 'up' },
  { title: 'Visibility Score', value: '68%', change: -1.2, trend: 'down' },
]

// Default dummy chart data
const defaultChartData: ChartDataPoint[] = [
  { name: 'Jan', value: 4000, prev: 2400 },
  { name: 'Feb', value: 3000, prev: 1398 },
  { name: 'Mar', value: 2000, prev: 9800 },
  { name: 'Apr', value: 2780, prev: 3908 },
  { name: 'May', value: 1890, prev: 4800 },
  { name: 'Jun', value: 2390, prev: 3800 },
  { name: 'Jul', value: 3490, prev: 4300 },
]

const defaultChartDataKeys = [
  { key: 'value', color: '#3b82f6', name: 'Current' },
  { key: 'prev', color: '#94a3b8', name: 'Previous' },
]

// Default dummy table data
const defaultTableData = [
  { id: 1, keyword: 'seo tools', position: 3, volume: 12400, traffic: 2480, difficulty: 67 },
  { id: 2, keyword: 'keyword research', position: 7, volume: 8100, traffic: 810, difficulty: 72 },
  { id: 3, keyword: 'backlink checker', position: 12, volume: 6600, traffic: 330, difficulty: 58 },
  { id: 4, keyword: 'rank tracker', position: 5, volume: 5400, traffic: 810, difficulty: 61 },
  { id: 5, keyword: 'site audit', position: 8, volume: 4900, traffic: 490, difficulty: 55 },
  { id: 6, keyword: 'competitor analysis', position: 15, volume: 3700, traffic: 148, difficulty: 69 },
  { id: 7, keyword: 'domain authority', position: 4, volume: 3200, traffic: 560, difficulty: 48 },
  { id: 8, keyword: 'serp analysis', position: 11, volume: 2800, traffic: 168, difficulty: 52 },
  { id: 9, keyword: 'link building', position: 6, volume: 2500, traffic: 375, difficulty: 64 },
  { id: 10, keyword: 'content optimization', position: 9, volume: 2100, traffic: 189, difficulty: 57 },
]

const defaultTableColumns: ColumnDef<Record<string, unknown>>[] = [
  { accessorKey: 'keyword', header: 'Keyword' },
  { accessorKey: 'position', header: 'Position' },
  { accessorKey: 'volume', header: 'Volume' },
  { accessorKey: 'traffic', header: 'Traffic' },
  { accessorKey: 'difficulty', header: 'Difficulty' },
]

const defaultFilters: FilterOption[] = [
  {
    id: 'timeframe',
    label: 'Timeframe',
    type: 'select',
    options: [
      { value: '7d', label: 'Last 7 days' },
      { value: '30d', label: 'Last 30 days' },
      { value: '90d', label: 'Last 90 days' },
      { value: '1y', label: 'Last year' },
    ],
    defaultValue: '30d',
  },
  {
    id: 'country',
    label: 'Country',
    type: 'select',
    options: [
      { value: 'all', label: 'All Countries' },
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'de', label: 'Germany' },
    ],
    defaultValue: 'all',
  },
]

export function ReportLayout({
  title,
  description,
  kpis = defaultKpis,
  chartData = defaultChartData,
  chartTitle = 'Trend Overview',
  chartType = 'line',
  chartDataKeys = defaultChartDataKeys,
  tableData = defaultTableData,
  tableColumns = defaultTableColumns,
  tableTitle = 'Data Table',
  filters = defaultFilters,
  children,
  className,
}: ReportLayoutProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>

      {/* Filter Bar */}
      <FilterBar filters={filters} />

      {/* KPI Grid */}
      <KpiTileGrid tiles={kpis} />

      {/* Chart */}
      <ChartContainer
        title={chartTitle}
        data={chartData}
        type={chartType}
        dataKeys={chartDataKeys}
        height={350}
      />

      {/* Custom content slot */}
      {children}

      {/* Data Table */}
      <VirtualizedDataTable
        title={tableTitle}
        data={tableData as Record<string, unknown>[]}
        columns={tableColumns}
        pageSize={10}
      />
    </div>
  )
}
