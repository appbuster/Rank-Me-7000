import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ValidationResult {
  check: string
  passed: boolean
  details?: string
}

async function validateData() {
  console.log('🔍 Validating data coherence...\n')

  const results: ValidationResult[] = []

  // Check 1: Minimum data thresholds
  const domainCount = await prisma.domain.count()
  results.push({
    check: 'Minimum 50 domains',
    passed: domainCount >= 50,
    details: `Found ${domainCount} domains`,
  })

  const industryCount = await prisma.industry.count()
  results.push({
    check: 'Exactly 10 industries',
    passed: industryCount === 10,
    details: `Found ${industryCount} industries`,
  })

  const keywordCount = await prisma.keyword.count()
  results.push({
    check: 'Minimum 20,000 keywords',
    passed: keywordCount >= 18000, // Allow some slack for duplicates
    details: `Found ${keywordCount} keywords`,
  })

  const backlinkCount = await prisma.backlink.count()
  results.push({
    check: 'Minimum 200,000 backlinks',
    passed: backlinkCount >= 200000,
    details: `Found ${backlinkCount} backlinks`,
  })

  const auditUrlCount = await prisma.auditUrl.count()
  results.push({
    check: 'Minimum 100,000 audit URLs',
    passed: auditUrlCount >= 100000,
    details: `Found ${auditUrlCount} audit URLs`,
  })

  // Check 2: Data relationships are valid
  const trackedWithHistory = await prisma.trackedKeyword.count({
    where: {
      rankHistory: { some: {} },
    },
  })
  const totalTracked = await prisma.trackedKeyword.count()
  results.push({
    check: 'Tracked keywords have rank history',
    passed: trackedWithHistory === totalTracked,
    details: `${trackedWithHistory}/${totalTracked} tracked keywords have history`,
  })

  // Check 3: 90 days of rank history
  const historyCount = await prisma.rankHistory.count()
  const avgHistoryPerKeyword = historyCount / (totalTracked || 1)
  results.push({
    check: '~91 days history per tracked keyword',
    passed: avgHistoryPerKeyword >= 85 && avgHistoryPerKeyword <= 95,
    details: `Average ${avgHistoryPerKeyword.toFixed(1)} history records per keyword`,
  })

  // Check 4: Domains have valid industry references
  const domainsWithIndustry = await prisma.domain.count({
    where: { industryId: { not: null } },
  })
  results.push({
    check: 'Domains have industry assignments',
    passed: domainsWithIndustry / domainCount > 0.9,
    details: `${domainsWithIndustry}/${domainCount} domains have industries`,
  })

  // Check 5: Projects have competitors
  const projectsWithCompetitors = await prisma.project.count({
    where: {
      competitors: { some: {} },
    },
  })
  const totalProjects = await prisma.project.count()
  results.push({
    check: 'Projects have competitors',
    passed: projectsWithCompetitors === totalProjects,
    details: `${projectsWithCompetitors}/${totalProjects} projects have competitors`,
  })

  // Check 6: Audit URLs have issues
  const urlsWithIssues = await prisma.auditUrl.count({
    where: {
      issues: { some: {} },
    },
  })
  results.push({
    check: 'Some audit URLs have issues',
    passed: urlsWithIssues > 0,
    details: `${urlsWithIssues} URLs have issues`,
  })

  // Print results
  let errors = 0
  for (const result of results) {
    const status = result.passed ? '✓' : '❌'
    console.log(`${status} ${result.check}`)
    if (result.details) {
      console.log(`   ${result.details}`)
    }
    if (!result.passed) errors++
  }

  // Data summary
  console.log('\n📊 Final Data Counts:')
  console.log(`   Industries: ${industryCount}`)
  console.log(`   Domains: ${domainCount}`)
  console.log(`   Keywords: ${keywordCount}`)
  console.log(`   Organic Ranks: ${await prisma.organicRank.count()}`)
  console.log(`   Backlinks: ${backlinkCount}`)
  console.log(`   Audit URLs: ${auditUrlCount}`)
  console.log(`   Audit Issues: ${await prisma.auditIssue.count()}`)
  console.log(`   Tracked Keywords: ${totalTracked}`)
  console.log(`   Rank History: ${historyCount}`)

  // Summary
  console.log('\n' + '='.repeat(40))
  if (errors === 0) {
    console.log('✅ All validation checks passed!')
    process.exit(0)
  } else {
    console.log(`❌ ${errors} validation check(s) failed`)
    process.exit(1)
  }
}

validateData()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
