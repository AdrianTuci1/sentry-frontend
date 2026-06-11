import React from 'react';
import {
  Compass,
  Flame,
  Globe,
  Search,
  Link2,
  Share2,
  Mail,
  Laptop
} from 'lucide-react';

function getItemDecoration(label) {
  if (!label) return null;
  const norm = label.toLowerCase();
  
  // Browsers
  if (norm.includes('chrome')) {
    return { icon: Globe, color: '#3b82f6' };
  }
  if (norm.includes('safari')) {
    return { icon: Compass, color: '#0ea5e9' };
  }
  if (norm.includes('firefox')) {
    return { icon: Flame, color: '#f97316' };
  }
  if (norm.includes('edge')) {
    return { icon: Laptop, color: '#10b981' };
  }

  // Sources / Referrers
  if (norm.includes('organic search') || norm.includes('google')) {
    return { icon: Search, color: '#10b981' };
  }
  if (norm.includes('direct')) {
    return { icon: Compass, color: '#6366f1' };
  }
  if (norm.includes('referral') || norm.includes('linkedin') || norm.includes('link')) {
    return { icon: Link2, color: '#3b82f6' };
  }
  if (norm.includes('social') || norm.includes('t.co') || norm.includes('twitter') || norm.includes('github')) {
    return { icon: Share2, color: '#ec4899' };
  }
  if (norm.includes('email')) {
    return { icon: Mail, color: '#f59e0b' };
  }

  // Countries
  const countryColors = {
    'united states': '#3b82f6',
    'germany': '#eab308',
    'united kingdom': '#ef4444',
    'france': '#3b82f6',
    'romania': '#eab308',
    'canada': '#ef4444',
  };
  
  for (const [country, col] of Object.entries(countryColors)) {
    if (norm.includes(country)) {
      return { icon: Globe, color: col };
    }
  }

  // Default fallback
  return null;
}

export function ProgressListWidget({ data, config }) {
  const { items = [] } = data;

  return (
    <div className="progress-list-widget-container scrollbar-thin">
      {items.map((item, i) => {
        const dec = getItemDecoration(item.label);
        const IconComponent = dec ? dec.icon : null;
        
        return (
          <div
            key={i}
            className="flex flex-col gap-1.5 transition-colors"
          >
            {/* Top row: Icon + Label on left, Value/Percent on right */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 min-w-0">
                {IconComponent ? (
                  <IconComponent size={13} style={{ color: dec.color }} className="shrink-0" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-text-muted/40 shrink-0" />
                )}
                <span className="text-xs font-medium text-text-secondary truncate" title={item.label}>
                  {item.label}
                </span>
              </div>

              <span className="text-xs text-text-muted tabular-nums font-mono font-medium shrink-0 ml-4">
                {config?.showValue && item.value !== undefined
                  ? item.value.toLocaleString()
                  : `${item.percent}%`
                }
              </span>
            </div>

            {/* Bottom row: Full width thin progress bar */}
            <div className="h-1 w-full bg-bg-primary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${item.percent}%`,
                  backgroundColor: dec ? dec.color : '#8E918F'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
