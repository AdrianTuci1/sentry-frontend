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
};

export function WidgetRenderer({ spec }) {
  const { id, type, size, title, config } = spec;
  const sizeClass = WIDGET_SIZES[size]?.className || 'col-span-1 row-span-1';

  // In producție, aici am face fetch la queryRef
  // Pentru demo, generăm mock data bazat pe tip
  const data = useMemo(() => generateMockData(type, config), [type, config]);

  const WidgetComponent = widgetComponents[type];
  if (!WidgetComponent) {
    return (
      <div className={`${sizeClass} bg-bg-secondary border border-border p-4 flex items-center justify-center`}>
        <span className="text-text-muted text-sm">Unknown widget type: {type}</span>
      </div>
    );
  }

  return (
    <div className={`${sizeClass} bg-bg-secondary border border-border flex flex-col overflow-hidden`}>
      {/* Widget Header */}
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
            {title}
          </span>
          {config.unit && (
            <span className="text-xs text-text-muted">{config.unit}</span>
          )}
        </div>
      )}
      {/* Widget Content */}
      <div className="flex-1 overflow-hidden">
        <WidgetComponent data={data} config={config} />
      </div>
    </div>
  );
}
