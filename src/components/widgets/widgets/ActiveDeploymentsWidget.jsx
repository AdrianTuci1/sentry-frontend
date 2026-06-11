import React from 'react';
import { GitBranch, MoreVertical } from 'lucide-react';

export function ActiveDeploymentsWidget({ data }) {
  const { deployments = [] } = data;

  const statusColors = {
    healthy: { text: '#4ADE80', label: 'Healthy' },
    stable: { text: '#60A5FA', label: 'Stable' },
    warning: { text: '#FBBF24', label: 'Warning' },
    error: { text: '#F87171', label: 'Error' },
  };

  const cacheColors = {
    cached: { text: '#4ADE80', label: 'Cached' },
    cold: { text: '#FBBF24', label: 'Cold' },
  };

  return (
    <div className="h-full overflow-y-auto pr-1 select-none scrollbar-thin flex flex-col">
      <div className="w-full min-w-[700px]">
        {deployments.map((dep, i) => {
          const status = statusColors[dep.status.toLowerCase()] || { text: '#8E918F', label: dep.status };
          const cache = cacheColors[dep.cache.toLowerCase()] || { text: '#8E918F', label: dep.cache };

          return (
            <div
              key={i}
              className="flex items-center justify-between px-6 py-3 border-b border-border last:border-0 hover:bg-bg-hover/10 transition-colors"
            >
              {/* Col 1: Version & Env */}
              <div className="w-28 shrink-0">
                <span className="text-xs font-semibold text-text-primary block">
                  {dep.version}
                </span>
                <span className="text-[10px] text-text-muted mt-0.5 block">
                  {dep.environment}
                </span>
              </div>

              {/* Col 2: Status */}
              <div className="w-24 shrink-0 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: status.text }} />
                <span className="text-xs text-text-secondary font-medium">
                  {status.label}
                </span>
              </div>

              {/* Col 3: Branch & Commit */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-1">
                  <GitBranch size={11} className="text-text-muted shrink-0" />
                  <span className="text-xs font-medium text-text-primary truncate">
                    {dep.branch}
                  </span>
                </div>
                <span className="text-[10px] text-text-muted truncate block mt-0.5">
                  {dep.commit}
                </span>
              </div>

              {/* Col 4: Date */}
              <div className="w-20 shrink-0 text-xs text-text-muted">
                {dep.date}
              </div>

              {/* Col 5: Cache Status */}
              <div className="w-24 shrink-0 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cache.text }} />
                <span className="text-xs text-text-secondary">
                  {cache.label}
                </span>
              </div>

              {/* Col 6: Menu */}
              <button className="p-1 rounded hover:bg-bg-hover text-text-muted shrink-0">
                <MoreVertical size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
