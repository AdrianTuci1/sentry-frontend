import { useMemo } from 'react';
import {
  WIDGET_SIZES,
  WIDGET_TYPES,
  generateMockData,
} from './widget-spec';
import { MetricWidget } from './widgets/MetricWidget';
import { SparklineWidget } from './widgets/SparklineWidget';
import { BarChartWidget } from './widgets/BarChartWidget';
import { LineChartWidget } from './widgets/LineChartWidget';
import { ProgressListWidget } from './widgets/ProgressListWidget';
import { StatusListWidget } from './widgets/StatusListWidget';
import { PieChartWidget } from './widgets/PieChartWidget';
import { TextInsightWidget } from './widgets/TextInsightWidget';
import { SegmentedBarWidget } from './widgets/SegmentedBarWidget';
import { HeatmapWidget } from './widgets/HeatmapWidget';
import { VisitorsOnlineWidget } from './widgets/VisitorsOnlineWidget';
import { CoreWebVitalsWidget } from './widgets/CoreWebVitalsWidget';
import { StackedBarChartWidget } from './widgets/StackedBarChartWidget';
import { BudgetGaugeWidget } from './widgets/BudgetGaugeWidget';
import '@/styles/dashboard.css';

const widgetComponents = {
  [WIDGET_TYPES.METRIC]: MetricWidget,
  [WIDGET_TYPES.SPARKLINE]: SparklineWidget,
  [WIDGET_TYPES.BAR_CHART]: BarChartWidget,
  [WIDGET_TYPES.LINE_CHART]: LineChartWidget,
  [WIDGET_TYPES.PROGRESS_LIST]: ProgressListWidget,
  [WIDGET_TYPES.STATUS_LIST]: StatusListWidget,
  [WIDGET_TYPES.PIE_CHART]: PieChartWidget,
  [WIDGET_TYPES.TEXT_INSIGHT]: TextInsightWidget,
  [WIDGET_TYPES.SEGMENTED_BAR]: SegmentedBarWidget,
  [WIDGET_TYPES.HEATMAP]: HeatmapWidget,
  [WIDGET_TYPES.VISITORS_ONLINE]: VisitorsOnlineWidget,
  [WIDGET_TYPES.CORE_WEB_VITALS]: CoreWebVitalsWidget,
  [WIDGET_TYPES.STACKED_BAR_CHART]: StackedBarChartWidget,
  [WIDGET_TYPES.BUDGET_GAUGE]: BudgetGaugeWidget,
};

export function WidgetRenderer({ spec }) {
  const { id, type, size, title, config } = spec;
  const sizeClass = WIDGET_SIZES[size]?.className || 'col-span-1 row-span-1';

  const data = useMemo(() => generateMockData(type, config, spec.queryRef || id), [type, config, spec.queryRef, id]);

  const WidgetComponent = widgetComponents[type];
  if (!WidgetComponent) {
    return (
      <div className={`${sizeClass} widget-card`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '16px' }}>
          <span style={{ color: '#8E918F', fontSize: '14px' }}>Unknown widget type: {type}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${sizeClass} widget-card`}>
      {/* Widget Header */}
      {title && (
        <div className="widget-header">
          <span className="widget-title">
            {title}
          </span>
          {config.unit && (
            <span className="widget-unit">{config.unit}</span>
          )}
        </div>
      )}
      {/* Widget Content */}
      <div className="widget-content-body">
        <WidgetComponent data={data} config={config} />
      </div>
    </div>
  );
}
