'use client'

import { ServerErrorFallback } from '@/components/ui/ErrorBoundary'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ServerErrorFallback error={error} reset={reset} />
}
