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
// TIPURI DE WIDGET (5 dimensiuni)
// ═══════════════════════════════════════════════════════════════

export const WIDGET_SIZES = {
  '1x1': { cols: 1, rows: 1, className: 'col-span-1 row-span-1' },
  '2x1': { cols: 2, rows: 1, className: 'col-span-2 row-span-1' },
  '1x2': { cols: 1, rows: 2, className: 'col-span-1 row-span-2' },
  '2x2': { cols: 2, rows: 2, className: 'col-span-2 row-span-2' },
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
      id: 'latency-dist',
      type: WIDGET_TYPES.SEGMENTED_BAR,
      size: '2x1',
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
    {
      id: 'server-status',
      type: WIDGET_TYPES.STATUS_LIST,
      size: '2x2',
      title: 'Services',
      queryRef: 'service-status',
      config: { maxItems: 10 },
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
  title: 'Analytics',
  timeRange: {
    default: '24h',
    options: ['1h', '24h', '7d', '30d', '90d'],
  },
  widgets: [
    {
      id: 'pageviews',
      type: WIDGET_TYPES.METRIC,
      size: '1x1',
      title: 'Pageviews',
      queryRef: 'pageviews-total',
      config: { sparkline: true },
    },
    {
      id: 'unique-visitors',
      type: WIDGET_TYPES.METRIC,
      size: '1x1',
      title: 'Unique Visitors',
      queryRef: 'unique-visitors',
      config: { sparkline: true },
    },
    {
      id: 'bounce-rate',
      type: WIDGET_TYPES.METRIC,
      size: '1x1',
      title: 'Bounce Rate',
      queryRef: 'bounce-rate',
      config: { unit: '%', sparkline: true },
    },
    {
      id: 'avg-session',
      type: WIDGET_TYPES.METRIC,
      size: '1x1',
      title: 'Avg Session',
      queryRef: 'avg-session-duration',
      config: { unit: 'min', sparkline: true },
    },
    {
      id: 'traffic-chart',
      type: WIDGET_TYPES.LINE_CHART,
      size: '4x2',
      title: 'Traffic Overview',
      queryRef: 'traffic-timeseries',
      config: {
        lines: [
          { key: 'pageviews', label: 'Pageviews', color: '#E4E4E7' },
          { key: 'unique', label: 'Unique', color: '#6B7280' },
        ],
        showLegend: true,
      },
    },
    {
      id: 'top-pages',
      type: WIDGET_TYPES.BAR_CHART,
      size: '2x2',
      title: 'Top Pages',
      queryRef: 'top-pages',
      config: { orientation: 'horizontal', maxItems: 10 },
    },
    {
      id: 'device-breakdown',
      type: WIDGET_TYPES.PIE_CHART,
      size: '1x2',
      title: 'Devices',
      queryRef: 'device-breakdown',
      config: { donut: true },
    },
    {
      id: 'referrers',
      type: WIDGET_TYPES.PROGRESS_LIST,
      size: '2x2',
      title: 'Top Referrers',
      queryRef: 'top-referrers',
      config: { maxItems: 8 },
    },
    {
      id: 'geo-heatmap',
      type: WIDGET_TYPES.HEATMAP,
      size: '2x2',
      title: 'Geo Activity',
      queryRef: 'geo-activity',
      config: { rows: 7, cols: 24 },
    },
  ],
  queries: [
    {
      id: 'pageviews-total',
      source: 'analytics',
      template: 'SELECT COUNT(*) FROM pageviews WHERE timestamp >= $__timeFrom',
      params: ['timeRange'],
      refresh: '60s',
    },
    {
      id: 'traffic-timeseries',
      source: 'analytics',
      template: 'SELECT time_bucket($__interval, timestamp) as t, COUNT(*) FROM pageviews WHERE timestamp >= $__timeFrom GROUP BY t ORDER BY t',
      params: ['timeRange', 'interval'],
      refresh: '60s',
    },
    {
      id: 'top-pages',
      source: 'analytics',
      template: 'SELECT path, COUNT(*) as views FROM pageviews WHERE timestamp >= $__timeFrom GROUP BY path ORDER BY views DESC LIMIT 10',
      params: ['timeRange'],
      refresh: '300s',
    },
    {
      id: 'device-breakdown',
      source: 'analytics',
      template: 'SELECT device_type, COUNT(*) FROM pageviews WHERE timestamp >= $__timeFrom GROUP BY device_type',
      params: ['timeRange'],
      refresh: '300s',
    },
    {
      id: 'geo-activity',
      source: 'analytics',
      template: 'SELECT EXTRACT(DOW FROM timestamp) as day, EXTRACT(HOUR FROM timestamp) as hour, COUNT(*) FROM pageviews WHERE timestamp >= $__timeFrom GROUP BY day, hour',
      params: ['timeRange'],
      refresh: '300s',
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
      size: '1x2',
      title: 'By Channel',
      queryRef: 'channel-breakdown',
      config: { donut: true },
    },
    {
      id: 'insight',
      type: WIDGET_TYPES.TEXT_INSIGHT,
      size: '2x1',
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

export function generateMockData(widgetType, config = {}) {
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
