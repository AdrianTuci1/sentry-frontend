import React, { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function SalesOverviewWidget({ data }) {
  const { metrics = {}, timeseries = {} } = data;
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const selectedData = timeseries[selectedMetric] || [];
  const activeMetricInfo = metrics[selectedMetric] || {};

  const max = Math.max(...selectedData);
  const min = Math.min(...selectedData);
  const range = max - min || 1;

  const points = selectedData.map((v, i) => {
    const x = (i / (selectedData.length - 1)) * 100;
    // vertical range: 10 to 90 inside the 100x100 SVG viewport
    const y = 90 - ((v - min) / range) * 80;
    return `${x},${y}`;
  }).join(' ');

  const fillPoints = `0,100 ${points} 100,100`;

  return (
    <div className="h-full flex flex-col select-none">
      {/* 4 Metric Selectors side-by-side */}
      <div className="grid grid-cols-4 border-b border-border shrink-0">
        {Object.entries(metrics).map(([key, m]) => {
          const isSelected = selectedMetric === key;
          const isPositive = parseFloat(m.trend) >= 0;

          return (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`flex flex-col gap-1.5 p-4 text-left border-r border-border last:border-r-0 hover:bg-bg-hover/5 transition-colors relative focus:outline-none ${
                isSelected ? 'bg-bg-primary/20' : ''
              }`}
            >
              {/* Top Selector Highlight Line */}
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent" />
              )}
              
              <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                {m.label}
              </span>
              
              <div className="flex items-baseline justify-between w-full">
                <span className="text-xl font-semibold text-text-primary tabular-nums">
                  {m.value}
                </span>
                <span className={`flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  isPositive 
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/15' 
                    : 'text-rose-400 bg-rose-500/10 border border-rose-500/15'
                }`}>
                  {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {Math.abs(parseFloat(m.trend)).toFixed(1)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Chart Area */}
      <div className="flex-1 p-4 flex flex-col justify-between relative min-h-0">
        {/* Y-Axis Labels overlay on the left */}
        <div className="absolute left-4 top-4 bottom-10 flex flex-col justify-between text-[10px] text-text-muted font-mono pointer-events-none">
          <span>{activeMetricInfo.unit || ''}{Math.round(max).toLocaleString()}</span>
          <span>{activeMetricInfo.unit || ''}{Math.round((max + min) / 2).toLocaleString()}</span>
          <span>{activeMetricInfo.unit || ''}{Math.round(min).toLocaleString()}</span>
        </div>

        {/* SVG Chart area */}
        <div className="flex-1 relative ml-12 mt-2 mr-2">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ display: 'block' }}>
            {/* Grid Lines */}
            <line x1="0" y1="10" x2="100" y2="10" stroke="#25282C" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#25282C" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="0" y1="90" x2="100" y2="90" stroke="#25282C" strokeWidth="0.5" strokeDasharray="3,3" />

            {/* Gradient Fill */}
            <polygon
              points={fillPoints}
              fill="rgba(168, 199, 250, 0.04)"
            />

            {/* Line Path */}
            <polyline
              points={points}
              fill="none"
              stroke="#A8C7FA"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* X-Axis Labels at the bottom */}
        <div className="flex justify-between text-[10px] text-text-muted font-mono mt-2 ml-12 mr-2 shrink-0">
          <span>Mar 30</span>
          <span>Apr 4</span>
          <span>Apr 9</span>
          <span>Apr 14</span>
          <span>Apr 19</span>
          <span>Apr 24</span>
          <span>Apr 29</span>
        </div>
      </div>
    </div>
  );
}
