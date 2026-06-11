import React from 'react';

export function LeadSourcesWidget({ data }) {
  const { totalLeads = 3521, sources = [] } = data;

  let cumulativePercent = 0;
  const slices = sources.map((src) => {
    const percent = (src.value / totalLeads) * 100;
    const startPercent = cumulativePercent;
    cumulativePercent += percent;
    return { ...src, percent, startPercent };
  });

  return (
    <div className="h-full p-4 flex items-center justify-between gap-6 select-none">
      {/* Left: Donut SVG with text in center */}
      <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
        <svg viewBox="-50 -50 100 100" className="w-full h-full -rotate-90">
          {slices.map((slice, i) => (
            <circle
              key={i}
              r="40"
              cx="0"
              cy="0"
              fill="none"
              stroke={slice.color}
              strokeWidth="12"
              strokeDasharray={`${slice.percent * 2.51} ${251 - slice.percent * 2.51}`}
              strokeDashoffset={-slice.startPercent * 2.51}
            />
          ))}
          {/* Inner masking circle to make it a donut */}
          <circle r="33" cx="0" cy="0" fill="#111214" />
        </svg>
        {/* Centered label */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-lg font-bold text-text-primary leading-none tabular-nums">
            {totalLeads.toLocaleString()}
          </span>
          <span className="text-[9px] text-text-muted uppercase tracking-wider mt-1">
            Total Leads
          </span>
        </div>
      </div>

      {/* Right: Legend with Custom Color Bars */}
      <div className="flex-1 flex flex-col justify-center gap-3">
        {sources.map((src, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Color bar indicator */}
              <div className="w-1.5 h-3.5 rounded-sm" style={{ backgroundColor: src.color }} />
              <span className="text-text-secondary font-medium truncate">
                {src.label}
              </span>
            </div>
            <span className="text-text-primary font-semibold tabular-nums ml-2">
              {src.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
