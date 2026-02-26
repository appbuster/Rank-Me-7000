'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  Building2,
  FolderKanban,
  Plus,
  Settings,
} from 'lucide-react'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const [projectOpen, setProjectOpen] = useState(false)

  // Mock data
  const workspaces = [
    { id: '1', name: 'Marketing Team', icon: '🚀' },
    { id: '2', name: 'Agency Clients', icon: '🏢' },
    { id: '3', name: 'Personal', icon: '👤' },
  ]

  const projects = [
    { id: '1', name: 'example.com', domain: 'example.com' },
    { id: '2', name: 'mybrand.io', domain: 'mybrand.io' },
    { id: '3', name: 'startup.co', domain: 'startup.co' },
  ]

  const currentWorkspace = workspaces[0]
  const currentProject = projects[0]

  return (
    <header
      className={cn(
        'flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6',
        className
      )}
    >
      {/* Left section - Selectors */}
      <div className="flex items-center gap-4">
        {/* Workspace selector */}
        <div className="relative">
          <button
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
          >
            <Building2 className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{currentWorkspace.name}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {workspaceOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setWorkspaceOpen(false)} />
              <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setWorkspaceOpen(false)}
                  >
                    <span>{ws.icon}</span>
                    <span>{ws.name}</span>
                  </button>
                ))}
                <hr className="my-1" />
                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-gray-50">
                  <Plus className="h-4 w-4" />
                  <span>Create Workspace</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Project selector */}
        <div className="relative">
          <button
            onClick={() => setProjectOpen(!projectOpen)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
          >
            <FolderKanban className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{currentProject.name}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {projectOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProjectOpen(false)} />
              <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                {projects.map((proj) => (
                  <button
                    key={proj.id}
                    className="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setProjectOpen(false)}
                  >
                    <span>{proj.name}</span>
                    <span className="text-xs text-gray-400">{proj.domain}</span>
                  </button>
                ))}
                <hr className="my-1" />
                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-gray-50">
                  <Plus className="h-4 w-4" />
                  <span>Add Project</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center - Global Search */}
      <div className="flex-1 max-w-xl px-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search domains, keywords, reports..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-xs text-gray-400 sm:block">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center gap-2">
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
