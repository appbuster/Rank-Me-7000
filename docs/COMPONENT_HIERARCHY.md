# Component Hierarchy

## Root Layout Structure

```
<RootLayout>
  ├── <ThemeProvider>
  ├── <QueryClientProvider>
  ├── <WorkspaceProvider>
  │
  ├── <div className="app-shell">
  │   ├── <Sidebar />
  │   ├── <main className="main-content">
  │   │   ├── <Header />
  │   │   └── <PageContent>
  │   │       └── {children}
  │   │   </PageContent>
  │   </main>
  │</div>
  │
  └── <Toaster />
</RootLayout>
```

## Sidebar Component

```
<Sidebar>
  ├── <SidebarHeader>
  │   └── <Logo />
  │   └── <CollapseButton />
  │
  ├── <SidebarNav>
  │   ├── <NavGroup label="Dashboard">
  │   │   └── <NavItem href="/dashboard" icon={LayoutDashboard} />
  │   │
  │   ├── <NavGroup label="Projects">
  │   │   └── <NavItem href="/projects" icon={Folder} />
  │   │
  │   ├── <NavGroup label="SEO Toolkit" collapsible defaultOpen>
  │   │   ├── <NavSubGroup label="Competitive Research">
  │   │   │   ├── <NavItem href="/seo/competitive/domain-overview" />
  │   │   │   ├── <NavItem href="/seo/competitive/compare-domains" />
  │   │   │   └── ...
  │   │   ├── <NavSubGroup label="Keyword Research">
  │   │   │   └── ...
  │   │   └── ...
  │   │
  │   ├── <NavGroup label="Traffic & Market" collapsible />
  │   ├── <NavGroup label="Content" collapsible />
  │   └── ...
  │
  └── <SidebarFooter>
      └── <UserMenu />
</Sidebar>
```

## Header Component

```
<Header>
  ├── <Breadcrumbs />
  │
  ├── <GlobalSearch>
  │   └── <SearchInput placeholder="Search domain or keyword..." />
  │   └── <SearchResults />
  │
  ├── <HeaderActions>
  │   ├── <WorkspaceSelector />
  │   ├── <ProjectSelector />
  │   ├── <NotificationBell />
  │   └── <UserMenu />
  │
  └── <MobileMenuToggle />
</Header>
```

## ReportLayout Component

All report pages use this consistent layout:

```
<ReportLayout
  title="Page Title"
  description="What this page does"
  breadcrumbs={[...]}
  actions={<ExportButton />}
>
  ├── <FilterBar>
  │   ├── <DomainInput />
  │   ├── <DateRangePicker />
  │   ├── <FilterDropdown label="Intent" />
  │   ├── <FilterDropdown label="KD Range" />
  │   └── <FilterReset />
  │
  ├── <KpiTileGrid>
  │   ├── <KpiTile title="Keywords" value={1234} change={+5%} />
  │   ├── <KpiTile title="Traffic" value="45K" change={-2%} />
  │   ├── <KpiTile title="Position" value="12.3" />
  │   └── <KpiTile title="Visibility" value="67%" />
  │
  ├── <ChartContainer title="Trend">
  │   └── <TimeSeriesChart data={...} />
  │
  ├── <VirtualizedDataTable>
  │   ├── columns={...}
  │   ├── data={...}
  │   ├── pagination
  │   ├── sorting
  │   └── filtering
  │
  └── <InsightsPanel>
      └── <InsightCard />
</ReportLayout>
```

## FilterBar Component

```
<FilterBar>
  ├── <FilterGroup>
  │   ├── <DomainInput
  │   │     value={domain}
  │   │     onChange={setDomain}
  │   │     suggestions={recentDomains}
  │   │   />
  │   │
  │   ├── <DateRangePicker
  │   │     presets={['7d', '30d', '90d', 'custom']}
  │   │     value={dateRange}
  │   │     onChange={setDateRange}
  │   │   />
  │   │
  │   ├── <FilterDropdown
  │   │     label="Intent"
  │   │     options={['Informational', 'Navigational', 'Commercial', 'Transactional']}
  │   │     multiple
  │   │   />
  │   │
  │   ├── <RangeFilter
  │   │     label="Volume"
  │   │     min={0}
  │   │     max={1000000}
  │   │   />
  │   │
  │   └── <RangeFilter label="KD" min={0} max={100} />
  │
  ├── <ActiveFilters />
  │
  └── <FilterActions>
      ├── <SaveFilterButton />
      └── <ClearFiltersButton />
</FilterBar>
```

## KpiTiles Component

```
<KpiTileGrid columns={4}>
  <KpiTile
    title="Total Keywords"
    value={formatNumber(12345)}
    change={{ value: 5.2, period: '30d' }}
    trend="up"
    icon={<Search />}
    tooltip="Total keywords in database"
  />
  
  <KpiTile
    title="Organic Traffic"
    value={formatNumber(456789)}
    change={{ value: -2.1, period: '30d' }}
    trend="down"
    icon={<TrendingUp />}
  />
  
  <KpiTile
    title="Authority Score"
    value={78}
    suffix="/100"
    icon={<Shield />}
  />
  
  <KpiTile
    title="Backlinks"
    value={formatNumber(98765)}
    icon={<Link />}
  />
</KpiTileGrid>
```

## ChartContainer Component

```
<ChartContainer
  title="Traffic Trend"
  subtitle="Last 90 days"
  actions={
    <ChartActions>
      <ChartTypeToggle types={['line', 'bar', 'area']} />
      <ChartExport formats={['png', 'csv']} />
    </ChartActions>
  }
>
  <TimeSeriesChart
    data={timeSeriesData}
    xAxis={{ key: 'date', format: 'MMM d' }}
    yAxis={{ key: 'value', format: 'compact' }}
    series={[
      { key: 'organic', label: 'Organic', color: '#3b82f6' },
      { key: 'paid', label: 'Paid', color: '#10b981' }
    ]}
    tooltip
    legend
  />
</ChartContainer>
```

## VirtualizedDataTable Component

```
<VirtualizedDataTable
  columns={[
    { key: 'keyword', header: 'Keyword', sortable: true, width: 300 },
    { key: 'intent', header: 'Intent', sortable: true, render: IntentBadge },
    { key: 'volume', header: 'Volume', sortable: true, align: 'right' },
    { key: 'kd', header: 'KD', sortable: true, render: KdBar },
    { key: 'cpc', header: 'CPC', sortable: true, format: 'currency' },
    { key: 'trend', header: 'Trend', render: SparklineCell },
    { key: 'actions', header: '', render: ActionsCell }
  ]}
  data={keywords}
  rowHeight={48}
  virtualizeThreshold={100}
  
  // Pagination
  pagination={{
    page: 1,
    pageSize: 50,
    total: 25000,
    pageSizes: [25, 50, 100]
  }}
  onPageChange={handlePageChange}
  
  // Sorting
  sortable
  defaultSort={{ key: 'volume', order: 'desc' }}
  onSort={handleSort}
  
  // Selection
  selectable
  selectedRows={selected}
  onSelect={handleSelect}
  
  // Actions
  bulkActions={[
    { label: 'Add to list', action: handleAddToList },
    { label: 'Export', action: handleExport }
  ]}
  
  // Row actions
  rowActions={[
    { icon: <Plus />, label: 'Add', action: handleAdd },
    { icon: <ExternalLink />, label: 'SERP', action: openSerp }
  ]}
/>
```

## InsightsPanel Component

```
<InsightsPanel title="Insights">
  <InsightCard
    type="opportunity"
    title="Keyword Gap Found"
    description="23 high-volume keywords your competitors rank for but you don't"
    action={{ label: 'View Keywords', href: '/seo/competitive/keyword-gap' }}
  />
  
  <InsightCard
    type="warning"
    title="Authority Drop"
    description="Your authority score dropped 3 points in the last week"
    action={{ label: 'View Backlinks', href: '/seo/links/backlinks' }}
  />
  
  <InsightCard
    type="success"
    title="Traffic Up"
    description="Organic traffic increased 12% this month"
  />
</InsightsPanel>
```

## Wizard Components

```
<Wizard
  steps={[
    { id: 'domain', title: 'Target Domain', component: DomainStep },
    { id: 'competitors', title: 'Competitors', component: CompetitorsStep },
    { id: 'keywords', title: 'Keywords', component: KeywordsStep },
    { id: 'settings', title: 'Settings', component: SettingsStep }
  ]}
  onComplete={handleComplete}
>
  <WizardHeader>
    <WizardProgress />
  </WizardHeader>
  
  <WizardContent>
    {currentStep.component}
  </WizardContent>
  
  <WizardFooter>
    <WizardBackButton />
    <WizardNextButton />
  </WizardFooter>
</Wizard>
```

## Component Dependencies

```
ReportLayout
├── depends on: Breadcrumbs, FilterBar, KpiTileGrid
│
FilterBar
├── depends on: DomainInput, DateRangePicker, FilterDropdown, RangeFilter
│
KpiTileGrid
├── depends on: KpiTile
│
ChartContainer
├── depends on: TimeSeriesChart, DistributionChart, etc.
│
VirtualizedDataTable
├── depends on: react-window, sorting utils, filter utils
│
Wizard
├── depends on: WizardContext, step components
```
