import { Suspense } from 'react'
import { getTopDomainsByTraffic } from '@/lib/data/traffic'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { VirtualizedDataTable } from '@/components/ui/VirtualizedDataTable'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'
export const dynamic = 'force-dynamic'

async function PagesTrafficData() {
  await getTopDomainsByTraffic(30, 5)

  // Mock page-level data
  const pagesData = [
    { page: '/', title: 'Homepage', views: 125000, unique: 98000, bounceRate: 35.2, avgTime: 145 },
    { page: '/pricing', title: 'Pricing', views: 45000, unique: 38000, bounceRate: 28.5, avgTime: 210 },
    { page: '/features', title: 'Features', views: 38000, unique: 32000, bounceRate: 42.1, avgTime: 180 },
    { page: '/blog', title: 'Blog Index', views: 32000, unique: 28000, bounceRate: 55.3, avgTime: 95 },
    { page: '/blog/seo-guide', title: 'Complete SEO Guide', views: 28500, unique: 25000, bounceRate: 32.8, avgTime: 420 },
    { page: '/contact', title: 'Contact Us', views: 22000, unique: 19000, bounceRate: 25.2, avgTime: 120 },
    { page: '/about', title: 'About Us', views: 18500, unique: 16000, bounceRate: 48.5, avgTime: 85 },
    { page: '/demo', title: 'Request Demo', views: 15000, unique: 12500, bounceRate: 18.5, avgTime: 280 },
    { page: '/blog/keyword-research', title: 'Keyword Research Tips', views: 14200, unique: 12800, bounceRate: 35.1, avgTime: 380 },
    { page: '/integrations', title: 'Integrations', views: 12800, unique: 11000, bounceRate: 44.2, avgTime: 160 },
  ]

  const kpis = [
    { title: 'Total Pages', value: '2,847' },
    { title: 'Total Page Views', value: formatNumber(pagesData.reduce((a, p) => a + p.views, 0)) },
    { title: 'Avg. Time on Page', value: '3:24' },
    { title: 'Avg. Bounce Rate', value: '38.5%' },
  ]

  const topPagesChart = pagesData.slice(0, 5).map((p) => ({
    name: p.title.length > 20 ? p.title.substring(0, 20) + '...' : p.title,
    views: p.views,
  }))

  const bounceRateChart = pagesData.slice(0, 5).map((p) => ({
    name: p.title.length > 20 ? p.title.substring(0, 20) + '...' : p.title,
    bounceRate: p.bounceRate,
  }))

  const columns = [
    {
      accessorKey: 'page',
      header: 'Page URL',
      cell: ({ row }: { row: { original: (typeof pagesData)[0] } }) => (
        <span className="font-mono text-sm text-blue-600">{row.original.page}</span>
      ),
    },
    { accessorKey: 'title', header: 'Title' },
    {
      accessorKey: 'views',
      header: 'Page Views',
      cell: ({ row }: { row: { original: (typeof pagesData)[0] } }) => formatNumber(row.original.views),
    },
    {
      accessorKey: 'unique',
      header: 'Unique Views',
      cell: ({ row }: { row: { original: (typeof pagesData)[0] } }) => formatNumber(row.original.unique),
    },
    {
      accessorKey: 'bounceRate',
      header: 'Bounce Rate',
      cell: ({ row }: { row: { original: (typeof pagesData)[0] } }) => {
        const rate = row.original.bounceRate
        const color = rate < 30 ? 'text-green-600' : rate < 50 ? 'text-yellow-600' : 'text-red-600'
        return <span className={color}>{rate}%</span>
      },
    },
    {
      accessorKey: 'avgTime',
      header: 'Avg. Time',
      cell: ({ row }: { row: { original: (typeof pagesData)[0] } }) => {
        const time = row.original.avgTime
        return `${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}`
      },
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartContainer
          title="Top Pages by Views"
          data={topPagesChart}
          type="bar"
          dataKeys={[{ key: 'views', color: '#3b82f6', name: 'Page Views' }]}
          height={300}
        />
        <ChartContainer
          title="Bounce Rate by Page"
          data={bounceRateChart}
          type="bar"
          dataKeys={[{ key: 'bounceRate', color: '#ef4444', name: 'Bounce Rate %' }]}
          height={300}
        />
      </div>

      <VirtualizedDataTable
        title="Page Performance"
        data={pagesData}
        columns={columns as never[]}
        pageSize={15}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <h3 className="font-semibold text-green-800">✅ Best Performing Pages</h3>
          <ul className="mt-2 space-y-1 text-sm text-green-700">
            <li>• /demo - Lowest bounce rate (18.5%)</li>
            <li>• /blog/seo-guide - Highest time on page (7:00)</li>
            <li>• /pricing - Strong engagement (28.5% bounce)</li>
          </ul>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="font-semibold text-red-800">⚠️ Pages Needing Attention</h3>
          <ul className="mt-2 space-y-1 text-sm text-red-700">
            <li>• /blog - High bounce rate (55.3%)</li>
            <li>• /about - Low time on page (1:25)</li>
            <li>• /integrations - Consider better CTAs</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function PagesTrafficPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analyze performance of individual pages on your site
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
        <PagesTrafficData />
      </Suspense>
    </div>
  )
}
