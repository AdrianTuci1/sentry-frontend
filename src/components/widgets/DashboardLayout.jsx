import { useAppStore } from '@/stores/useAppStore';
import { WidgetRenderer } from './WidgetRenderer';
import { cn } from '@/lib/utils';
import {
  serverMonitorSpec,
  analyticsSpec,
  campaignSalesSpec,
  marketingSpec,
} from './widget-spec';
import { ChevronDown, RefreshCw } from 'lucide-react';
import { analyticsViews } from '@/components/app-shared';
import '@/styles/dashboard.css';

const layoutSpecs = {
  'server-monitor': serverMonitorSpec,
  'analytics': analyticsSpec,
  'campaign-sales': campaignSalesSpec,
  'marketing-performance': marketingSpec,
};

export function DashboardLayout({ layoutId, className, isNested = true }) {
  const {
    activeAnalyticsView,
    setActiveAnalyticsView,
    timeRange,
    setTimeRange
  } = useAppStore();
  const spec = layoutSpecs[layoutId] || serverMonitorSpec;

  return (
    <div
      data-layout-id={layoutId}
      className={cn(
        "dashboard-layout-container",
        isNested ? "nested" : "flat",
        className
      )}
    >
      {/* Dashboard Header */}
      {isNested ? (
        <div className="dashboard-layout-header nested-header">
          <h2 className="dashboard-header-title nested-title">
            {spec.title}
          </h2>
          <div className="dashboard-header-controls">
            <div className="dashboard-time-select-wrapper">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="dashboard-time-select"
              >
                {spec.timeRange.options.map((opt) => (
                  <option key={opt} value={opt}>
                    Last {opt}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="dashboard-time-select-icon" />
            </div>
            <button className="dashboard-refresh-btn">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="dashboard-layout-header flat-header">
          <div className="dashboard-menu-tabs">
            {analyticsViews.map((tab) => {
              const isSelected = activeAnalyticsView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAnalyticsView(tab.id)}
                  className={cn(
                    "dashboard-menu-tab-btn",
                    isSelected ? "active" : "inactive"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="dashboard-header-controls">
            <div className="dashboard-time-select-wrapper">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="dashboard-time-select"
              >
                {spec.timeRange.options.map((opt) => (
                  <option key={opt} value={opt}>
                    Last {opt}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="dashboard-time-select-icon" />
            </div>
            <button className="dashboard-refresh-btn">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Widget Grid */}
      <div className={cn("dashboard-grid-wrapper", isNested ? "nested-grid" : "flat-grid")}>
        <div className="dashboard-grid">
          {spec.widgets.map((widget) => (
            <WidgetRenderer key={widget.id} spec={widget} />
          ))}
        </div>
      </div>
    </div>
  );
}
