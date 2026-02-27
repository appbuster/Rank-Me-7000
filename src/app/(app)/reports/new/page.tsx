'use client'

import { useState } from 'react'
import Link from 'next/link'

const widgetCategories = [
  {
    name: 'SEO Metrics',
    widgets: [
      { id: 'organic-traffic', name: 'Organic Traffic', icon: '📈' },
      { id: 'keyword-rankings', name: 'Keyword Rankings', icon: '🔑' },
      { id: 'serp-features', name: 'SERP Features', icon: '⭐' },
      { id: 'visibility-score', name: 'Visibility Score', icon: '👁️' },
    ],
  },
  {
    name: 'Backlinks',
    widgets: [
      { id: 'backlink-overview', name: 'Backlink Overview', icon: '🔗' },
      { id: 'referring-domains', name: 'Referring Domains', icon: '🌐' },
      { id: 'new-lost-links', name: 'New & Lost Links', icon: '📊' },
      { id: 'anchor-text', name: 'Anchor Text Distribution', icon: '⚓' },
    ],
  },
  {
    name: 'Technical SEO',
    widgets: [
      { id: 'site-health', name: 'Site Health Score', icon: '🏥' },
      { id: 'crawl-errors', name: 'Crawl Errors', icon: '🐛' },
      { id: 'core-web-vitals', name: 'Core Web Vitals', icon: '⚡' },
      { id: 'indexation', name: 'Indexation Status', icon: '📑' },
    ],
  },
  {
    name: 'Competitive',
    widgets: [
      { id: 'competitor-comparison', name: 'Competitor Comparison', icon: '🏆' },
      { id: 'keyword-gap', name: 'Keyword Gap', icon: '🔍' },
      { id: 'backlink-gap', name: 'Backlink Gap', icon: '📉' },
      { id: 'market-share', name: 'Market Share', icon: '🥧' },
    ],
  },
  {
    name: 'Traffic',
    widgets: [
      { id: 'traffic-overview', name: 'Traffic Overview', icon: '🚦' },
      { id: 'traffic-sources', name: 'Traffic Sources', icon: '📡' },
      { id: 'top-pages', name: 'Top Pages', icon: '📄' },
      { id: 'geo-distribution', name: 'Geographic Distribution', icon: '🌍' },
    ],
  },
]

export default function CreateReportPage() {
  const [reportName, setReportName] = useState('')
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([])
  const [schedule, setSchedule] = useState('none')

  const toggleWidget = (widgetId: string) => {
    setSelectedWidgets((prev) =>
      prev.includes(widgetId)
        ? prev.filter((id) => id !== widgetId)
        : [...prev, widgetId]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Report</h1>
          <p className="mt-1 text-sm text-gray-500">
            Build a custom report by selecting widgets
          </p>
        </div>
        <Link
          href="/reports"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Report Details</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Report Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="e.g., Monthly SEO Performance"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">
                  Schedule
                </label>
                <select
                  id="schedule"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                >
                  <option value="none">No schedule (one-time)</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Select Widgets</h3>
            <div className="space-y-6">
              {widgetCategories.map((category) => (
                <div key={category.name}>
                  <h4 className="mb-2 text-sm font-medium text-gray-700">{category.name}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {category.widgets.map((widget) => (
                      <button
                        key={widget.id}
                        onClick={() => toggleWidget(widget.id)}
                        className={`flex items-center gap-2 rounded-lg border p-3 text-left transition ${
                          selectedWidgets.includes(widget.id)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xl">{widget.icon}</span>
                        <span className="text-sm">{widget.name}</span>
                        {selectedWidgets.includes(widget.id) && (
                          <span className="ml-auto text-blue-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Report Preview</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                <strong>Name:</strong> {reportName || 'Untitled Report'}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Widgets:</strong> {selectedWidgets.length} selected
              </p>
              <p className="text-sm text-gray-500">
                <strong>Schedule:</strong> {schedule === 'none' ? 'One-time' : schedule}
              </p>
            </div>
            {selectedWidgets.length > 0 && (
              <div className="mt-4 space-y-1">
                {selectedWidgets.map((widgetId) => {
                  const widget = widgetCategories
                    .flatMap((c) => c.widgets)
                    .find((w) => w.id === widgetId)
                  return (
                    <div key={widgetId} className="flex items-center gap-2 text-sm">
                      <span>{widget?.icon}</span>
                      <span>{widget?.name}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Export Options</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                <span className="text-sm">PDF</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-blue-600" />
                <span className="text-sm">Excel</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-blue-600" />
                <span className="text-sm">Google Slides</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <button
              disabled={!reportName || selectedWidgets.length === 0}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Generate Report
            </button>
            <button className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
