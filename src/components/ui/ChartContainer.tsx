'use client'

import { cn } from '@/lib/utils'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts'

export interface ChartDataPoint {
  name: string
  [key: string]: string | number
}

interface ChartContainerProps {
  title: string
  subtitle?: string
  data: ChartDataPoint[]
  type?: 'line' | 'bar' | 'area'
  dataKeys: { key: string; color: string; name?: string }[]
  height?: number
  className?: string
}

export function ChartContainer({
  title,
  subtitle,
  data,
  type = 'line',
  dataKeys,
  height = 300,
  className,
}: ChartContainerProps) {
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    }

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            {dataKeys.map(({ key, color, name }) => (
              <Bar key={key} dataKey={key} fill={color} name={name || key} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        )

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            {dataKeys.map(({ key, color, name }) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                fill={color}
                fillOpacity={0.2}
                name={name || key}
              />
            ))}
          </AreaChart>
        )

      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            {dataKeys.map(({ key, color, name }) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2 }}
                name={name || key}
              />
            ))}
          </LineChart>
        )
    }
  }

  return (
    <div className={cn('rounded-lg border border-gray-200 bg-white p-4 shadow-sm', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
