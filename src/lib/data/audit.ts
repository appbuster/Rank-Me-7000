import { prisma } from './db'

export interface AuditSummary {
  totalUrls: number
  healthy: number
  withIssues: number
  errors: number
  warnings: number
  notices: number
  avgLoadTime: number
}

export interface AuditUrlWithIssues {
  id: string
  url: string
  statusCode: number | null
  wordCount: number | null
  loadTimeMs: number | null
  crawlDepth: number | null
  internalLinks: number | null
  externalLinks: number | null
  issueCount: number
}

export interface IssueTypeCount {
  code: string
  name: string
  severity: string
  category: string
  count: number
}

export async function getProjectAuditSummary(projectId: string): Promise<AuditSummary> {
  const urls = await prisma.auditUrl.findMany({
    where: { projectId },
    include: {
      issues: {
        include: {
          issueType: true,
        },
      },
    },
  })

  const totalUrls = urls.length
  const healthy = urls.filter((u) => u.issues.length === 0).length
  const withIssues = urls.filter((u) => u.issues.length > 0).length

  let errors = 0
  let warnings = 0
  let notices = 0

  for (const url of urls) {
    for (const issue of url.issues) {
      switch (issue.issueType.severity) {
        case 'error':
          errors++
          break
        case 'warning':
          warnings++
          break
        case 'notice':
          notices++
          break
      }
    }
  }

  const loadTimes = urls.filter((u) => u.loadTimeMs).map((u) => u.loadTimeMs!)
  const avgLoadTime = loadTimes.length > 0 ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length : 0

  return {
    totalUrls,
    healthy,
    withIssues,
    errors,
    warnings,
    notices,
    avgLoadTime: Math.round(avgLoadTime),
  }
}

export async function getProjectAuditUrls(
  projectId: string,
  options: { limit?: number; offset?: number; hasIssues?: boolean } = {}
): Promise<AuditUrlWithIssues[]> {
  const { limit = 100, offset = 0, hasIssues } = options

  const urls = await prisma.auditUrl.findMany({
    where: {
      projectId,
      ...(hasIssues !== undefined && {
        issues: hasIssues ? { some: {} } : { none: {} },
      }),
    },
    include: {
      _count: {
        select: { issues: true },
      },
    },
    orderBy: { crawledAt: 'desc' },
    take: limit,
    skip: offset,
  })

  return urls.map((u) => ({
    id: u.id,
    url: u.url,
    statusCode: u.statusCode,
    wordCount: u.wordCount,
    loadTimeMs: u.loadTimeMs,
    crawlDepth: u.crawlDepth,
    internalLinks: u.internalLinks,
    externalLinks: u.externalLinks,
    issueCount: u._count.issues,
  }))
}

export async function getIssuesByType(projectId: string): Promise<IssueTypeCount[]> {
  const issues = await prisma.auditIssue.findMany({
    where: {
      auditUrl: {
        projectId,
      },
    },
    include: {
      issueType: true,
    },
  })

  const counts = new Map<string, IssueTypeCount>()

  for (const issue of issues) {
    const existing = counts.get(issue.issueType.code)
    if (existing) {
      existing.count++
    } else {
      counts.set(issue.issueType.code, {
        code: issue.issueType.code,
        name: issue.issueType.name,
        severity: issue.issueType.severity,
        category: issue.issueType.category,
        count: 1,
      })
    }
  }

  return Array.from(counts.values()).sort((a, b) => b.count - a.count)
}

export async function getUrlIssues(auditUrlId: string) {
  const issues = await prisma.auditIssue.findMany({
    where: { auditUrlId },
    include: {
      issueType: true,
    },
  })

  return issues.map((i) => ({
    id: i.id,
    code: i.issueType.code,
    name: i.issueType.name,
    severity: i.issueType.severity,
    category: i.issueType.category,
    details: i.details,
  }))
}
