import { Suspense } from 'react'
import { prisma } from '@/lib/data'
import { getProjectTrackingSummary, getTrackedKeywords, getAggregatedRankHistory } from '@/lib/data/tracking'
import { PositionTrackingClient } from './client'

async function TrackingData({ projectId }: { projectId: string }) {
  const [summary, keywords, history] = await Promise.all([
    getProjectTrackingSummary(projectId),
    getTrackedKeywords(projectId, { limit: 100 }),
    getAggregatedRankHistory(projectId, 30),
  ])

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { name: true, targetDomain: true },
  })

  return (
    <PositionTrackingClient
      projectName={project?.name ?? 'Project'}
      domain={project?.targetDomain ?? ''}
      summary={summary}
      keywords={keywords}
      history={history}
    />
  )
}

export default async function PositionTrackingPage() {
  // Get the first project for demo
  const projects = await prisma.project.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { trackedKeywords: true },
      },
    },
  })

  const defaultProject = projects[0]

  if (!defaultProject) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Position Tracking</h1>
          <p className="mt-1 text-sm text-gray-500">Track your keyword rankings over time</p>
        </div>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
          No projects found. Create a project first to start tracking keywords.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Position Tracking</h1>
          <p className="mt-1 text-sm text-gray-500">Track your keyword rankings over time</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            defaultValue={defaultProject.id}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p._count.trackedKeywords} keywords)
              </option>
            ))}
          </select>
          <a
            href="/seo/keywords/position-tracking/setup"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            + Add Keywords
          </a>
        </div>
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
        <TrackingData projectId={defaultProject.id} />
      </Suspense>
    </div>
  )
}
