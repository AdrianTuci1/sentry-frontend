/**
 * Widget Spec System - Generative UI for Sentry Dashboard
 * 
 * Un LLM agent generează un spec JSON care descrie complet un dashboard.
 * Acest spec este consumat de WidgetRenderer care construiește UI-ul.
 * 
 * Structura spec:
 * {
 *   layout: 'server-monitor' | 'analytics' | 'campaign-sales',
 *   title: string,
 *   timeRange: { default: string, options: string[] },
 *   widgets: WidgetSpec[],
 *   queries: QuerySpec[]
 * }
 */

// ═══════════════════════════════════════════════════════════════
// TIPURI DE WIDGET (6 dimensiuni)
// ═══════════════════════════════════════════════════════════════

export const WIDGET_SIZES = {
  '1x1': { cols: 1, rows: 1, className: 'col-span-1 row-span-1' },
  '2x1': { cols: 2, rows: 1, className: 'col-span-2 row-span-1' },
  '1x2': { cols: 1, rows: 2, className: 'col-span-1 row-span-2' },
  '2x2': { cols: 2, rows: 2, className: 'col-span-2 row-span-2' },
  '4x1': { cols: 4, rows: 1, className: 'col-span-4 row-span-1' },
  '4x2': { cols: 4, rows: 2, className: 'col-span-4 row-span-2' },
};

export const WIDGET_TYPES = {
  // Metrică simplă: valoare + label + trend
  // Size: 1x1, 2x1
  METRIC: 'metric',

  // Sparkline: linie simplă fără axe
  // Size: 2x1, 2x2
  SPARKLINE: 'sparkline',

  // Bar chart: bare verticale sau orizontale
  // Size: 2x2, 4x2
  BAR_CHART: 'bar-chart',

  // Line chart: linie cu sau fără fill
  // Size: 2x2, 4x2
  LINE_CHART: 'line-chart',

  // Progress list: listă cu bară de progres per element
  // Size: 1x2, 2x2
  PROGRESS_LIST: 'progress-list',

  // Status list: listă cu badge-uri de status
  // Size: 1x2, 2x2, 4x2
  STATUS_LIST: 'status-list',

  // Pie/Doughnut: distribuție circulară
  // Size: 1x2, 2x2
  PIE_CHART: 'pie-chart',

  // Text/Insight: bloc de text cu highlight
  // Size: 1x1, 2x1, 2x2
  TEXT_INSIGHT: 'text-insight',

  // Segmented bar: bară orizontală segmentată (P50/P95/P99)
  // Size: 2x1, 2x2
  SEGMENTED_BAR: 'segmented-bar',

  // Heatmap: grid de celule colorate
  // Size: 2x2, 4x2
  HEATMAP: 'heatmap',

  // Custom widget types
  VISITORS_ONLINE: 'visitors-online',
  CORE_WEB_VITALS: 'core-web-vitals',
  STACKED_BAR_CHART: 'stacked-bar-chart',
  BUDGET_GAUGE: 'budget-gauge',
};

// ═══════════════════════════════════════════════════════════════
// EXEMPLE DE SPEC PENTRU FIECARE LAYOUT
// ═══════════════════════════════════════════════════════════════

export const serverMonitorSpec = {
  layout: 'server-monitor',
  title: 'Server Monitor',
  timeRange: {
    default: '1h',
    options: ['15m', '1h', '6h', '24h', '7d'],
  },
  widgets: [
    {
      id: 'cpu-usage',
      type: WIDGET_TYPES.METRIC,
      size: '1x1',
      title: 'CPU Usage',
      queryRef: 'cpu-current',
      config: {
        unit: '%',
        thresholds: { warning: 70, critical: 90 },
        sparkline: true,
      },
    },
    {
      id: 'memory-usage',
      type: WIDGET_TYPES.METRIC,
      size: '1x1',
      title: 'Memory',
      queryRef: 'memory-current',
      config: { unit: 'GB', sparkline: true },
    },
    {
      id: 'disk-io',
      type: WIDGET_TYPES.METRIC,
      size: '1x1',
      title: 'Disk I/O',
      queryRef: 'disk-io-current',
      config: { unit: 'MB/s', sparkline: true },
    },
    {
      id: 'network-io',
      type: WIDGET_TYPES.METRIC,
      size: '1x1',
      title: 'Network',
      queryRef: 'network-current',
      config: { unit: 'Mbps', sparkline: true },
    },
    {
      id: 'cpu-sparkline',
      type: WIDGET_TYPES.SPARKLINE,
      size: '2x2',
      title: 'CPU History',
      queryRef: 'cpu-history',
      config: { showAxes: true, fill: false },
    },
    {
      id: 'memory-sparkline',
      type: WIDGET_TYPES.SPARKLINE,
      size: '2x2',
      title: 'Memory History',
      queryRef: 'memory-history',
      config: { showAxes: true, fill: true },
    },
    {
      id: 'process-list',
      type: WIDGET_TYPES.PROGRESS_LIST,
      size: '2x2',
      title: 'Top Processes',
      queryRef: 'top-processes',
      config: { maxItems: 8, showValue: true },
    },
    {
      id: 'server-status',
      type: WIDGET_TYPES.STATUS_LIST,
      size: '2x2',
      title: 'Services',
      queryRef: 'service-status',
      config: { maxItems: 10 },
    },
    {
      id: 'latency-dist',
      type: WIDGET_TYPES.SEGMENTED_BAR,
      size: '4x1',
      title: 'Latency Distribution',
      queryRef: 'latency-percentiles',
      config: {
        segments: [
          { key: 'p50', label: 'P50', color: '#E4E4E7' },
          { key: 'p95', label: 'P95', color: '#6B7280' },
          { key: 'p99', label: 'P99', color: '#3F3F46' },
        ],
      },
    },
  ],
  queries: [
    {
      id: 'cpu-current',
      source: 'prometheus',
      template: 'avg(cpu_usage_percent{host=~"$host"})',
      params: ['host', 'timeRange'],
      refresh: '10s',
    },
    {
      id: 'cpu-history',
      source: 'prometheus',
      template: 'avg_over_time(cpu_usage_percent{host=~"$host"}[$__interval])',
      params: ['host', 'timeRange', 'resolution'],
      refresh: '30s',
    },
    {
      id: 'memory-current',
      source: 'prometheus',
      template: 'memory_used_bytes{host=~"$host"} / memory_total_bytes{host=~"$host"} * 100',
      params: ['host', 'timeRange'],
      refresh: '10s',
    },
    {
      id: 'top-processes',
      source: 'prometheus',
      template: 'topk(8, process_cpu_usage{host=~"$host"})',
      params: ['host', 'timeRange'],
      refresh: '30s',
    },
    {
      id: 'latency-percentiles',
      source: 'prometheus',
      template: 'histogram_quantile(0.5, rate(request_duration_seconds_bucket{host=~"$host"}[$timeRange]))',
      params: ['host', 'timeRange'],
      refresh: '30s',
    },
    {
      id: 'service-status',
      source: 'api',
      template: '/api/v1/services?host=$host',
      params: ['host'],
      refresh: '60s',
    },
  ],
};

export const analyticsSpec = {
  layout: 'analytics',
  title: 'Web Analytics',
  timeRange: {
    default: '24h',
    options: ['1h', '24h', '7d', '30d', '90d'],
  },
  widgets: [
    // Row 1: Total Visitors (wide) & Visitors Online: Desktop, Mobile, Tablet
    {
      id: 'total-visitors',
      type: WIDGET_TYPES.METRIC,
      size: '2x1',
      title: 'Total Visitors',
      queryRef: 'total-visitors',
      config: { sparkline: true },
    },
    {
      id: 'visitors-online',
      type: WIDGET_TYPES.VISITORS_ONLINE,
      size: '2x1',
      title: 'Visitors Online',
      queryRef: 'visitors-online',
      config: {},
    },
    // Row 2: Top Pages & Top Countries
    {
      id: 'top-pages',
      type: WIDGET_TYPES.PROGRESS_LIST,
      size: '2x2',
      title: 'Top Pages (Routes)',
      queryRef: 'top-pages',
      config: { maxItems: 6, showValue: true },
    },
    {
      id: 'top-countries',
      type: WIDGET_TYPES.PROGRESS_LIST,
      size: '2x2',
      title: 'Top Countries',
      queryRef: 'top-countries',
      config: { maxItems: 6, showPercent: true },
    },
    // Row 3: Sessions by Source, Audience Mix, Browsers, Top Referrers
    {
      id: 'sessions-by-source',
      type: WIDGET_TYPES.PROGRESS_LIST,
      size: '1x2',
      title: 'Sessions by Source',
      queryRef: 'sessions-by-source',
      config: { maxItems: 5, showPercent: true },
    },
    {
      id: 'audience-mix',
      type: WIDGET_TYPES.PIE_CHART,
      size: '1x2',
      title: 'Audience Mix',
      queryRef: 'audience-mix',
      config: { donut: true },
    },
    {
      id: 'browsers',
      type: WIDGET_TYPES.PROGRESS_LIST,
      size: '1x2',
      title: 'Browsers',
      queryRef: 'browsers',
      config: { maxItems: 5, showPercent: true },
    },
    {
      id: 'referrers',
      type: WIDGET_TYPES.PROGRESS_LIST,
      size: '1x2',
      title: 'Top Referrers',
      queryRef: 'referrers',
      config: { maxItems: 5, showValue: true },
    },
    // Row 4: Core Web Vitals
    {
      id: 'core-web-vitals',
      type: WIDGET_TYPES.CORE_WEB_VITALS,
      size: '4x1',
      title: 'Core Web Vitals',
      queryRef: 'core-web-vitals',
      config: {},
    },
  ],
  queries: [
    {
      id: 'total-visitors',
      source: 'analytics',
      template: 'SELECT COUNT(DISTINCT visitor_id) FROM pageviews WHERE timestamp >= $__timeFrom',
      params: ['timeRange'],
      refresh: '60s',
    },
    {
      id: 'visitors-online',
      source: 'api',
      template: '/api/v1/visitors/online',
      params: [],
      refresh: '10s',
    },
    {
      id: 'top-pages',
      source: 'analytics',
      template: 'SELECT path, COUNT(*) as views FROM pageviews WHERE timestamp >= $__timeFrom GROUP BY path ORDER BY views DESC LIMIT 6',
      params: ['timeRange'],
      refresh: '300s',
    },
    {
      id: 'top-countries',
      source: 'analytics',
      template: 'SELECT country, COUNT(*) as views FROM pageviews WHERE timestamp >= $__timeFrom GROUP BY country ORDER BY views DESC LIMIT 6',
      params: ['timeRange'],
      refresh: '300s',
    },
    {
      id: 'sessions-by-source',
      source: 'analytics',
      template: 'SELECT source, COUNT(*) as sessions FROM sessions WHERE timestamp >= $__timeFrom GROUP BY source ORDER BY sessions DESC LIMIT 5',
      params: ['timeRange'],
      refresh: '300s',
    },
    {
      id: 'audience-mix',
      source: 'analytics',
      template: 'SELECT user_type, COUNT(*) FROM sessions WHERE timestamp >= $__timeFrom GROUP BY user_type',
      params: ['timeRange'],
      refresh: '300s',
    },
    {
      id: 'browsers',
      source: 'analytics',
      template: 'SELECT browser, COUNT(*) FROM pageviews WHERE timestamp >= $__timeFrom GROUP BY browser',
      params: ['timeRange'],
      refresh: '300s',
    },
    {
      id: 'referrers',
      source: 'analytics',
      template: 'SELECT referrer, COUNT(*) FROM pageviews WHERE timestamp >= $__timeFrom GROUP BY referrer ORDER BY COUNT(*) DESC LIMIT 5',
      params: ['timeRange'],
      refresh: '300s',
    },
    {
      id: 'core-web-vitals',
      source: 'lighthouse',
      template: 'SELECT metric, value FROM web_vitals WHERE url = $url',
      params: ['url'],
      refresh: '600s',
    },
  ],
};

export const campaignSalesSpec = {
  layout: 'campaign-sales',
  title: 'Campaign Performance',
  timeRange: {
    default: '7d',
    options: ['24h', '7d', '30d', '90d'],
  },
  widgets: [
    {
      id: 'total-revenue',
      type: WIDGET_TYPES.METRIC,
      size: '1x1',
      title: 'Revenue',
      queryRef: 'revenue-total',
      config: { prefix: '$', sparkline: true },
    },
    {
      id: 'total-conversions',
      type: WIDGET_TYPES.METRIC,
      size: '1x1',
      title: 'Conversions',
      queryRef: 'conversions-total',
      config: { sparkline: true },
    },
    {
      id: 'conversion-rate',
      type: WIDGET_TYPES.METRIC,
      size: '1x1',
      title: 'Conv. Rate',
      queryRef: 'conversion-rate',
      config: { unit: '%', sparkline: true },
    },
    {
      id: 'roas',
      type: WIDGET_TYPES.METRIC,
      size: '1x1',
      title: 'ROAS',
      queryRef: 'roas',
      config: { sparkline: true },
    },
    {
      id: 'revenue-chart',
      type: WIDGET_TYPES.BAR_CHART,
      size: '4x2',
      title: 'Revenue by Campaign',
      queryRef: 'revenue-by-campaign',
      config: { orientation: 'vertical', stacked: true },
    },
    {
      id: 'funnel',
      type: WIDGET_TYPES.PROGRESS_LIST,
      size: '2x2',
      title: 'Conversion Funnel',
      queryRef: 'funnel-stages',
      config: { maxItems: 6, showPercent: true },
    },
    {
      id: 'campaign-status',
      type: WIDGET_TYPES.STATUS_LIST,
      size: '2x2',
      title: 'Active Campaigns',
      queryRef: 'active-campaigns',
      config: { maxItems: 10, showBudget: true },
    },
    {
      id: 'channel-breakdown',
      type: WIDGET_TYPES.PIE_CHART,
      size: '2x2',
      title: 'By Channel',
      queryRef: 'channel-breakdown',
      config: { donut: true },
    },
    {
      id: 'insight',
      type: WIDGET_TYPES.TEXT_INSIGHT,
      size: '2x2',
      title: 'AI Insight',
      queryRef: 'ai-insight',
      config: { highlightNumbers: true },
    },
  ],
  queries: [
    {
      id: 'revenue-total',
      source: 'warehouse',
      template: 'SELECT SUM(revenue) FROM conversions WHERE timestamp >= $__timeFrom',
      params: ['timeRange'],
      refresh: '300s',
    },
    {
      id: 'revenue-by-campaign',
      source: 'warehouse',
      template: 'SELECT campaign_name, SUM(revenue) as rev, SUM(spend) as spend FROM conversions WHERE timestamp >= $__timeFrom GROUP BY campaign_name',
      params: ['timeRange'],
      refresh: '300s',
    },
    {
      id: 'funnel-stages',
      source: 'warehouse',
      template: 'SELECT stage, COUNT(*) as count FROM funnel WHERE timestamp >= $__timeFrom GROUP BY stage ORDER BY stage_order',
      params: ['timeRange'],
      refresh: '300s',
    },
    {
      id: 'active-campaigns',
      source: 'api',
      template: '/api/v1/campaigns?status=active',
      params: [],
      refresh: '60s',
    },
  ],
};

export const marketingSpec = {
  layout: 'marketing-performance',
  title: 'Marketing Performance',
  timeRange: {
    default: '24h',
    options: ['24h', '7d', '30d', '90d'],
  },
  widgets: [
    {
      id: 'active-campaigns-total',
      type: WIDGET_TYPES.METRIC,
      size: '1x1',
      title: 'Active Campaigns',
      queryRef: 'active-campaigns-total',
      config: {},
    },
    {
      id: 'posts-published',
      type: WIDGET_TYPES.METRIC,
      size: '1x1',
      title: 'Posts Published',
      queryRef: 'posts-published',
      config: {},
    },
    {
      id: 'total-reach',
      type: WIDGET_TYPES.METRIC,
      size: '1x1',
      title: 'Total Reach',
      queryRef: 'total-reach',
      config: { compact: true },
    },
    {
      id: 'avg-engagement',
      type: WIDGET_TYPES.METRIC,
      size: '1x1',
      title: 'Avg. Engagement',
      queryRef: 'avg-engagement',
      config: { unit: '%' },
    },
    {
      id: 'gross-revenue',
      type: WIDGET_TYPES.STACKED_BAR_CHART,
      size: '4x2',
      title: 'Gross Revenue',
      queryRef: 'gross-revenue',
      config: { mode: 'overlay' },
    },
    {
      id: 'todays-budget',
      type: WIDGET_TYPES.BUDGET_GAUGE,
      size: '4x1',
      title: "Today's Budget",
      queryRef: 'todays-budget',
      config: {},
    },
  ],
  queries: [
    {
      id: 'active-campaigns-total',
      source: 'api',
      template: '/api/v1/campaigns/active/count',
      params: [],
      refresh: '60s',
    },
    {
      id: 'posts-published',
      source: 'api',
      template: '/api/v1/social/posts?window=$timeRange',
      params: ['timeRange'],
      refresh: '300s',
    },
    {
      id: 'total-reach',
      source: 'analytics',
      template: 'SELECT SUM(reach) FROM campaign_posts WHERE timestamp >= $__timeFrom',
      params: ['timeRange'],
      refresh: '300s',
    },
    {
      id: 'avg-engagement',
      source: 'analytics',
      template: 'SELECT AVG(engagement_rate) FROM campaign_posts WHERE timestamp >= $__timeFrom',
      params: ['timeRange'],
      refresh: '300s',
    },
    {
      id: 'gross-revenue',
      source: 'warehouse',
      template: 'SELECT hour_bucket, today_revenue, yesterday_revenue FROM marketing_gross_revenue WHERE timestamp >= $__timeFrom',
      params: ['timeRange'],
      refresh: '300s',
    },
    {
      id: 'todays-budget',
      source: 'warehouse',
      template: 'SELECT spent, allowance FROM daily_budget WHERE day = CURRENT_DATE',
      params: [],
      refresh: '60s',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// UTILITARE PENTRU GENERAREA SPEC-ULUI
// ═══════════════════════════════════════════════════════════════

export function createWidgetSpec(overrides = {}) {
  return {
    id: `widget_${Date.now()}`,
    type: WIDGET_TYPES.METRIC,
    size: '1x1',
    title: 'Untitled',
    queryRef: null,
    config: {},
    ...overrides,
  };
}

export function createQuerySpec(overrides = {}) {
  return {
    id: `query_${Date.now()}`,
    source: 'api',
    template: '',
    params: [],
    refresh: '60s',
    ...overrides,
  };
}

export function validateSpec(spec) {
  const errors = [];
  
  if (!spec.layout) errors.push('Missing layout');
  if (!spec.title) errors.push('Missing title');
  if (!Array.isArray(spec.widgets)) errors.push('Widgets must be an array');
  if (!Array.isArray(spec.queries)) errors.push('Queries must be an array');
  
  spec.widgets?.forEach((w, i) => {
    if (!w.id) errors.push(`Widget ${i}: missing id`);
    if (!WIDGET_TYPES[w.type]) errors.push(`Widget ${i}: invalid type "${w.type}"`);
    if (!WIDGET_SIZES[w.size]) errors.push(`Widget ${i}: invalid size "${w.size}"`);
    if (!w.queryRef) errors.push(`Widget ${i}: missing queryRef`);
  });
  
  const queryIds = new Set(spec.queries?.map(q => q.id) || []);
  spec.widgets?.forEach(w => {
    if (w.queryRef && !queryIds.has(w.queryRef)) {
      errors.push(`Widget "${w.id}": queryRef "${w.queryRef}" not found`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ═══════════════════════════════════════════════════════════════
// MOCK DATA GENERATOR (pentru development)
// ═══════════════════════════════════════════════════════════════

export function generateMockData(widgetType, config = {}, queryRef = null) {
  // Generare date de înaltă fidelitate dacă avem queryRef
  if (queryRef) {
    if (queryRef === 'total-visitors') {
      return {
        value: 84293,
        previous: 78124,
        trend: '7.9',
        sparklineData: [45, 52, 49, 62, 58, 65, 70, 68, 72, 80, 85, 78, 82, 90, 88, 92, 95, 89, 94, 98],
      };
    }
    if (queryRef === 'visitors-online') {
      return {
        totalOnline: 1482,
        devices: [
          { label: 'Desktop', value: 771, percent: 52, color: '#3b82f6' },
          { label: 'Mobile', value: 563, percent: 38, color: '#ec4899' },
          { label: 'Tablet', value: 148, percent: 10, color: '#10b981' },
        ],
      };
    }
    if (queryRef === 'top-pages') {
      return {
        items: [
          { label: '/', value: 34120, percent: 100 },
          { label: '/dashboard', value: 21490, percent: 63 },
          { label: '/analytics', value: 15201, percent: 45 },
          { label: '/settings', value: 8943, percent: 26 },
          { label: '/billing', value: 4520, percent: 13 },
        ],
      };
    }
    if (queryRef === 'top-countries') {
      return {
        items: [
          { label: 'United States', percent: 42, value: '42%' },
          { label: 'Germany', percent: 18, value: '18%' },
          { label: 'United Kingdom', percent: 12, value: '12%' },
          { label: 'France', percent: 9, value: '9%' },
          { label: 'Romania', percent: 5, value: '5%' },
          { label: 'Canada', percent: 4, value: '4%' },
        ],
      };
    }
    if (queryRef === 'sessions-by-source') {
      return {
        items: [
          { label: 'Organic Search', percent: 45, value: '45%' },
          { label: 'Direct', percent: 25, value: '25%' },
          { label: 'Referral', percent: 15, value: '15%' },
          { label: 'Social', percent: 10, value: '10%' },
          { label: 'Email', percent: 5, value: '5%' },
        ],
      };
    }
    if (queryRef === 'audience-mix') {
      return {
        segments: [
          { label: 'New Users', value: 60, color: '#A8C7FA' },
          { label: 'Returning Users', value: 40, color: '#6B7280' },
        ],
      };
    }
    if (queryRef === 'browsers') {
      return {
        items: [
          { label: 'Chrome', percent: 62, value: '62%' },
          { label: 'Safari', percent: 22, value: '22%' },
          { label: 'Firefox', percent: 8, value: '8%' },
          { label: 'Edge', percent: 6, value: '6%' },
          { label: 'Other', percent: 2, value: '2%' },
        ],
      };
    }
    if (queryRef === 'referrers') {
      return {
        items: [
          { label: 'google.com', value: 14230, percent: 100 },
          { label: 'github.com', value: 8940, percent: 63 },
          { label: 't.co', value: 4320, percent: 30 },
          { label: 'linkedin.com', value: 3120, percent: 22 },
          { label: 'ycombinator.com', value: 1850, percent: 13 },
        ],
      };
    }
    if (queryRef === 'core-web-vitals') {
      return {
        metrics: [
          { id: 'lcp', label: 'Largest Contentful Paint', acronym: 'LCP', value: '1.2s', status: 'good', description: 'Optimal loading speed.' },
          { id: 'inp', label: 'Interaction to Next Paint', acronym: 'INP', value: '85ms', status: 'good', description: 'Excellent responsiveness.' },
          { id: 'cls', label: 'Cumulative Layout Shift', acronym: 'CLS', value: '0.04', status: 'good', description: 'High visual stability.' }
        ],
      };
    }
    if (queryRef === 'active-campaigns-total') {
      return {
        value: 12,
        previous: 10,
        trend: '20.0',
      };
    }
    if (queryRef === 'posts-published') {
      return {
        value: 48,
        previous: 41,
        trend: '17.1',
      };
    }
    if (queryRef === 'total-reach') {
      return {
        value: 284300,
        previous: 251900,
        trend: '12.9',
      };
    }
    if (queryRef === 'avg-engagement') {
      return {
        value: 6.4,
        previous: 5.8,
        trend: '10.3',
      };
    }
    if (queryRef === 'gross-revenue') {
      return {
        summary: {
          primaryLabel: 'Today',
          primaryValue: 243.65,
          primaryColor: 'rgba(228, 228, 231, 0.95)',
          secondaryLabel: 'Yesterday',
          secondaryValue: 208.19,
          secondaryColor: 'rgba(142, 145, 143, 0.38)',
          delta: 17.0,
        },
        labels: ['19:00', '21:00', '23:00', '01:00', '03:00', '05:00', '07:00', '09:00', '11:00', '13:00', '15:00', '17:00'],
        datasets: [
          {
            key: 'yesterday',
            label: 'Yesterday',
            color: 'rgba(142, 145, 143, 0.34)',
            data: [3.6, 5.8, 4.1, 5.1, 3.8, 4.9, 6.4, 5.7, 7.2, 5.3, 5.9, 6.6],
          },
          {
            key: 'today',
            label: 'Today',
            color: 'rgba(228, 228, 231, 0.86)',
            data: [4.2, 6.55, 4.7, 5.6, 4.1, 5.7, 6.9, 6.2, 8.1, 5.8, 6.3, 7.1],
          },
        ],
      };
    }
    if (queryRef === 'todays-budget') {
      return {
        spent: 223.65,
        allowance: 480.0,
        percentUsed: 46.6,
        leftLabel: 'Used today',
        rightLabel: "Today's allowance",
      };
    }
  }

  // Fallback bazat pe widgetType
  switch (widgetType) {
    case WIDGET_TYPES.METRIC:
      return {
        value: Math.floor(Math.random() * 10000),
        previous: Math.floor(Math.random() * 10000),
        trend: (Math.random() * 40 - 20).toFixed(1),
        sparklineData: Array.from({ length: 20 }, () => Math.random() * 100),
      };
    
    case WIDGET_TYPES.SPARKLINE:
    case WIDGET_TYPES.LINE_CHART:
      return {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: config.lines?.map(line => ({
          key: line.key,
          label: line.label,
          data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 1000)),
        })) || [{
          key: 'default',
          label: 'Value',
          data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 1000)),
        }],
      };
    
    case WIDGET_TYPES.BAR_CHART:
      return {
        labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        datasets: [{
          key: 'value',
          label: 'Value',
          data: Array.from({ length: 8 }, () => Math.floor(Math.random() * 1000)),
        }],
      };

    case WIDGET_TYPES.STACKED_BAR_CHART:
      return {
        summary: {
          primaryLabel: 'Today',
          primaryValue: 243.65,
          primaryColor: 'rgba(228, 228, 231, 0.95)',
          secondaryLabel: 'Yesterday',
          secondaryValue: 208.19,
          secondaryColor: 'rgba(142, 145, 143, 0.38)',
          delta: 17.0,
        },
        labels: ['19:00', '21:00', '23:00', '01:00', '03:00', '05:00', '07:00', '09:00'],
        datasets: [
          {
            key: 'yesterday',
            label: 'Yesterday',
            color: 'rgba(142, 145, 143, 0.34)',
            data: Array.from({ length: 8 }, () => Number((Math.random() * 6 + 2).toFixed(2))),
          },
          {
            key: 'today',
            label: 'Today',
            color: 'rgba(228, 228, 231, 0.86)',
            data: Array.from({ length: 8 }, () => Number((Math.random() * 7 + 2).toFixed(2))),
          },
        ],
      };

    case WIDGET_TYPES.BUDGET_GAUGE:
      return {
        spent: 223.65,
        allowance: 480.0,
        percentUsed: 46.6,
      };
    
    case WIDGET_TYPES.PROGRESS_LIST:
      return {
        items: Array.from({ length: config.maxItems || 6 }, (_, i) => ({
          label: `Item ${i + 1}`,
          value: Math.floor(Math.random() * 100),
          max: 100,
          percent: Math.floor(Math.random() * 100),
        })),
      };
    
    case WIDGET_TYPES.STATUS_LIST:
      return {
        items: Array.from({ length: config.maxItems || 6 }, (_, i) => ({
          name: `Service ${i + 1}`,
          status: ['healthy', 'stable', 'warning', 'error'][Math.floor(Math.random() * 4)],
          detail: `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
          meta: Math.random() > 0.5 ? 'Cached' : 'Cold',
        })),
      };
    
    case WIDGET_TYPES.PIE_CHART:
      return {
        segments: [
          { label: 'Desktop', value: 45, color: '#E4E4E7' },
          { label: 'Mobile', value: 35, color: '#6B7280' },
          { label: 'Tablet', value: 15, color: '#3F3F46' },
          { label: 'Other', value: 5, color: '#27272A' },
        ],
      };
    
    case WIDGET_TYPES.SEGMENTED_BAR:
      return {
        segments: [
          { key: 'p50', label: 'P50', value: 45, color: '#E4E4E7' },
          { key: 'p95', label: 'P95', value: 120, color: '#6B7280' },
          { key: 'p99', label: 'P99', value: 350, color: '#3F3F46' },
        ],
        total: 515,
      };
    
    case WIDGET_TYPES.HEATMAP:
      return {
        rows: config.rows || 7,
        cols: config.cols || 24,
        data: Array.from({ length: (config.rows || 7) * (config.cols || 24) }, () =>
          Math.floor(Math.random() * 100)
        ),
      };
    
    case WIDGET_TYPES.TEXT_INSIGHT:
      return {
        text: 'Revenue increased by 18% compared to last period. The "Summer Sale" campaign drove 42% of total conversions. Consider increasing budget for high-performing channels.',
        highlights: [
          { text: '18%', type: 'metric' },
          { text: '42%', type: 'metric' },
        ],
      };
    
    default:
      return {};
  }
}
