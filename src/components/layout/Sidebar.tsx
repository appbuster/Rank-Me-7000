'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { navigation, NavGroup } from '@/lib/routes'
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Folder,
  Search,
  TrendingUp,
  PenTool,
  MapPin,
  Share2,
  Megaphone,
  Bot,
  Newspaper,
  FileBarChart,
  Users,
  Target,
  Key,
  Link as LinkIcon,
  Settings,
  FileText,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Folder,
  Search,
  TrendingUp,
  PenTool,
  MapPin,
  Share2,
  Megaphone,
  Bot,
  Newspaper,
  FileBarChart,
  Users,
  Target,
  Key,
  Link: LinkIcon,
  Settings,
  FileText,
  Sparkles,
}

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

function NavItem({
  group,
  collapsed,
  depth = 0,
}: {
  group: NavGroup
  collapsed: boolean
  depth?: number
}) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(group.defaultOpen ?? false)

  const Icon = iconMap[group.icon] || LayoutDashboard
  const hasSubgroups = group.subgroups && group.subgroups.length > 0
  const hasRoutes = group.routes && group.routes.length > 0
  const hasChildren = hasSubgroups || (hasRoutes && group.routes.length > 1)

  // Check if any child route is active
  const isActive =
    group.routes.some((r) => pathname === r.path) ||
    (group.subgroups?.some((sg) => sg.routes.some((r) => pathname === r.path)) ?? false)

  // Single route with no children - render as direct link
  if (!hasChildren && hasRoutes && group.routes.length === 1) {
    const route = group.routes[0]
    return (
      <Link
        href={route.path}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
          pathname === route.path
            ? 'bg-blue-50 text-blue-700 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!collapsed && <span>{group.label}</span>}
      </Link>
    )
  }

  return (
    <div className={cn('space-y-1', depth > 0 && 'ml-4')}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
          isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">{group.label}</span>}
        </div>
        {!collapsed && hasChildren && (
          <span className="text-gray-400">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </span>
        )}
      </button>

      {!collapsed && isOpen && (
        <div className="space-y-1 pl-8">
          {/* Render subgroups */}
          {group.subgroups?.map((subgroup) => (
            <NavItem key={subgroup.id} group={subgroup} collapsed={collapsed} depth={depth + 1} />
          ))}

          {/* Render direct routes if no subgroups */}
          {!hasSubgroups &&
            group.routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  'block rounded-lg px-3 py-2 text-sm transition-colors',
                  pathname === route.path
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                {route.name}
              </Link>
            ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">R7</span>
            </div>
            <span className="font-semibold text-gray-900">Rank Me 7000</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {navigation.map((group) => (
            <NavItem key={group.id} group={group} collapsed={collapsed} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Users className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Demo User</p>
              <p className="text-xs text-gray-500 truncate">demo@rankme.com</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
