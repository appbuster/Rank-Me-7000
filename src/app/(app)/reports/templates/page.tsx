import { Suspense } from 'react'
import Link from 'next/link'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'

const templates = [
  {
    id: 'seo-overview',
    name: 'SEO Overview',
    description: 'Complete SEO performance report with rankings, traffic, and technical health',
    category: 'SEO',
    widgets: 8,
    pages: 12,
    popular: true,
  },
  {
    id: 'backlink-report',
    name: 'Backlink Analysis',
    description: 'Detailed backlink profile analysis with new/lost links and anchor text',
    category: 'Backlinks',
    widgets: 6,
    pages: 8,
    popular: true,
  },
  {
    id: 'competitive-analysis',
    name: 'Competitive Analysis',
    description: 'Compare your performance against up to 5 competitors',
    category: 'Competitive',
    widgets: 10,
    pages: 15,
    popular: true,
  },
  {
    id: 'technical-audit',
    name: 'Technical SEO Audit',
    description: 'Site health, crawl errors, Core Web Vitals, and indexation status',
    category: 'Technical',
    widgets: 7,
    pages: 10,
    popular: false,
  },
  {
    id: 'traffic-report',
    name: 'Traffic Report',
    description: 'Traffic analytics, sources, top pages, and user behavior',
    category: 'Traffic',
    widgets: 6,
    pages: 8,
    popular: false,
  },
  {
    id: 'keyword-report',
    name: 'Keyword Performance',
    description: 'Keyword rankings, movements, and opportunities',
    category: 'SEO',
    widgets: 5,
    pages: 7,
    popular: false,
  },
  {
    id: 'local-seo',
    name: 'Local SEO Report',
    description: 'Local rankings, GBP performance, reviews, and citations',
    category: 'Local',
    widgets: 8,
    pages: 10,
    popular: false,
  },
  {
    id: 'content-performance',
    name: 'Content Performance',
    description: 'Content audit, top performing pages, and optimization opportunities',
    category: 'Content',
    widgets: 6,
    pages: 9,
    popular: false,
  },
]

async function TemplatesData() {
  const kpis = [
    { title: 'Available Templates', value: templates.length.toString() },
    { title: 'Categories', value: '6' },
    { title: 'Most Popular', value: 'SEO Overview' },
    { title: 'Reports from Templates', value: '847' },
  ]

  return (
    <div className="space-y-6">
      <KpiTileGrid tiles={kpis} />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="font-semibold text-blue-800">💡 Pro Tip</h3>
        <p className="mt-1 text-sm text-blue-700">
          Start with a template and customize it to your needs. You can add or remove widgets,
          change the layout, and save it as your own custom template.
        </p>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Popular Templates</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {templates
            .filter((t) => t.popular)
            .map((template) => (
              <div
                key={template.id}
                className="rounded-lg border border-gray-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                    {template.category}
                  </span>
                  <span className="text-xs text-yellow-600">⭐ Popular</span>
                </div>
                <h4 className="text-lg font-semibold">{template.name}</h4>
                <p className="mt-2 text-sm text-gray-500">{template.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>{template.widgets} widgets</span>
                  <span>{template.pages} pages</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/reports/new?template=${template.id}`}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm text-white hover:bg-blue-700"
                  >
                    Use Template
                  </Link>
                  <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
                    Preview
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">All Templates</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {templates
            .filter((t) => !t.popular)
            .map((template) => (
              <div
                key={template.id}
                className="rounded-lg border border-gray-200 bg-white p-4 transition hover:border-blue-300"
              >
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {template.category}
                </span>
                <h4 className="mt-2 font-medium">{template.name}</h4>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">{template.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{template.widgets} widgets</span>
                  <span>{template.pages} pages</span>
                </div>
                <Link
                  href={`/reports/new?template=${template.id}`}
                  className="mt-3 block w-full rounded border border-blue-600 px-3 py-1.5 text-center text-sm text-blue-600 hover:bg-blue-50"
                >
                  Use Template
                </Link>
              </div>
            ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Custom Template</h3>
            <p className="text-sm text-gray-500">Start from scratch with a blank report</p>
          </div>
          <Link
            href="/reports/new"
            className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50"
          >
            Create Blank Report
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ReportTemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Report Templates</h1>
        <p className="mt-1 text-sm text-gray-500">
          Start with a pre-built template to save time
        </p>
      </div>

      <Suspense
        fallback={
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 rounded-lg bg-gray-200" />
              ))}
            </div>
            <div className="h-64 rounded-lg bg-gray-200" />
          </div>
        }
      >
        <TemplatesData />
      </Suspense>
    </div>
  )
}
