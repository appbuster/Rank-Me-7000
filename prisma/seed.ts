import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ============================================================================
// DATA GENERATORS
// ============================================================================

// Industries (10)
const industries = [
  { name: 'Technology', slug: 'technology' },
  { name: 'E-commerce', slug: 'ecommerce' },
  { name: 'Finance', slug: 'finance' },
  { name: 'Healthcare', slug: 'healthcare' },
  { name: 'Education', slug: 'education' },
  { name: 'Travel', slug: 'travel' },
  { name: 'Real Estate', slug: 'real-estate' },
  { name: 'Marketing', slug: 'marketing' },
  { name: 'Food & Beverage', slug: 'food-beverage' },
  { name: 'Entertainment', slug: 'entertainment' },
]

// Domain prefixes and suffixes for generating realistic domains
const domainPrefixes = [
  'best', 'top', 'pro', 'smart', 'easy', 'quick', 'fast', 'super', 'mega', 'ultra',
  'prime', 'elite', 'expert', 'master', 'genius', 'stellar', 'bright', 'clear', 'pure', 'true',
]

const domainBases = {
  technology: ['tech', 'software', 'cloud', 'digital', 'cyber', 'data', 'code', 'dev', 'app', 'system'],
  ecommerce: ['shop', 'store', 'buy', 'deal', 'cart', 'market', 'mall', 'outlet', 'sale', 'retail'],
  finance: ['bank', 'invest', 'money', 'wealth', 'capital', 'fund', 'credit', 'loan', 'pay', 'finance'],
  healthcare: ['health', 'med', 'care', 'clinic', 'doctor', 'wellness', 'therapy', 'pharma', 'life', 'vital'],
  education: ['learn', 'study', 'edu', 'school', 'course', 'tutor', 'academy', 'teach', 'class', 'skill'],
  travel: ['travel', 'trip', 'tour', 'vacation', 'flight', 'hotel', 'journey', 'explore', 'adventure', 'escape'],
  'real-estate': ['home', 'house', 'property', 'estate', 'realty', 'land', 'apartment', 'condo', 'living', 'space'],
  marketing: ['marketing', 'brand', 'ads', 'media', 'seo', 'growth', 'lead', 'funnel', 'convert', 'engage'],
  'food-beverage': ['food', 'eat', 'taste', 'chef', 'kitchen', 'recipe', 'dine', 'meal', 'drink', 'fresh'],
  entertainment: ['play', 'game', 'fun', 'watch', 'stream', 'movie', 'music', 'show', 'live', 'event'],
}

const tlds = ['.com', '.io', '.co', '.net', '.org', '.app', '.dev', '.xyz', '.tech', '.ai']

// Keyword templates per industry
const keywordTemplates = {
  technology: [
    'best {base} software', '{base} tools online', 'how to use {base}', '{base} for business',
    '{base} pricing', '{base} review', '{base} vs competitor', 'free {base} tool',
    '{base} tutorial', '{base} guide', 'enterprise {base}', '{base} integration',
    '{base} api', '{base} platform', '{base} solution', 'top {base} companies',
  ],
  ecommerce: [
    'buy {base} online', 'best {base} deals', 'cheap {base}', '{base} discount code',
    '{base} free shipping', '{base} reviews', 'top {base} brands', '{base} sale',
    '{base} price comparison', '{base} near me', '{base} store', 'authentic {base}',
  ],
  finance: [
    'best {base} rates', '{base} calculator', 'how to {base}', '{base} for beginners',
    '{base} tips', '{base} advice', '{base} companies', 'online {base}',
    '{base} requirements', '{base} application', '{base} comparison', 'low {base}',
  ],
  healthcare: [
    '{base} symptoms', '{base} treatment', 'best {base} doctor', '{base} near me',
    '{base} cost', '{base} insurance', 'natural {base}', '{base} specialist',
    '{base} medication', '{base} therapy', '{base} prevention', '{base} diagnosis',
  ],
  education: [
    'learn {base}', '{base} courses', 'best {base} classes', '{base} certification',
    '{base} for beginners', 'online {base}', 'free {base} training', '{base} degree',
    '{base} bootcamp', '{base} tutorial', '{base} exam', '{base} resources',
  ],
  travel: [
    'best {base} destinations', 'cheap {base}', '{base} deals', '{base} packages',
    '{base} tips', '{base} guide', 'family {base}', 'luxury {base}',
    '{base} booking', '{base} reviews', '{base} itinerary', 'adventure {base}',
  ],
  'real-estate': [
    '{base} for sale', 'buy {base}', 'rent {base}', '{base} prices',
    '{base} listings', '{base} near me', 'best {base} neighborhoods', '{base} market',
    '{base} investment', '{base} agent', '{base} value', 'affordable {base}',
  ],
  marketing: [
    '{base} strategy', '{base} tips', 'best {base} tools', '{base} agency',
    '{base} consultant', '{base} services', '{base} automation', '{base} roi',
    '{base} examples', '{base} trends', '{base} analytics', '{base} optimization',
  ],
  'food-beverage': [
    'best {base} recipe', '{base} near me', 'healthy {base}', '{base} delivery',
    '{base} restaurant', 'homemade {base}', 'easy {base}', '{base} ideas',
    '{base} menu', '{base} catering', 'organic {base}', 'vegan {base}',
  ],
  entertainment: [
    'best {base}', 'free {base}', '{base} streaming', '{base} download',
    '{base} reviews', 'new {base}', 'top {base}', '{base} tickets',
    '{base} schedule', '{base} near me', 'live {base}', '{base} subscription',
  ],
}

// Anchor text variations
const anchorPatterns = [
  '{domain}', 'visit {domain}', 'click here', 'learn more', 'read more',
  '{keyword}', 'best {keyword}', 'top {keyword}', '{keyword} guide', 'official site',
]

// Issue types for site audit
const issueTypes = [
  { code: 'H1_MISSING', name: 'Missing H1 tag', severity: 'error', category: 'content' },
  { code: 'H1_MULTIPLE', name: 'Multiple H1 tags', severity: 'warning', category: 'content' },
  { code: 'TITLE_MISSING', name: 'Missing title tag', severity: 'error', category: 'meta' },
  { code: 'TITLE_TOO_LONG', name: 'Title too long (>60 chars)', severity: 'warning', category: 'meta' },
  { code: 'TITLE_TOO_SHORT', name: 'Title too short (<30 chars)', severity: 'notice', category: 'meta' },
  { code: 'META_DESC_MISSING', name: 'Missing meta description', severity: 'warning', category: 'meta' },
  { code: 'META_DESC_TOO_LONG', name: 'Meta description too long', severity: 'notice', category: 'meta' },
  { code: 'IMG_ALT_MISSING', name: 'Images missing alt text', severity: 'warning', category: 'content' },
  { code: 'BROKEN_LINK', name: 'Broken internal link', severity: 'error', category: 'links' },
  { code: 'REDIRECT_CHAIN', name: 'Redirect chain detected', severity: 'warning', category: 'links' },
  { code: 'SLOW_PAGE', name: 'Slow page load (>3s)', severity: 'warning', category: 'performance' },
  { code: 'LARGE_PAGE', name: 'Page size too large', severity: 'notice', category: 'performance' },
  { code: 'DUPLICATE_CONTENT', name: 'Duplicate content detected', severity: 'warning', category: 'content' },
  { code: 'CANONICAL_MISSING', name: 'Missing canonical tag', severity: 'notice', category: 'meta' },
  { code: 'ROBOTS_BLOCKED', name: 'Page blocked by robots.txt', severity: 'notice', category: 'indexing' },
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateDomain(industrySlug: string, index: number): string {
  const bases = domainBases[industrySlug as keyof typeof domainBases] || domainBases.technology
  const prefix = index % 2 === 0 ? randomChoice(domainPrefixes) : ''
  const base = randomChoice(bases)
  const tld = randomChoice(tlds)
  const suffix = index % 3 === 0 ? randomInt(1, 99).toString() : ''
  return `${prefix}${base}${suffix}${tld}`.toLowerCase()
}

function generateKeyword(template: string, base: string): string {
  return template.replace('{base}', base)
}

function generateUrl(domain: string, depth: number): string {
  const paths = ['blog', 'products', 'services', 'about', 'contact', 'pricing', 'features', 'resources', 'help', 'docs']
  const slugs = ['guide', 'tips', 'how-to', 'best', 'top', 'review', 'comparison', 'tutorial', 'ultimate', 'complete']
  
  let url = `https://${domain}`
  for (let i = 0; i < depth; i++) {
    url += '/' + randomChoice(i === 0 ? paths : slugs) + (i > 0 ? '-' + randomInt(1, 100) : '')
  }
  return url
}

function generateAnchor(domain: string, keyword: string): string {
  const pattern = randomChoice(anchorPatterns)
  return pattern.replace('{domain}', domain).replace('{keyword}', keyword)
}

function daysAgo(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
  console.log('🌱 Starting seed process...\n')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.rankHistory.deleteMany()
  await prisma.trackedKeyword.deleteMany()
  await prisma.auditIssue.deleteMany()
  await prisma.auditUrl.deleteMany()
  await prisma.issueType.deleteMany()
  await prisma.competitor.deleteMany()
  await prisma.project.deleteMany()
  await prisma.workspace.deleteMany()
  await prisma.backlink.deleteMany()
  await prisma.organicRank.deleteMany()
  await prisma.keyword.deleteMany()
  await prisma.keywordGroup.deleteMany()
  await prisma.domain.deleteMany()
  await prisma.industry.deleteMany()
  await prisma.savedList.deleteMany()
  await prisma.report.deleteMany()

  // Create industries
  console.log('📁 Creating 10 industries...')
  const createdIndustries = await Promise.all(
    industries.map((ind) =>
      prisma.industry.create({ data: ind })
    )
  )
  const industryMap = new Map(createdIndustries.map((i) => [i.slug, i.id]))

  // Create domains (50+ per industry = 500+ total)
  console.log('🌐 Creating 500+ domains...')
  const domains: { id: string; domain: string; industrySlug: string }[] = []
  
  for (const industry of createdIndustries) {
    for (let i = 0; i < 50; i++) {
      const domainName = generateDomain(industry.slug, i)
      try {
        const created = await prisma.domain.create({
          data: {
            domain: domainName,
            industryId: industry.id,
            authorityScore: randomInt(10, 95),
            organicKeywords: randomInt(100, 50000),
            organicTraffic: randomInt(1000, 5000000),
            paidKeywords: randomInt(0, 1000),
            backlinksTotal: randomInt(100, 500000),
            referringDomains: randomInt(50, 10000),
          },
        })
        domains.push({ id: created.id, domain: created.domain, industrySlug: industry.slug })
      } catch {
        // Skip duplicate domains
      }
    }
  }
  console.log(`   Created ${domains.length} domains`)

  // Create keyword groups
  console.log('📂 Creating keyword groups...')
  const keywordGroups: { id: string; industrySlug: string }[] = []
  
  for (const industry of createdIndustries) {
    const bases = domainBases[industry.slug as keyof typeof domainBases] || domainBases.technology
    for (const base of bases) {
      const group = await prisma.keywordGroup.create({
        data: {
          name: `${base.charAt(0).toUpperCase() + base.slice(1)} Keywords`,
        },
      })
      keywordGroups.push({ id: group.id, industrySlug: industry.slug })
    }
  }
  console.log(`   Created ${keywordGroups.length} keyword groups`)

  // Create keywords (25,000+)
  console.log('🔑 Creating 25,000+ keywords...')
  const keywords: { id: string; keyword: string; volume: number; cpc: number }[] = []
  const intents = ['informational', 'navigational', 'commercial', 'transactional']
  
  let keywordCount = 0
  for (const industry of createdIndustries) {
    const templates = keywordTemplates[industry.slug as keyof typeof keywordTemplates] || keywordTemplates.technology
    const bases = domainBases[industry.slug as keyof typeof domainBases] || domainBases.technology
    const groups = keywordGroups.filter((g) => g.industrySlug === industry.slug)
    
    for (const base of bases) {
      for (const template of templates) {
        for (let variant = 0; variant < 15; variant++) {
          const kw = generateKeyword(template, base) + (variant > 0 ? ` ${variant + 2024}` : '')
          const group = randomChoice(groups)
          
          try {
            const created = await prisma.keyword.create({
              data: {
                keyword: kw,
                country: randomChoice(['us', 'uk', 'de', 'fr', 'ca']),
                volume: randomInt(10, 100000),
                cpc: randomFloat(0.1, 50),
                difficulty: randomInt(1, 100),
                intent: randomChoice(intents),
                groupId: group?.id,
              },
            })
            keywords.push({ id: created.id, keyword: created.keyword, volume: created.volume, cpc: created.cpc })
            keywordCount++
          } catch {
            // Skip duplicates
          }
        }
      }
    }
    
    if (keywordCount % 5000 === 0) {
      console.log(`   Progress: ${keywordCount} keywords...`)
    }
  }
  console.log(`   Created ${keywords.length} keywords`)

  // Create organic ranks
  console.log('📊 Creating organic rankings...')
  let rankCount = 0
  
  for (const domain of domains.slice(0, 100)) {
    const domainKeywords = keywords.slice(0, 500)
    for (const kw of domainKeywords.slice(0, randomInt(50, 200))) {
      try {
        await prisma.organicRank.create({
          data: {
            domainId: domain.id,
            keywordId: kw.id,
            position: randomInt(1, 100),
            url: generateUrl(domain.domain, randomInt(1, 3)),
            trafficPercent: randomFloat(0, 100),
            previousPosition: randomInt(1, 100),
          },
        })
        rankCount++
      } catch {
        // Skip duplicates
      }
    }
  }
  console.log(`   Created ${rankCount} organic rankings`)

  // Create backlinks (200,000+)
  console.log('🔗 Creating 200,000+ backlinks...')
  let backlinkCount = 0
  const batchSize = 1000
  
  for (const domain of domains) {
    const numBacklinks = randomInt(200, 800)
    const backlinkData = []
    
    for (let i = 0; i < numBacklinks; i++) {
      const sourceDomain = randomChoice(domains).domain
      if (sourceDomain === domain.domain) continue
      
      const firstSeen = daysAgo(randomInt(1, 365))
      const lastSeen = daysAgo(randomInt(0, Math.min(30, Math.floor((Date.now() - firstSeen.getTime()) / 86400000))))
      
      backlinkData.push({
        targetDomainId: domain.id,
        sourceDomain,
        sourceUrl: generateUrl(sourceDomain, randomInt(1, 3)),
        targetUrl: generateUrl(domain.domain, randomInt(0, 2)),
        anchor: generateAnchor(domain.domain, randomChoice(keywords).keyword),
        isDofollow: Math.random() > 0.2,
        isImage: Math.random() > 0.9,
        authorityScore: randomInt(1, 100),
        firstSeen,
        lastSeen,
        isLost: Math.random() > 0.9,
        toxicityScore: randomInt(0, 100),
      })
    }
    
    await prisma.backlink.createMany({ data: backlinkData })
    backlinkCount += backlinkData.length
    
    if (backlinkCount % 50000 === 0) {
      console.log(`   Progress: ${backlinkCount} backlinks...`)
    }
  }
  console.log(`   Created ${backlinkCount} backlinks`)

  // Create issue types
  console.log('⚠️  Creating issue types...')
  const createdIssueTypes = await Promise.all(
    issueTypes.map((it) => prisma.issueType.create({ data: it }))
  )

  // Create workspaces and projects
  console.log('📁 Creating workspaces and projects...')
  const workspace = await prisma.workspace.create({
    data: { name: 'Demo Workspace' },
  })

  const projects: { id: string; domain: string }[] = []
  for (let i = 0; i < 10; i++) {
    const domain = domains[i]
    const project = await prisma.project.create({
      data: {
        workspaceId: workspace.id,
        name: `Project ${domain.domain}`,
        targetDomain: domain.domain,
        location: randomChoice(['us', 'uk', 'de']),
        device: randomChoice(['desktop', 'mobile']),
        crawlLimit: randomInt(500, 5000),
      },
    })
    projects.push({ id: project.id, domain: domain.domain })
    
    // Add competitors
    const competitorDomains = domains.filter((d) => d.domain !== domain.domain).slice(0, 5)
    await prisma.competitor.createMany({
      data: competitorDomains.map((d, idx) => ({
        projectId: project.id,
        domain: d.domain,
        position: idx + 1,
      })),
    })
  }
  console.log(`   Created ${projects.length} projects`)

  // Create audit URLs (100,000+)
  console.log('🔍 Creating 100,000+ audit URLs...')
  let auditUrlCount = 0
  
  for (const project of projects) {
    const numUrls = randomInt(8000, 12000)
    const auditUrlData = []
    
    for (let i = 0; i < numUrls; i++) {
      auditUrlData.push({
        projectId: project.id,
        url: generateUrl(project.domain, randomInt(1, 4)),
        statusCode: randomChoice([200, 200, 200, 200, 301, 302, 404, 500]),
        contentType: 'text/html',
        wordCount: randomInt(100, 5000),
        loadTimeMs: randomInt(100, 5000),
        crawlDepth: randomInt(1, 5),
        internalLinks: randomInt(5, 100),
        externalLinks: randomInt(0, 20),
        crawledAt: daysAgo(randomInt(0, 7)),
      })
    }
    
    await prisma.auditUrl.createMany({ data: auditUrlData })
    auditUrlCount += auditUrlData.length
    console.log(`   Progress: ${auditUrlCount} audit URLs...`)
  }
  console.log(`   Created ${auditUrlCount} audit URLs`)

  // Create audit issues
  console.log('🐛 Creating audit issues...')
  const auditUrls = await prisma.auditUrl.findMany({ take: 20000 })
  let issueCount = 0
  
  for (const url of auditUrls) {
    const numIssues = randomInt(0, 3)
    const issueData = []
    
    for (let i = 0; i < numIssues; i++) {
      const issueType = randomChoice(createdIssueTypes)
      issueData.push({
        auditUrlId: url.id,
        issueTypeId: issueType.id,
      })
    }
    
    if (issueData.length > 0) {
      await prisma.auditIssue.createMany({ data: issueData })
      issueCount += issueData.length
    }
  }
  console.log(`   Created ${issueCount} audit issues`)

  // Create tracked keywords and rank history (90 days)
  console.log('📈 Creating position tracking with 90-day history...')
  let trackedCount = 0
  let historyCount = 0
  
  for (const project of projects) {
    const trackedKeywords = keywords.slice(0, randomInt(100, 300))
    
    for (const kw of trackedKeywords) {
      try {
        const tracked = await prisma.trackedKeyword.create({
          data: {
            projectId: project.id,
            keywordId: kw.id,
          },
        })
        trackedCount++
        
        // Generate 90 days of history
        const historyData = []
        let position = randomInt(1, 50)
        
        for (let day = 90; day >= 0; day--) {
          // Simulate position fluctuation
          position = Math.max(1, Math.min(100, position + randomInt(-3, 3)))
          
          historyData.push({
            trackedKeywordId: tracked.id,
            date: daysAgo(day),
            position,
            url: generateUrl(project.domain, 2),
            visibility: randomFloat(0, 100),
            estimatedTraffic: Math.floor(kw.volume * (101 - position) / 100 * 0.1),
          })
        }
        
        await prisma.rankHistory.createMany({ data: historyData })
        historyCount += historyData.length
      } catch {
        // Skip duplicates
      }
    }
    console.log(`   Project ${project.domain}: ${trackedCount} tracked keywords, ${historyCount} history records`)
  }
  console.log(`   Total: ${trackedCount} tracked keywords, ${historyCount} rank history records`)

  // Create sample reports
  console.log('📄 Creating sample reports...')
  await prisma.report.createMany({
    data: [
      { name: 'Weekly SEO Summary', template: 'seo-summary', config: '{}' },
      { name: 'Competitor Analysis', template: 'competitor', config: '{}' },
      { name: 'Backlink Report', template: 'backlinks', config: '{}' },
      { name: 'Site Audit Report', template: 'audit', config: '{}' },
      { name: 'Ranking Progress', template: 'rankings', config: '{}' },
    ],
  })

  // ============================================================================
  // PHASE 7: ADDITIONAL TOOLKIT DATA
  // ============================================================================

  // Content Toolkit - Topic Ideas
  console.log('📝 Creating content toolkit data...')
  const topicIdeas = []
  const contentTypes = ['blog', 'guide', 'listicle', 'comparison', 'how-to', 'review']
  const topicPrefixes = ['Ultimate Guide to', 'How to', 'Best', 'Top 10', 'Why', 'What is']
  
  for (let i = 0; i < 200; i++) {
    const kw = randomChoice(keywords)
    topicIdeas.push({
      topic: `${randomChoice(topicPrefixes)} ${kw.keyword}`,
      keyword: kw.keyword,
      volume: kw.volume,
      difficulty: randomInt(20, 80),
      trendScore: randomInt(30, 100),
      questions: JSON.stringify([
        `What is ${kw.keyword}?`,
        `How does ${kw.keyword} work?`,
        `Is ${kw.keyword} worth it?`,
      ]),
      relatedTopics: JSON.stringify([`${kw.keyword} tips`, `${kw.keyword} guide`, `${kw.keyword} alternatives`]),
      contentType: randomChoice(contentTypes),
    })
  }
  await prisma.topicIdea.createMany({ data: topicIdeas })
  console.log(`   Created ${topicIdeas.length} topic ideas`)

  // Content Pieces
  const contentPieces = []
  const contentStatuses = ['published', 'draft', 'needs-update', 'archived']
  
  for (const domain of domains.slice(0, 50)) {
    for (let i = 0; i < randomInt(5, 20); i++) {
      const kw = randomChoice(keywords)
      contentPieces.push({
        url: generateUrl(domain.domain, 2),
        title: `${randomChoice(topicPrefixes)} ${kw.keyword}`,
        wordCount: randomInt(500, 3000),
        readingTime: randomInt(2, 15),
        seoScore: randomInt(40, 95),
        readability: randomInt(50, 90),
        targetKeyword: kw.keyword,
        lastUpdated: daysAgo(randomInt(1, 180)),
        status: randomChoice(contentStatuses),
        issues: randomInt(0, 5) > 2 ? JSON.stringify(['Missing meta description', 'Low word count']) : null,
      })
    }
  }
  await prisma.contentPiece.createMany({ data: contentPieces })
  console.log(`   Created ${contentPieces.length} content pieces`)

  // Local Toolkit - Listings
  console.log('📍 Creating local toolkit data...')
  const platforms = ['Google Business', 'Yelp', 'Facebook', 'Apple Maps', 'Bing Places', 'TripAdvisor']
  const listingStatuses = ['active', 'pending', 'inactive', 'duplicate']
  const localListings = []
  
  for (let i = 0; i < 100; i++) {
    const domain = randomChoice(domains)
    localListings.push({
      businessName: domain.domain.split('.')[0].replace(/\d+/g, '').toUpperCase() + ' Business',
      platform: randomChoice(platforms),
      profileUrl: `https://${randomChoice(platforms).toLowerCase().replace(' ', '')}.com/${domain.domain}`,
      status: randomChoice(listingStatuses),
      nap: JSON.stringify({
        name: domain.domain.split('.')[0],
        address: `${randomInt(100, 9999)} Main St, City, ST ${randomInt(10000, 99999)}`,
        phone: `(${randomInt(200, 999)}) ${randomInt(200, 999)}-${randomInt(1000, 9999)}`,
      }),
      categories: JSON.stringify(['Business', 'Services', 'Local']),
      rating: randomFloat(2.5, 5.0, 1),
      reviewCount: randomInt(5, 500),
      isVerified: Math.random() > 0.3,
      lastSynced: daysAgo(randomInt(0, 30)),
      issues: randomInt(0, 5) > 3 ? JSON.stringify(['NAP inconsistency', 'Missing hours']) : null,
    })
  }
  await prisma.localListing.createMany({ data: localListings })
  console.log(`   Created ${localListings.length} local listings`)

  // Reviews
  const reviews = []
  const sentiments = ['positive', 'neutral', 'negative']
  const reviewTemplates = [
    'Great service! Highly recommend.',
    'Average experience, nothing special.',
    'Not satisfied with the service.',
    'Amazing quality and fast delivery!',
    'Could be better, but okay overall.',
    'Terrible experience, would not recommend.',
    'Five stars! Will come back again.',
    'Professional and friendly staff.',
  ]
  
  for (let i = 0; i < 500; i++) {
    const rating = randomInt(1, 5)
    reviews.push({
      listingId: `listing-${i % 100}`,
      platform: randomChoice(platforms),
      authorName: `User${randomInt(1000, 9999)}`,
      rating,
      content: randomChoice(reviewTemplates),
      sentiment: rating >= 4 ? 'positive' : rating >= 3 ? 'neutral' : 'negative',
      isResponded: Math.random() > 0.5,
      response: Math.random() > 0.5 ? 'Thank you for your feedback!' : null,
      publishedAt: daysAgo(randomInt(1, 365)),
      respondedAt: Math.random() > 0.5 ? daysAgo(randomInt(0, 30)) : null,
    })
  }
  await prisma.review.createMany({ data: reviews })
  console.log(`   Created ${reviews.length} reviews`)

  // Map Rankings
  const mapRankings = []
  const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ']
  
  for (let i = 0; i < 100; i++) {
    const positions = Array.from({ length: 25 }, () => randomInt(1, 20))
    mapRankings.push({
      keyword: randomChoice(keywords).keyword + ' near me',
      location: randomChoice(locations),
      gridSize: 5,
      positions: JSON.stringify(positions),
      avgRank: positions.reduce((a, b) => a + b, 0) / positions.length,
      topRank: Math.min(...positions),
      date: daysAgo(randomInt(0, 30)),
    })
  }
  await prisma.mapRanking.createMany({ data: mapRankings })
  console.log(`   Created ${mapRankings.length} map rankings`)

  // Social Toolkit
  console.log('📱 Creating social toolkit data...')
  const socialPlatforms = ['Twitter', 'Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube']
  const socialProfiles = []
  
  for (const domain of domains.slice(0, 30)) {
    for (const platform of socialPlatforms.slice(0, randomInt(2, 5))) {
      socialProfiles.push({
        platform,
        handle: `@${domain.domain.split('.')[0]}`,
        displayName: domain.domain.split('.')[0].toUpperCase(),
        followers: randomInt(100, 100000),
        following: randomInt(50, 5000),
        postCount: randomInt(10, 1000),
        engagementRate: randomFloat(0.5, 8.0, 2),
        profileUrl: `https://${platform.toLowerCase()}.com/${domain.domain.split('.')[0]}`,
        avatarUrl: null,
        isVerified: Math.random() > 0.8,
      })
    }
  }
  const createdProfiles = []
  for (const profile of socialProfiles) {
    try {
      const created = await prisma.socialProfile.create({ data: profile })
      createdProfiles.push(created)
    } catch {
      // Skip duplicates
    }
  }
  console.log(`   Created ${createdProfiles.length} social profiles`)

  // Social Posts
  const socialPosts = []
  const postTypes = ['text', 'image', 'video', 'link', 'carousel']
  
  for (const profile of createdProfiles) {
    for (let i = 0; i < randomInt(10, 50); i++) {
      socialPosts.push({
        profileId: profile.id,
        platform: profile.platform,
        postId: `post-${profile.id}-${i}`,
        content: `Check out our latest ${randomChoice(['product', 'service', 'offer', 'update'])}! #trending #marketing`,
        postType: randomChoice(postTypes),
        likes: randomInt(10, 5000),
        comments: randomInt(0, 500),
        shares: randomInt(0, 200),
        impressions: randomInt(100, 50000),
        reach: randomInt(50, 25000),
        publishedAt: daysAgo(randomInt(0, 90)),
        url: `https://${profile.platform.toLowerCase()}.com/post/${i}`,
      })
    }
  }
  await prisma.socialPost.createMany({ data: socialPosts })
  console.log(`   Created ${socialPosts.length} social posts`)

  // Social Metrics (30 days)
  const socialMetrics = []
  for (const profile of createdProfiles) {
    let followers = profile.followers
    for (let day = 30; day >= 0; day--) {
      const change = randomInt(-50, 100)
      followers = Math.max(0, followers + change)
      socialMetrics.push({
        profileId: profile.id,
        date: daysAgo(day),
        followers,
        followersChange: change,
        impressions: randomInt(1000, 50000),
        engagements: randomInt(50, 2000),
        reach: randomInt(500, 25000),
      })
    }
  }
  await prisma.socialMetric.createMany({ data: socialMetrics })
  console.log(`   Created ${socialMetrics.length} social metrics`)

  // Advertising Toolkit
  console.log('📢 Creating advertising toolkit data...')
  const ppcKeywords = []
  
  for (const kw of keywords.slice(0, 500)) {
    ppcKeywords.push({
      keyword: kw.keyword,
      volume: kw.volume,
      cpc: kw.cpc,
      competition: randomFloat(0.1, 1.0, 2),
      competitorAds: randomInt(0, 20),
      trend: JSON.stringify(Array.from({ length: 12 }, () => randomInt(50, 150))),
      lastSeen: daysAgo(randomInt(0, 7)),
      adCopies: JSON.stringify([
        { headline: `Best ${kw.keyword}`, description: 'Shop now and save!' },
        { headline: `${kw.keyword} Deals`, description: 'Limited time offer.' },
      ]),
    })
  }
  await prisma.ppcKeyword.createMany({ data: ppcKeywords })
  console.log(`   Created ${ppcKeywords.length} PPC keywords`)

  // Ad Campaigns
  const adCampaigns = []
  const campaignTypes = ['search', 'display', 'shopping', 'video', 'app']
  const campaignStatuses = ['active', 'paused', 'ended', 'draft']
  
  for (const domain of domains.slice(0, 50)) {
    for (let i = 0; i < randomInt(1, 5); i++) {
      adCampaigns.push({
        domain: domain.domain,
        platform: randomChoice(['Google Ads', 'Bing Ads', 'Facebook Ads']),
        campaignType: randomChoice(campaignTypes),
        budget: randomFloat(100, 10000, 2),
        startDate: daysAgo(randomInt(30, 365)),
        endDate: Math.random() > 0.5 ? daysAgo(randomInt(0, 30)) : null,
        status: randomChoice(campaignStatuses),
        impressions: randomInt(1000, 1000000),
        clicks: randomInt(100, 50000),
        conversions: randomInt(10, 1000),
        spend: randomFloat(100, 5000, 2),
      })
    }
  }
  const createdCampaigns = await prisma.adCampaign.createMany({ data: adCampaigns })
  const campaignIds = await prisma.adCampaign.findMany({ select: { id: true } })
  console.log(`   Created ${adCampaigns.length} ad campaigns`)

  // Ad Creatives
  const adCreatives = []
  const adFormats = ['text', 'responsive', 'image', 'video', 'carousel']
  
  for (const campaign of campaignIds) {
    for (let i = 0; i < randomInt(2, 8); i++) {
      adCreatives.push({
        campaignId: campaign.id,
        headline: `${randomChoice(['Save', 'Shop', 'Get', 'Try', 'Discover'])} ${randomChoice(['Now', 'Today', 'Big', 'Best', 'Top'])}!`,
        description: 'Limited time offer. Free shipping on orders over $50.',
        displayUrl: `example.com/${randomChoice(['sale', 'deals', 'shop', 'offer'])}`,
        finalUrl: 'https://example.com/landing',
        imageUrl: null,
        format: randomChoice(adFormats),
        impressions: randomInt(100, 100000),
        clicks: randomInt(10, 5000),
        ctr: randomFloat(0.5, 5.0, 2),
        firstSeen: daysAgo(randomInt(30, 365)),
        lastSeen: daysAgo(randomInt(0, 30)),
      })
    }
  }
  await prisma.adCreative.createMany({ data: adCreatives })
  console.log(`   Created ${adCreatives.length} ad creatives`)

  // Traffic & Market Data
  console.log('📊 Creating traffic & market data...')
  const trafficData = []
  
  for (const domain of domains.slice(0, 100)) {
    for (let day = 30; day >= 0; day--) {
      trafficData.push({
        domain: domain.domain,
        date: daysAgo(day),
        visits: randomInt(100, 50000),
        pageViews: randomInt(200, 150000),
        bounceRate: randomFloat(20, 80, 1),
        avgDuration: randomInt(30, 300),
        pagesPerVisit: randomFloat(1.5, 5.0, 1),
        directTraffic: randomFloat(10, 40, 1),
        searchTraffic: randomFloat(30, 60, 1),
        socialTraffic: randomFloat(5, 20, 1),
        referralTraffic: randomFloat(5, 15, 1),
        paidTraffic: randomFloat(0, 20, 1),
      })
    }
  }
  await prisma.trafficData.createMany({ data: trafficData })
  console.log(`   Created ${trafficData.length} traffic data points`)

  // Market Data
  const marketData = []
  for (const industry of createdIndustries) {
    const industryDomains = domains.filter(d => d.industrySlug === industry.slug).slice(0, 10)
    for (const domain of industryDomains) {
      for (let day = 30; day >= 0; day++) {
        marketData.push({
          industrySlug: industry.slug,
          domain: domain.domain,
          marketShare: randomFloat(1, 25, 2),
          traffic: randomInt(1000, 500000),
          growthRate: randomFloat(-10, 20, 1),
          date: daysAgo(day),
        })
      }
    }
  }
  await prisma.marketData.createMany({ data: marketData })
  console.log(`   Created ${marketData.length} market data points`)

  // AI Visibility & PR
  console.log('🤖 Creating AI visibility data...')
  const aiPlatforms = ['ChatGPT', 'Claude', 'Perplexity', 'Gemini', 'Copilot']
  const aiMentions = []
  
  for (const domain of domains.slice(0, 50)) {
    for (const platform of aiPlatforms) {
      for (let i = 0; i < randomInt(3, 10); i++) {
        const mentioned = Math.random() > 0.4
        aiMentions.push({
          brand: domain.domain.split('.')[0],
          aiPlatform: platform,
          query: `Best ${randomChoice(keywords).keyword}`,
          mentioned,
          position: mentioned ? randomInt(1, 10) : null,
          sentiment: randomChoice(['positive', 'neutral', 'negative']),
          context: mentioned ? `${domain.domain} is mentioned as a leading provider...` : null,
          competitors: JSON.stringify(domains.slice(0, 5).map(d => d.domain)),
          checkedAt: daysAgo(randomInt(0, 7)),
        })
      }
    }
  }
  await prisma.aIMention.createMany({ data: aiMentions })
  console.log(`   Created ${aiMentions.length} AI mentions`)

  // AI PR Campaigns
  const aiPrCampaigns = []
  const prStatuses = ['draft', 'active', 'paused', 'completed']
  
  for (const domain of domains.slice(0, 30)) {
    aiPrCampaigns.push({
      name: `${domain.domain.split('.')[0]} Brand Awareness`,
      brand: domain.domain.split('.')[0],
      status: randomChoice(prStatuses),
      targetAudience: JSON.stringify(['Tech enthusiasts', 'Business professionals', 'Early adopters']),
      keyMessages: JSON.stringify(['Innovation', 'Quality', 'Trust']),
      mediaOutlets: JSON.stringify(['TechCrunch', 'Forbes', 'Business Insider']),
      pitchTemplate: 'Dear [Editor], We are excited to share our latest...',
      sentCount: randomInt(0, 100),
      openCount: randomInt(0, 50),
      replyCount: randomInt(0, 20),
      placementCount: randomInt(0, 5),
    })
  }
  await prisma.aIPrCampaign.createMany({ data: aiPrCampaigns })
  console.log(`   Created ${aiPrCampaigns.length} AI PR campaigns`)

  console.log('\n✅ Seed complete!')
  console.log('Summary:')
  console.log(`  - Industries: ${createdIndustries.length}`)
  console.log(`  - Domains: ${domains.length}`)
  console.log(`  - Keywords: ${keywords.length}`)
  console.log(`  - Backlinks: ${backlinkCount}`)
  console.log(`  - Audit URLs: ${auditUrlCount}`)
  console.log(`  - Tracked Keywords: ${trackedCount}`)
  console.log(`  - Rank History: ${historyCount}`)
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
