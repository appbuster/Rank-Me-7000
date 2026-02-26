'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

interface BreadcrumbsProps {
  className?: string
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Build breadcrumb items from path
  const pathSegments = pathname.split('/').filter(Boolean)

  // Find matching routes
  const breadcrumbItems: { label: string; href: string; active: boolean }[] = []

  // Always start with home
  breadcrumbItems.push({ label: 'Home', href: '/dashboard', active: false })

  // Build up the path progressively
  let currentPath = ''
  for (let i = 0; i < pathSegments.length; i++) {
    currentPath += '/' + pathSegments[i]

    // Find matching route
    const matchedRoute = Object.values(routes).find((r) => r.path === currentPath)

    if (matchedRoute) {
      breadcrumbItems.push({
        label: matchedRoute.name,
        href: matchedRoute.path,
        active: i === pathSegments.length - 1,
      })
    } else {
      // Use segment name as fallback
      const label = pathSegments[i]
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')

      breadcrumbItems.push({
        label,
        href: currentPath,
        active: i === pathSegments.length - 1,
      })
    }
  }

  // Don't show breadcrumbs if we're at dashboard
  if (pathname === '/dashboard') {
    return null
  }

  return (
    <nav className={cn('flex items-center text-sm', className)}>
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />}
          {item.active ? (
            <span className="font-medium text-gray-900">{item.label}</span>
          ) : (
            <Link
              href={item.href as '/dashboard'}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              {index === 0 && <Home className="mr-1 h-4 w-4" />}
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
