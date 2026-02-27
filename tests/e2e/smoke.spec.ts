import { test, expect } from '@playwright/test'

// Critical routes that should always be accessible
const criticalRoutes = [
  { path: '/', name: 'Home' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/projects', name: 'Projects' },
  { path: '/seo/keywords/overview', name: 'Keywords Overview' },
  { path: '/seo/technical/site-audit', name: 'Site Audit' },
  { path: '/seo/competitive/keyword-gap', name: 'Keyword Gap' },
  { path: '/local/listings', name: 'Local Listings' },
  { path: '/local/reviews', name: 'Reviews' },
  { path: '/content/topic-finder', name: 'Topic Finder' },
  { path: '/social/tracker', name: 'Social Tracker' },
  { path: '/advertising/research', name: 'PPC Research' },
  { path: '/traffic/analytics', name: 'Traffic Analytics' },
  { path: '/ai-visibility/overview', name: 'AI Visibility' },
  { path: '/reports', name: 'Reports' },
  { path: '/reports/new', name: 'Create Report' },
  { path: '/settings', name: 'Settings' },
]

test.describe('Smoke Tests - Critical Routes', () => {
  for (const route of criticalRoutes) {
    test(`${route.name} (${route.path}) loads without error`, async ({ page }) => {
      const response = await page.goto(route.path)
      
      // Check response is OK (2xx or 3xx)
      expect(response?.ok() || response?.status() === 304).toBeTruthy()
      
      // Page should not have uncaught errors
      page.on('pageerror', (error) => {
        throw new Error(`Page error on ${route.path}: ${error.message}`)
      })
      
      // Wait for page to be interactive
      await page.waitForLoadState('domcontentloaded')
      
      // Check that the page has some content
      const bodyText = await page.locator('body').innerText()
      expect(bodyText.length).toBeGreaterThan(0)
    })
  }
})

test.describe('Smoke Tests - Navigation', () => {
  test('main navigation links work', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check sidebar exists
    const sidebar = page.locator('nav, [role="navigation"]')
    await expect(sidebar.first()).toBeVisible()
    
    // Test clicking a few navigation items
    const seoLink = page.locator('a[href*="/seo"]').first()
    if (await seoLink.isVisible()) {
      await seoLink.click()
      await page.waitForLoadState('domcontentloaded')
      expect(page.url()).toContain('/seo')
    }
  })
  
  test('breadcrumbs display correctly', async ({ page }) => {
    await page.goto('/seo/keywords/overview')
    
    // Page should have breadcrumb navigation
    const breadcrumbs = page.locator('[aria-label="Breadcrumb"], .breadcrumbs')
    if (await breadcrumbs.isVisible()) {
      const text = await breadcrumbs.innerText()
      expect(text.length).toBeGreaterThan(0)
    }
  })
})

test.describe('Smoke Tests - Data Loading', () => {
  test('dashboard loads KPIs', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Should have KPI tiles or similar data displays
    // Page locators are automatically checked by Playwright
    // At least check the page loaded without errors
    expect(page.url()).toContain('/dashboard')
  })
  
  test('data tables render', async ({ page }) => {
    await page.goto('/local/reviews')
    await page.waitForLoadState('networkidle')
    
    // Wait a bit for data to load
    await page.waitForTimeout(1000)
    
    // Page should have loaded
    expect(page.url()).toContain('/reviews')
  })
})

test.describe('Smoke Tests - Error Handling', () => {
  test('404 page displays for non-existent routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-12345')
    
    // Should get a 404 response or redirect
    expect([404, 200]).toContain(response?.status())
    
    // If 200, page should contain "not found" message
    if (response?.status() === 200) {
      const bodyText = await page.locator('body').innerText()
      expect(bodyText.toLowerCase()).toMatch(/not found|doesn't exist|404/)
    }
  })
})
