'use client'

import { cn } from '@/lib/utils'
import { Search, Filter, Calendar, Download } from 'lucide-react'
import { useState } from 'react'

export interface FilterOption {
  id: string
  label: string
  type: 'select' | 'date' | 'search'
  options?: { value: string; label: string }[]
  defaultValue?: string
}

interface FilterBarProps {
  filters?: FilterOption[]
  onFilterChange?: (filterId: string, value: string) => void
  onSearch?: (query: string) => void
  onExport?: () => void
  showSearch?: boolean
  showExport?: boolean
  className?: string
}

export function FilterBar({
  filters = [],
  onFilterChange,
  onSearch,
  onExport,
  showSearch = true,
  showExport = true,
  className,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    onSearch?.(e.target.value)
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-3', className)}>
      {showSearch && (
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search..."
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}

      {filters.map((filter) => (
        <div key={filter.id} className="flex items-center gap-2">
          {filter.type === 'select' && filter.options && (
            <select
              defaultValue={filter.defaultValue}
              onChange={(e) => onFilterChange?.(filter.id, e.target.value)}
              className="rounded-md border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {filter.type === 'date' && (
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                defaultValue={filter.defaultValue}
                onChange={(e) => onFilterChange?.(filter.id, e.target.value)}
                className="rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      ))}

      <button className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
        <Filter className="h-4 w-4" />
        <span>More Filters</span>
      </button>

      {showExport && (
        <button
          onClick={onExport}
          className="ml-auto flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
      )}
    </div>
  )
}
