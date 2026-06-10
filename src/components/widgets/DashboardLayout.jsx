import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { WidgetRenderer } from './WidgetRenderer';
import {
  serverMonitorSpec,
  analyticsSpec,
  campaignSalesSpec,
} from './widget-spec';
import { ChevronDown, RefreshCw } from 'lucide-react';

const layoutSpecs = {
  'server-monitor': serverMonitorSpec,
  'analytics': analyticsSpec,
  'campaign-sales': campaignSalesSpec,
};

export function DashboardLayout({ layoutId }) {
  const [timeRange, setTimeRange] = useState('1h');
  const spec = layoutSpecs[layoutId] || serverMonitorSpec;

  return (
    <div className="h-full flex flex-col">
      {/* Dashboard Header */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0">
        <h2 className="text-sm font-medium text-text-primary">{spec.title}</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-bg-secondary border border-border rounded-md px-3 py-1.5 pr-8 text-xs text-text-primary focus:outline-none focus:border-accent"
            >
              {spec.timeRange.options.map((opt) => (
                <option key={opt} value={opt}>
                  Last {opt}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
          <button className="p-1.5 rounded-md hover:bg-bg-hover text-text-muted transition-colors">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Widget Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-4 gap-px bg-border max-w-7xl mx-auto">
          {spec.widgets.map((widget) => (
            <WidgetRenderer key={widget.id} spec={widget} />
          ))}
        </div>
      </div>
    </div>
  );
}
