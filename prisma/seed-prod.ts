import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Lighter seed for production - just enough to demo the app
async function main() {
  console.log('🌱 Starting production seed...')

  // Industries
  const industries = [
    { name: 'Technology', slug: 'technology' },
    { name: 'E-commerce', slug: 'ecommerce' },
    { name: 'Marketing', slug: 'marketing' },
  ]

  for (const industry of industries) {
    await prisma.industry.upsert({
      where: { slug: industry.slug },
      update: {},
      create: industry,
    })
  }
  console.log('✅ Industries created')

  // Sample domains
  const domains = [
    { domain: 'techcrunch.com', industrySlug: 'technology', authorityScore: 92, organicKeywords: 450000, organicTraffic: 12000000, backlinksTotal: 8500000, referringDomains: 125000 },
    { domain: 'semrush.com', industrySlug: 'marketing', authorityScore: 88, organicKeywords: 380000, organicTraffic: 8500000, backlinksTotal: 5200000, referringDomains: 98000 },
    { domain: 'ahrefs.com', industrySlug: 'marketing', authorityScore: 86, organicKeywords: 320000, organicTraffic: 6200000, backlinksTotal: 4100000, referringDomains: 82000 },
    { domain: 'shopify.com', industrySlug: 'ecommerce', authorityScore: 94, organicKeywords: 520000, organicTraffic: 15000000, backlinksTotal: 12000000, referringDomains: 180000 },
    { domain: 'moz.com', industrySlug: 'marketing', authorityScore: 84, organicKeywords: 180000, organicTraffic: 3800000, backlinksTotal: 2800000, referringDomains: 65000 },
    { domain: 'wix.com', industrySlug: 'technology', authorityScore: 90, organicKeywords: 410000, organicTraffic: 9800000, backlinksTotal: 6800000, referringDomains: 110000 },
    { domain: 'hubspot.com', industrySlug: 'marketing', authorityScore: 91, organicKeywords: 480000, organicTraffic: 11000000, backlinksTotal: 7200000, referringDomains: 135000 },
    { domain: 'bigcommerce.com', industrySlug: 'ecommerce', authorityScore: 82, organicKeywords: 145000, organicTraffic: 2400000, backlinksTotal: 1900000, referringDomains: 45000 },
  ]

  for (const d of domains) {
    const industry = await prisma.industry.findUnique({ where: { slug: d.industrySlug } })
    await prisma.domain.upsert({
      where: { domain: d.domain },
      update: {},
      create: {
        domain: d.domain,
        industryId: industry?.id,
        authorityScore: d.authorityScore,
        organicKeywords: d.organicKeywords,
        organicTraffic: d.organicTraffic,
        backlinksTotal: d.backlinksTotal,
        referringDomains: d.referringDomains,
      },
    })
  }
  console.log('✅ Domains created')

  // Sample keywords
  const keywords = [
    { keyword: 'seo tools', volume: 74000, cpc: 12.50, difficulty: 78, intent: 'commercial' },
    { keyword: 'keyword research', volume: 49500, cpc: 8.20, difficulty: 72, intent: 'informational' },
    { keyword: 'backlink checker', volume: 33100, cpc: 15.80, difficulty: 65, intent: 'transactional' },
    { keyword: 'site audit', volume: 22200, cpc: 11.30, difficulty: 58, intent: 'transactional' },
    { keyword: 'rank tracker', volume: 18100, cpc: 14.20, difficulty: 62, intent: 'commercial' },
    { keyword: 'competitor analysis', volume: 27400, cpc: 9.80, difficulty: 68, intent: 'commercial' },
    { keyword: 'ecommerce platform', volume: 40500, cpc: 18.50, difficulty: 82, intent: 'commercial' },
    { keyword: 'website builder', volume: 135000, cpc: 22.30, difficulty: 88, intent: 'transactional' },
    { keyword: 'marketing automation', volume: 27100, cpc: 25.80, difficulty: 75, intent: 'commercial' },
    { keyword: 'content marketing', volume: 49500, cpc: 16.20, difficulty: 70, intent: 'informational' },
  ]

  for (const k of keywords) {
    await prisma.keyword.upsert({
      where: { keyword_country: { keyword: k.keyword, country: 'us' } },
      update: {},
      create: k,
    })
  }
  console.log('✅ Keywords created')

  // Create a workspace and project
  const workspace = await prisma.workspace.create({
    data: { name: 'Demo Workspace' }
  })

  const project = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      name: 'SEO Analysis Demo',
      targetDomain: 'semrush.com',
      location: 'us',
      device: 'desktop',
    }
  })
  console.log('✅ Workspace and project created')

  // Issue types for audit
  const issueTypes = [
    { code: 'missing-title', name: 'Missing Title Tag', severity: 'error', category: 'meta', description: 'Page is missing a title tag', fixInstructions: 'Add a unique, descriptive title tag' },
    { code: 'missing-meta-desc', name: 'Missing Meta Description', severity: 'warning', category: 'meta', description: 'Page is missing a meta description', fixInstructions: 'Add a compelling meta description under 160 characters' },
    { code: 'slow-page', name: 'Slow Page Load', severity: 'warning', category: 'performance', description: 'Page takes over 3 seconds to load', fixInstructions: 'Optimize images, minify CSS/JS, enable caching' },
    { code: 'broken-link', name: 'Broken Internal Link', severity: 'error', category: 'links', description: 'Page contains broken internal links', fixInstructions: 'Fix or remove broken links' },
    { code: 'missing-h1', name: 'Missing H1 Tag', severity: 'warning', category: 'content', description: 'Page is missing an H1 heading', fixInstructions: 'Add a single, descriptive H1 tag' },
  ]

  for (const it of issueTypes) {
    await prisma.issueType.upsert({
      where: { code: it.code },
      update: {},
      create: it,
    })
  }
  console.log('✅ Issue types created')

  // Sample audit URLs and issues
  const sampleUrls = ['/', '/features', '/pricing', '/blog', '/about', '/contact', '/enterprise', '/api', '/integrations', '/resources']
  for (const url of sampleUrls) {
    const auditUrl = await prisma.auditUrl.create({
      data: {
        projectId: project.id,
        url: `https://semrush.com${url}`,
        statusCode: 200,
        contentType: 'text/html',
        wordCount: Math.floor(Math.random() * 2000) + 500,
        loadTimeMs: Math.floor(Math.random() * 2000) + 500,
        crawlDepth: url === '/' ? 0 : 1,
        internalLinks: Math.floor(Math.random() * 50) + 10,
        externalLinks: Math.floor(Math.random() * 10) + 2,
      }
    })

    // Random issues for some pages
    if (Math.random() > 0.5) {
      const issueType = await prisma.issueType.findFirst({ skip: Math.floor(Math.random() * 5) })
      if (issueType) {
        await prisma.auditIssue.create({
          data: {
            auditUrlId: auditUrl.id,
            issueTypeId: issueType.id,
          }
        })
      }
    }
  }
  console.log('✅ Audit data created')

  // Track some keywords
  const keywordsToTrack = await prisma.keyword.findMany({ take: 5 })
  for (const kw of keywordsToTrack) {
    const tracked = await prisma.trackedKeyword.create({
      data: {
        projectId: project.id,
        keywordId: kw.id,
        tags: 'demo',
      }
    })

    // 30 days of rank history
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      await prisma.rankHistory.create({
        data: {
          trackedKeywordId: tracked.id,
          date,
          position: Math.floor(Math.random() * 20) + 1,
          url: `https://semrush.com/${kw.keyword.replace(/\s+/g, '-')}`,
          visibility: Math.random() * 100,
          estimatedTraffic: Math.floor(Math.random() * 5000),
        }
      })
    }
  }
  console.log('✅ Position tracking data created')

  // Sample backlinks
  const semrushDomain = await prisma.domain.findUnique({ where: { domain: 'semrush.com' } })
  if (semrushDomain) {
    const sources = ['forbes.com', 'entrepreneur.com', 'searchenginejournal.com', 'moz.com', 'hubspot.com', 'neilpatel.com', 'backlinko.com', 'ahrefs.com']
    for (const source of sources) {
      await prisma.backlink.create({
        data: {
          targetDomainId: semrushDomain.id,
          sourceDomain: source,
          sourceUrl: `https://${source}/article-about-seo`,
          targetUrl: 'https://semrush.com/',
          anchor: 'SEMrush',
          isDofollow: Math.random() > 0.2,
          authorityScore: Math.floor(Math.random() * 30) + 70,
          firstSeen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          lastSeen: new Date(),
          toxicityScore: Math.floor(Math.random() * 20),
        }
      })
    }
  }
  console.log('✅ Backlinks created')

  console.log('🎉 Production seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
