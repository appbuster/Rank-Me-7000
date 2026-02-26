/**
 * Route Configuration - Single source of truth for all routes
 * Generated ROUTES.md must match this exactly
 */

export interface RouteConfig {
  path: string
  name: string
  description: string
  icon?: string
  parent?: string
}

export interface NavGroup {
  id: string
  label: string
  icon: string
  defaultOpen?: boolean
  routes: RouteConfig[]
  subgroups?: NavGroup[]
}

// All routes in the application
export const routes: Record<string, RouteConfig> = {
  // Dashboard
  dashboard: {
    path: '/dashboard',
    name: 'Dashboard',
    description: 'KPI snapshot widgets across projects',
    icon: 'LayoutDashboard',
  },

  // Projects
  projects: {
    path: '/projects',
    name: 'Projects',
    description: 'List all projects',
    icon: 'Folder',
  },
  projectsNew: {
    path: '/projects/new',
    name: 'Create Project',
    description: 'Project creation wizard',
    parent: 'projects',
  },

  // SEO - Competitive Research
  domainOverview: {
    path: '/seo/competitive/domain-overview',
    name: 'Domain Overview',
    description: 'Domain summary with all metrics',
  },
  compareDomains: {
    path: '/seo/competitive/compare-domains',
    name: 'Compare Domains',
    description: 'Side-by-side comparison',
  },
  organicRankings: {
    path: '/seo/competitive/organic-rankings',
    name: 'Organic Rankings',
    description: 'Keywords domain ranks for',
  },
  topPages: {
    path: '/seo/competitive/top-pages',
    name: 'Top Pages',
    description: 'Highest traffic pages',
  },
  keywordGap: {
    path: '/seo/competitive/keyword-gap',
    name: 'Keyword Gap',
    description: 'Compare up to 5 domains',
  },
  backlinkGap: {
    path: '/seo/competitive/backlink-gap',
    name: 'Backlink Gap',
    description: 'Compare backlink profiles',
  },

  // SEO - Keyword Research
  keywordOverview: {
    path: '/seo/keywords/keyword-overview',
    name: 'Keyword Overview',
    description: 'Single keyword analysis',
  },
  keywordMagic: {
    path: '/seo/keywords/keyword-magic',
    name: 'Keyword Magic Tool',
    description: 'Keyword discovery with groups',
  },
  keywordStrategy: {
    path: '/seo/keywords/keyword-strategy',
    name: 'Keyword Strategy Builder',
    description: 'Build keyword lists',
  },
  positionTracking: {
    path: '/seo/keywords/position-tracking',
    name: 'Position Tracking',
    description: 'Track rankings over time',
  },
  positionTrackingSetup: {
    path: '/seo/keywords/position-tracking/setup',
    name: 'Position Tracking Setup',
    description: 'Setup wizard',
    parent: 'positionTracking',
  },
  organicTrafficInsights: {
    path: '/seo/keywords/organic-traffic-insights',
    name: 'Organic Traffic Insights',
    description: 'GA integration view',
  },

  // SEO - Link Building
  backlinks: {
    path: '/seo/links/backlinks',
    name: 'Backlinks Tool',
    description: 'Backlink analysis',
  },
  backlinkAudit: {
    path: '/seo/links/backlink-audit',
    name: 'Backlink Audit',
    description: 'Toxicity analysis',
  },
  linkBuilding: {
    path: '/seo/links/link-building',
    name: 'Link Building Tool',
    description: 'Outreach workflow',
  },

  // SEO - Technical
  siteAudit: {
    path: '/seo/technical/site-audit',
    name: 'Site Audit',
    description: 'Technical health check',
  },
  onPageChecker: {
    path: '/seo/technical/on-page-checker',
    name: 'On Page SEO Checker',
    description: 'Page optimization',
  },
  logAnalyzer: {
    path: '/seo/technical/log-analyzer',
    name: 'Log File Analyzer',
    description: 'Server log analysis',
  },

  // SEO - Content
  writingAssistant: {
    path: '/seo/content/writing-assistant',
    name: 'SEO Writing Assistant',
    description: 'Content optimization',
  },
  topicResearch: {
    path: '/seo/content/topic-research',
    name: 'Topic Research',
    description: 'Topic discovery',
  },
  contentTemplate: {
    path: '/seo/content/content-template',
    name: 'SEO Content Template',
    description: 'Content briefs',
  },

  // SEO - Extras
  sensor: {
    path: '/seo/extras/sensor',
    name: 'Sensor',
    description: 'SERP volatility tracker',
  },
  seoquake: {
    path: '/seo/extras/seoquake',
    name: 'SEOquake',
    description: 'Quick analysis tool',
  },
  rank: {
    path: '/seo/extras/rank',
    name: 'Rank Me Rank',
    description: 'Domain ranking tracker',
  },

  // Traffic & Market
  trafficAnalytics: {
    path: '/traffic/analytics',
    name: 'Traffic Analytics',
    description: 'Website traffic data',
  },
  dailyTraffic: {
    path: '/traffic/daily',
    name: 'Daily Traffic',
    description: 'Day-by-day breakdown',
  },
  trafficDistribution: {
    path: '/traffic/distribution',
    name: 'Traffic Distribution',
    description: 'Source breakdown',
  },
  pagesCategories: {
    path: '/traffic/pages',
    name: 'Pages and Categories',
    description: 'Top content',
  },
  regionalTrends: {
    path: '/traffic/regional',
    name: 'Regional Trends',
    description: 'Geographic data',
  },
  audienceProfile: {
    path: '/traffic/audience',
    name: 'Audience Profile',
    description: 'Demographics',
  },
  marketOverview: {
    path: '/traffic/market-overview',
    name: 'Market Overview',
    description: 'Industry benchmarks',
  },
  eyeon: {
    path: '/traffic/eyeon',
    name: 'EyeOn',
    description: 'Competitor monitoring',
  },

  // Content Toolkit
  topicFinder: {
    path: '/content/topic-finder',
    name: 'Topic Finder',
    description: 'Content ideas',
  },
  seoBrief: {
    path: '/content/seo-brief',
    name: 'SEO Brief Generator',
    description: 'Brief creation',
  },
  aiArticle: {
    path: '/content/ai-article',
    name: 'AI Article Generator',
    description: 'AI writing',
  },
  aiSearch: {
    path: '/content/ai-search',
    name: 'AI Search Optimizer',
    description: 'Search optimization',
  },
  repurposing: {
    path: '/content/repurposing',
    name: 'Content Repurposing',
    description: 'Repurpose content',
  },

  // Local Toolkit
  listings: {
    path: '/local/listings',
    name: 'Listing Management',
    description: 'Business listings',
  },
  reviews: {
    path: '/local/reviews',
    name: 'Review Management',
    description: 'Review monitoring',
  },
  mapRank: {
    path: '/local/map-rank',
    name: 'Map Rank Tracker',
    description: 'Local pack tracking',
  },
  gbp: {
    path: '/local/gbp',
    name: 'GBP Optimization',
    description: 'Google Business Profile',
  },
  gbpAgent: {
    path: '/local/gbp-agent',
    name: 'GBP AI Agent',
    description: 'AI-powered GBP',
  },

  // Social Toolkit
  socialPoster: {
    path: '/social/poster',
    name: 'Social Poster',
    description: 'Post scheduling',
  },
  socialTracker: {
    path: '/social/tracker',
    name: 'Social Tracker',
    description: 'Competitor tracking',
  },
  socialInsights: {
    path: '/social/insights',
    name: 'Social Content Insights',
    description: 'Content performance',
  },
  socialAnalytics: {
    path: '/social/analytics',
    name: 'Social Analytics',
    description: 'Account analytics',
  },
  socialContentAi: {
    path: '/social/content-ai',
    name: 'Social Content AI',
    description: 'AI content creation',
  },
  influencer: {
    path: '/social/influencer',
    name: 'Influencer Analytics',
    description: 'Influencer research',
  },
  mediaMonitoring: {
    path: '/social/monitoring',
    name: 'Media Monitoring',
    description: 'Brand mentions',
  },

  // Advertising Toolkit
  advertisingResearch: {
    path: '/advertising/research',
    name: 'Advertising Research',
    description: 'Competitor ad research',
  },
  ppcKeywords: {
    path: '/advertising/ppc-keywords',
    name: 'PPC Keyword Tool',
    description: 'Paid keyword research',
  },
  adsHistory: {
    path: '/advertising/ads-history',
    name: 'Ads History',
    description: 'Historical ad data',
  },
  pla: {
    path: '/advertising/pla',
    name: 'PLA Research',
    description: 'Shopping ads',
  },
  adsLaunch: {
    path: '/advertising/launch',
    name: 'Ads Launch Assistant',
    description: 'Campaign creation',
  },
  adclarity: {
    path: '/advertising/adclarity',
    name: 'AdClarity',
    description: 'Display ad intelligence',
  },

  // AI Visibility
  aiVisibilityOverview: {
    path: '/ai-visibility/overview',
    name: 'AI Visibility Overview',
    description: 'AI platform presence',
  },
  aiSentiment: {
    path: '/ai-visibility/sentiment',
    name: 'AI Sentiment',
    description: 'Brand sentiment in AI',
  },
  aiTracking: {
    path: '/ai-visibility/tracking',
    name: 'AI Tracking',
    description: 'Track AI mentions',
  },

  // AI PR
  prCampaigns: {
    path: '/ai-pr/campaigns',
    name: 'PR Campaigns',
    description: 'Campaign management',
  },
  mediaVisibility: {
    path: '/ai-pr/media',
    name: 'Media Visibility',
    description: 'Press coverage',
  },
  prOutreach: {
    path: '/ai-pr/outreach',
    name: 'PR Outreach',
    description: 'Journalist outreach',
  },

  // My Reports
  reports: {
    path: '/reports',
    name: 'My Reports',
    description: 'Report dashboard',
  },
  reportsNew: {
    path: '/reports/new',
    name: 'Create Report',
    description: 'Report builder',
    parent: 'reports',
  },
  reportTemplates: {
    path: '/reports/templates',
    name: 'Report Templates',
    description: 'Template library',
    parent: 'reports',
  },
  reportSchedule: {
    path: '/reports/schedule',
    name: 'Report Schedule',
    description: 'Scheduled reports',
    parent: 'reports',
  },

  // Lead Generation
  leads: {
    path: '/leads',
    name: 'Lead Generation',
    description: 'Lead dashboard',
  },
  leadWidgets: {
    path: '/leads/widgets',
    name: 'Lead Widgets',
    description: 'Widget builder',
    parent: 'leads',
  },
  leadsInbox: {
    path: '/leads/inbox',
    name: 'Leads Inbox',
    description: 'Captured leads',
    parent: 'leads',
  },

  // Settings
  settings: {
    path: '/settings',
    name: 'Settings',
    description: 'Account settings',
  },
  settingsProfile: {
    path: '/settings/profile',
    name: 'Profile',
    description: 'User profile',
    parent: 'settings',
  },
  settingsWorkspaces: {
    path: '/settings/workspaces',
    name: 'Workspaces',
    description: 'Workspace management',
    parent: 'settings',
  },
  settingsIntegrations: {
    path: '/settings/integrations',
    name: 'Integrations',
    description: 'Third-party connections',
    parent: 'settings',
  },
}

// Navigation structure
export const navigation: NavGroup[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    routes: [routes.dashboard],
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: 'Folder',
    routes: [routes.projects],
  },
  {
    id: 'seo',
    label: 'SEO Toolkit',
    icon: 'Search',
    defaultOpen: true,
    routes: [],
    subgroups: [
      {
        id: 'seo-competitive',
        label: 'Competitive Research',
        icon: 'Target',
        routes: [
          routes.domainOverview,
          routes.compareDomains,
          routes.organicRankings,
          routes.topPages,
          routes.keywordGap,
          routes.backlinkGap,
        ],
      },
      {
        id: 'seo-keywords',
        label: 'Keyword Research',
        icon: 'Key',
        routes: [
          routes.keywordOverview,
          routes.keywordMagic,
          routes.keywordStrategy,
          routes.positionTracking,
          routes.organicTrafficInsights,
        ],
      },
      {
        id: 'seo-links',
        label: 'Link Building',
        icon: 'Link',
        routes: [routes.backlinks, routes.backlinkAudit, routes.linkBuilding],
      },
      {
        id: 'seo-technical',
        label: 'On Page & Technical',
        icon: 'Settings',
        routes: [routes.siteAudit, routes.onPageChecker, routes.logAnalyzer],
      },
      {
        id: 'seo-content',
        label: 'Content Ideas',
        icon: 'FileText',
        routes: [routes.writingAssistant, routes.topicResearch, routes.contentTemplate],
      },
      {
        id: 'seo-extras',
        label: 'Extras',
        icon: 'Sparkles',
        routes: [routes.sensor, routes.seoquake, routes.rank],
      },
    ],
  },
  {
    id: 'traffic',
    label: 'Traffic & Market',
    icon: 'TrendingUp',
    routes: [
      routes.trafficAnalytics,
      routes.dailyTraffic,
      routes.trafficDistribution,
      routes.pagesCategories,
      routes.regionalTrends,
      routes.audienceProfile,
      routes.marketOverview,
      routes.eyeon,
    ],
  },
  {
    id: 'content',
    label: 'Content',
    icon: 'PenTool',
    routes: [
      routes.topicFinder,
      routes.seoBrief,
      routes.aiArticle,
      routes.aiSearch,
      routes.repurposing,
    ],
  },
  {
    id: 'local',
    label: 'Local',
    icon: 'MapPin',
    routes: [routes.listings, routes.reviews, routes.mapRank, routes.gbp, routes.gbpAgent],
  },
  {
    id: 'social',
    label: 'Social',
    icon: 'Share2',
    routes: [
      routes.socialPoster,
      routes.socialTracker,
      routes.socialInsights,
      routes.socialAnalytics,
      routes.socialContentAi,
      routes.influencer,
      routes.mediaMonitoring,
    ],
  },
  {
    id: 'advertising',
    label: 'Advertising',
    icon: 'Megaphone',
    routes: [
      routes.advertisingResearch,
      routes.ppcKeywords,
      routes.adsHistory,
      routes.pla,
      routes.adsLaunch,
      routes.adclarity,
    ],
  },
  {
    id: 'ai-visibility',
    label: 'AI Visibility',
    icon: 'Bot',
    routes: [routes.aiVisibilityOverview, routes.aiSentiment, routes.aiTracking],
  },
  {
    id: 'ai-pr',
    label: 'AI PR',
    icon: 'Newspaper',
    routes: [routes.prCampaigns, routes.mediaVisibility, routes.prOutreach],
  },
  {
    id: 'reports',
    label: 'My Reports',
    icon: 'FileBarChart',
    routes: [routes.reports],
  },
  {
    id: 'leads',
    label: 'Lead Generation',
    icon: 'Users',
    routes: [routes.leads],
  },
]

// Get total route count
export function getRouteCount(): number {
  return Object.keys(routes).length
}

// Generate routes list for verification
export function getAllRoutePaths(): string[] {
  return Object.values(routes).map((r) => r.path)
}
