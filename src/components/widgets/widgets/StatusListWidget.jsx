import { Circle, MoreVertical } from 'lucide-react';

const statusColors = {
  healthy: '#4ADE80',
  stable: '#60A5FA',
  warning: '#FBBF24',
  error: '#F87171',
  cached: '#4ADE80',
  cold: '#FBBF24',
};

export function StatusListWidget({ data, config }) {
  const { items } = data;

  return (
    <div className="h-full overflow-auto">
      {items?.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-bg-hover/50 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-primary truncate">
                {item.name}
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: statusColors[item.status] || '#6B7280' }}
              />
              <span className="text-xs text-text-muted capitalize">{item.status}</span>
            </div>
            {item.detail && (
              <div className="text-xs text-text-muted mt-0.5">{item.detail}</div>
            )}
          </div>

          {config?.showBudget && item.budget && (
            <div className="text-xs text-text-muted tabular-nums">
              ${item.budget}
            </div>
          )}

          {item.meta && (
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: statusColors[item.meta.toLowerCase()] || '#6B7280' }}
              />
              <span className="text-xs text-text-muted">{item.meta}</span>
            </div>
          )}

          <button className="p-1 rounded hover:bg-bg-hover text-text-muted">
            <MoreVertical size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
