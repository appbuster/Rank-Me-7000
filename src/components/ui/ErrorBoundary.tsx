'use client'

import { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} onReset={() => this.setState({ hasError: false, error: null })} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error: Error | null
  onReset?: () => void
}

export function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center">
      <span className="text-4xl">❌</span>
      <h3 className="mt-4 text-lg font-medium text-red-900">Something went wrong</h3>
      <p className="mt-2 max-w-sm text-sm text-red-700">
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="mt-4 flex gap-2">
        {onReset && (
          <button
            onClick={onReset}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Try Again
          </button>
        )}
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg border border-red-600 px-4 py-2 text-sm text-red-600 hover:bg-red-100"
        >
          Refresh Page
        </button>
      </div>
    </div>
  )
}

// Error component for server components (use with error.tsx files)
export function ServerErrorFallback({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }
  reset: () => void 
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center">
      <span className="text-5xl">🔧</span>
      <h2 className="mt-4 text-xl font-bold text-red-900">Oops! Something went wrong</h2>
      <p className="mt-2 max-w-md text-sm text-red-700">
        We encountered an error while loading this page. Our team has been notified.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-red-500">Error ID: {error.digest}</p>
      )}
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-red-600 px-6 py-2 text-white hover:bg-red-700"
        >
          Try Again
        </button>
        <a
          href="/"
          className="rounded-lg border border-red-600 px-6 py-2 text-red-600 hover:bg-red-100"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}

// Inline error display for smaller sections
export function InlineError({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <span>⚠️</span>
      <span>{message}</span>
    </div>
  )
}
