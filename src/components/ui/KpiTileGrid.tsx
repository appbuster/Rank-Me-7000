'use client'

import { KpiTile, KpiTileProps } from './KpiTile'
import { cn } from '@/lib/utils'

interface KpiTileGridProps {
  tiles: KpiTileProps[]
  columns?: 2 | 3 | 4 | 5 | 6
  className?: string
}

export function KpiTileGrid({ tiles, columns = 4, className }: KpiTileGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  }

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {tiles.map((tile, index) => (
        <KpiTile key={index} {...tile} />
      ))}
    </div>
  )
}
