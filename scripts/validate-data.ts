import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function validateData() {
  console.log('🔍 Validating data coherence...\n')
  
  let errors = 0
  
  // Check 1: No orphan keywords (keywords without any rankings)
  const orphanKeywords = await prisma.keyword.count({
    where: {
      organicRanks: { none: {} }
    }
  })
  if (orphanKeywords > 0) {
    console.log(`❌ Found ${orphanKeywords} keywords without domain rankings`)
    errors++
  } else {
    console.log('✓ All keywords have domain rankings')
  }
  
  // Check 2: Tracked keywords reference valid keywords
  const trackedCount = await prisma.trackedKeyword.count()
  const validTracked = await prisma.trackedKeyword.count({
    where: {
      keyword: { isNot: undefined }
    }
  })
  if (trackedCount !== validTracked) {
    console.log(`❌ Found ${trackedCount - validTracked} tracked keywords without keyword reference`)
    errors++
  } else {
    console.log('✓ All tracked keywords have keyword references')
  }
  
  // Check 3: Rank history entries reference valid tracked keywords
  const historyCount = await prisma.rankHistory.count()
  const validHistory = await prisma.rankHistory.count({
    where: {
      trackedKeyword: { isNot: undefined }
    }
  })
  if (historyCount !== validHistory) {
    console.log(`❌ Found ${historyCount - validHistory} rank history entries without tracked keyword`)
    errors++
  } else {
    console.log('✓ All rank history entries have tracked keywords')
  }
  
  // Check 4: Audit issues reference valid URLs
  const issueCount = await prisma.auditIssue.count()
  const validIssues = await prisma.auditIssue.count({
    where: {
      auditUrl: { isNot: undefined }
    }
  })
  if (issueCount !== validIssues) {
    console.log(`❌ Found ${issueCount - validIssues} audit issues without URL`)
    errors++
  } else {
    console.log('✓ All audit issues have valid URLs')
  }
  
  // Data counts
  console.log('\n📊 Data counts:')
  console.log(`   Industries: ${await prisma.industry.count()}`)
  console.log(`   Domains: ${await prisma.domain.count()}`)
  console.log(`   Keywords: ${await prisma.keyword.count()}`)
  console.log(`   Organic Ranks: ${await prisma.organicRank.count()}`)
  console.log(`   Backlinks: ${await prisma.backlink.count()}`)
  console.log(`   Audit URLs: ${await prisma.auditUrl.count()}`)
  console.log(`   Audit Issues: ${await prisma.auditIssue.count()}`)
  
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
