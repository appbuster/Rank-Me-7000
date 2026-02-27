import { Suspense } from 'react'
import { getTopDomainsByTraffic } from '@/lib/data/traffic'
import { KpiTileGrid } from '@/components/ui/KpiTileGrid'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber } from '@/lib/utils'

async function AudienceInsightsData() {
  await getTopDomainsByTraffic(30, 10)

  const kpis = [
    { title: 'Unique Visitors', value: '2.4M' },
    { title: 'Avg. Session Duration', value: '4:32' },
    { title: 'Pages per Session', value: '3.8' },
    { title: 'New vs Returning', value: '62% / 38%' },
  ]

  // Mock demographic data
  const ageData = [
    { name: '18-24', value: 15 },
    { name: '25-34', value: 30 },
    { name: '35-44', value: 25 },
    { name: '45-54', value: 18 },
    { name: '55-64', value: 8 },
    { name: '65+', value: 4 },
  ]

  const genderData = [
    { name: 'Male', value: 55 },
    { name: 'Female', value: 43 },
    { name: 'Other', value: 2 },
  ]

  const deviceData = [
    { name: 'Mobile', value: 58 },
    { name: 'Desktop', value: 35 },
    { name: 'Tablet', value: 7 },
  ]

  const geoData = [
    { name: 'United States', visitors: 850000 },
    { name: 'United Kingdom', visitors: 320000 },
    { name: 'Germany', visitors: 280000 },
    { name: 'Canada', visitors: 220000 },
    { name: 'Australia', visitors: 180000 },
    { name: 'France', visitors: 150000 },
    { name: 'India', visitors: 120000 },
    { name: 'Brazil', visitors: 100000 },
  ]

  const interestData = [
    { name: 'Technology', affinity: 85 },
    { name: 'Business', affinity: 72 },
    { name: 'Marketing', affinity: 68 },
    { name: 'Finance', affinity: 55 },
    { name: 'News', affinity: 48 },
  ]

  return (
    <div className="space-y-6">
      <FilterBar showExport />
      <KpiTileGrid tiles={kpis} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartContainer
          title="Age Distribution"
          data={ageData}
          type="bar"
          dataKeys={[{ key: 'value', color: '#3b82f6', name: 'Percentage' }]}
          height={250}
        />
        <ChartContainer
          title="Gender"
          data={genderData}
          type="pie"
          dataKeys={[{ key: 'value', color: '#22c55e', name: 'Percentage' }]}
          height={250}
        />
        <ChartContainer
          title="Devices"
          data={deviceData}
          type="pie"
          dataKeys={[{ key: 'value', color: '#f59e0b', name: 'Percentage' }]}
          height={250}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Geographic Distribution</h3>
          <div className="space-y-3">
            {geoData.map((country) => (
              <div key={country.name} className="flex items-center justify-between">
                <span className="text-sm">{country.name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(country.visitors / geoData[0].visitors) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{formatNumber(country.visitors)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Interest Categories</h3>
          <div className="space-y-3">
            {interestData.map((interest) => (
              <div key={interest.name} className="flex items-center justify-between">
                <span className="text-sm">{interest.name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-green-500" style={{ width: `${interest.affinity}%` }} />
                  </div>
                  <span className="text-sm text-gray-600">{interest.affinity}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-2 font-semibold">Browser</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Chrome</span>
              <span>65%</span>
            </div>
            <div className="flex justify-between">
              <span>Safari</span>
              <span>18%</span>
            </div>
            <div className="flex justify-between">
              <span>Firefox</span>
              <span>10%</span>
            </div>
            <div className="flex justify-between">
              <span>Other</span>
              <span>7%</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-2 font-semibold">Operating System</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Windows</span>
              <span>42%</span>
            </div>
            <div className="flex justify-between">
              <span>iOS</span>
              <span>28%</span>
            </div>
            <div className="flex justify-between">
              <span>Android</span>
              <span>20%</span>
            </div>
            <div className="flex justify-between">
              <span>macOS</span>
              <span>10%</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-2 font-semibold">Social Referrals</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>LinkedIn</span>
              <span>35%</span>
            </div>
            <div className="flex justify-between">
              <span>Twitter</span>
              <span>28%</span>
            </div>
            <div className="flex justify-between">
              <span>Facebook</span>
              <span>22%</span>
            </div>
            <div className="flex justify-between">
              <span>Other</span>
              <span>15%</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-2 font-semibold">Education Level</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Bachelor&apos;s</span>
              <span>45%</span>
            </div>
            <div className="flex justify-between">
              <span>Master&apos;s</span>
              <span>25%</span>
            </div>
            <div className="flex justify-between">
              <span>High School</span>
              <span>20%</span>
            </div>
            <div className="flex justify-between">
              <span>PhD</span>
              <span>10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AudienceInsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audience Insights</h1>
        <p className="mt-1 text-sm text-gray-500">
          Understand your audience demographics, interests, and behavior
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
        <AudienceInsightsData />
      </Suspense>
    </div>
  )
}
