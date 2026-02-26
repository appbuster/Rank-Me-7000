import { Suspense } from 'react'
import { prisma } from '@/lib/data'
import { getProjectAuditSummary, getProjectAuditUrls, getIssuesByType } from '@/lib/data/audit'
import { SiteAuditClient } from './client'

async function AuditData({ projectId }: { projectId: string }) {
  const [summary, urls, issues] = await Promise.all([
    getProjectAuditSummary(projectId),
    getProjectAuditUrls(projectId, { limit: 100 }),
    getIssuesByType(projectId),
  ])

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { name: true, targetDomain: true },
  })

  return (
    <SiteAuditClient
      projectName={project?.name ?? 'Project'}
      domain={project?.targetDomain ?? ''}
      summary={summary}
      urls={urls}
      issues={issues}
    />
  )
}

export default async function SiteAuditPage() {
  const projects = await prisma.project.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { auditUrls: true },
      },
    },
  })

  const defaultProject = projects[0]

  if (!defaultProject) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Audit</h1>
          <p className="mt-1 text-sm text-gray-500">Technical SEO health check</p>
        </div>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
          No projects found. Create a project first to run a site audit.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Audit</h1>
          <p className="mt-1 text-sm text-gray-500">Technical SEO health check</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            defaultValue={defaultProject.id}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p._count.auditUrls.toLocaleString()} pages)
              </option>
            ))}
          </select>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            Re-crawl Site
          </button>
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
        <AuditData projectId={defaultProject.id} />
      </Suspense>
    </div>
  )
}
