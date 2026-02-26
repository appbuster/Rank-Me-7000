import { routes } from '../src/lib/routes'
import * as fs from 'fs'
import * as path from 'path'

// Map route paths to page file paths in (app) group
function getPagePath(routePath: string): string {
  // Convert route path to filesystem path
  // /dashboard -> src/app/(app)/dashboard/page.tsx
  const segments = routePath.split('/').filter(Boolean)
  return path.join('src/app/(app)', ...segments, 'page.tsx')
}

// Generate page component content
function generatePageContent(route: (typeof routes)[string]): string {
  // Create component name from route name
  const componentName = route.name.replace(/[^a-zA-Z0-9]/g, '') + 'Page'

  return `import { ReportLayout } from '@/components/layout'

export default function ${componentName}() {
  return (
    <ReportLayout
      title="${route.name}"
      description="${route.description}"
    />
  )
}
`
}

// Ensure directory exists
function ensureDir(filePath: string): void {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Main
async function main() {
  console.log(`Generating ${Object.keys(routes).length} pages...`)

  let created = 0
  let skipped = 0

  for (const [key, route] of Object.entries(routes)) {
    const pagePath = getPagePath(route.path)

    // Always regenerate for now
    ensureDir(pagePath)
    const content = generatePageContent(route)
    fs.writeFileSync(pagePath, content)
    console.log(`✓ Created: ${pagePath}`)
    created++
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`)
}

main().catch(console.error)
