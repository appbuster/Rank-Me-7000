'use client'

import Link from 'next/link'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
      <span className="text-4xl">{icon}</span>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500">{description}</p>
      {actionLabel && (actionHref || onAction) && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              {actionLabel}
            </button>
          )}
        </>
      )}
    </div>
  )
}

// Pre-configured empty states for common scenarios
export function NoDataState() {
  return (
    <EmptyState
      icon="📊"
      title="No data available"
      description="There's no data to display yet. Data will appear here once it's available."
    />
  )
}

export function NoResultsState({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      icon="🔍"
      title="No results found"
      description="Try adjusting your search or filter criteria to find what you're looking for."
      actionLabel={onClear ? 'Clear filters' : undefined}
      onAction={onClear}
    />
  )
}

export function NoProjectsState() {
  return (
    <EmptyState
      icon="🚀"
      title="No projects yet"
      description="Get started by creating your first project to track your SEO performance."
      actionLabel="Create Project"
      actionHref="/projects/new"
    />
  )
}

export function NoKeywordsState() {
  return (
    <EmptyState
      icon="🔑"
      title="No keywords tracked"
      description="Add keywords to start tracking their rankings and performance."
      actionLabel="Add Keywords"
      actionHref="/seo/keywords/overview"
    />
  )
}

export function NoReportsState() {
  return (
    <EmptyState
      icon="📋"
      title="No reports created"
      description="Create your first report to track and share your SEO performance."
      actionLabel="Create Report"
      actionHref="/reports/new"
    />
  )
}
