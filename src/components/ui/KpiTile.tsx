'use client'

import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'

export interface KpiTileProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  trend?: 'up' | 'down' | 'neutral'
  format?: 'number' | 'currency' | 'percent'
  className?: string
}

export function KpiTile({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  trend,
  className,
}: KpiTileProps) {
  const determinedTrend = trend ?? (change ? (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral') : 'neutral')

  const TrendIcon = determinedTrend === 'up' ? ArrowUp : determinedTrend === 'down' ? ArrowDown : Minus

  const trendColor =
    determinedTrend === 'up'
      ? 'text-green-600'
      : determinedTrend === 'down'
        ? 'text-red-600'
        : 'text-gray-500'

  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      {change !== undefined && (
        <div className={cn('mt-2 flex items-center text-sm', trendColor)}>
          <TrendIcon className="mr-1 h-4 w-4" />
          <span className="font-medium">{Math.abs(change)}%</span>
          <span className="ml-1 text-gray-500">{changeLabel}</span>
        </div>
      )}
    </div>
  )
}
