import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center text-center">
      <span className="text-6xl">🔍</span>
      <h1 className="mt-6 text-3xl font-bold text-gray-900">Page Not Found</h1>
      <p className="mt-4 max-w-md text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/dashboard"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
