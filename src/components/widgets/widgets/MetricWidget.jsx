import { TrendingUp, TrendingDown } from 'lucide-react';

export function MetricWidget({ data, config }) {
  const { value, previous, trend, sparklineData } = data;
  const isPositive = parseFloat(trend) >= 0;

  const formatValue = (val) => {
    if (config?.compact) {
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(val);
    }
    if (config?.prefix) return `${config.prefix}${val.toLocaleString()}`;
    if (config?.unit === '%') return `${val.toFixed(1)}%`;
    return val.toLocaleString();
  };

  return (
    <div className="metric-widget-container">
      {/* Top Part: Padded */}
      <div className="metric-widget-top">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-semibold text-text-primary tabular-nums">
            {formatValue(value)}
          </span>
          {trend !== undefined && (
            <span className={`flex items-center gap-1 text-[11px] font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(parseFloat(trend)).toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* Bottom Part: Edge-to-Edge Sparkline Chart (Continuous Line & Fill) */}
      {sparklineData && config?.sparkline && (
        <div className="metric-widget-sparkline">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* Fill under the sparkline */}
            <polygon
              points={`0,100 ${sparklineData.map((v, i) => {
                const max = Math.max(...sparklineData);
                const min = Math.min(...sparklineData);
                const range = max - min || 1;
                const x = (i / (sparklineData.length - 1)) * 100;
                // keep the line within a 20-80 y-range inside the SVG for clean spacing
                const y = 90 - ((v - min) / range) * 70;
                return `${x},${y}`;
              }).join(' ')} 100,100`}
              fill="rgba(168, 199, 250, 0.08)"
            />
            {/* Sparkline Line */}
            <polyline
              points={sparklineData.map((v, i) => {
                const max = Math.max(...sparklineData);
                const min = Math.min(...sparklineData);
                const range = max - min || 1;
                const x = (i / (sparklineData.length - 1)) * 100;
                const y = 90 - ((v - min) / range) * 70;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#A8C7FA"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
