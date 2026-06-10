import { TrendingUp, TrendingDown } from 'lucide-react';

export function MetricWidget({ data, config }) {
  const { value, previous, trend, sparklineData } = data;
  const isPositive = parseFloat(trend) >= 0;

  const formatValue = (val) => {
    if (config?.prefix) return `${config.prefix}${val.toLocaleString()}`;
    if (config?.unit === '%') return `${val.toFixed(1)}%`;
    return val.toLocaleString();
  };

  return (
    <div className="h-full flex flex-col justify-between p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-semibold text-text-primary tabular-nums">
          {formatValue(value)}
        </span>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs ${isPositive ? 'text-text-secondary' : 'text-text-muted'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(parseFloat(trend)).toFixed(1)}%
          </span>
        )}
      </div>

      {sparklineData && config?.sparkline && (
        <div className="mt-3 h-10 flex items-end gap-px">
          {sparklineData.map((v, i) => {
            const max = Math.max(...sparklineData);
            const height = max > 0 ? (v / max) * 100 : 0;
            return (
              <div
                key={i}
                className="flex-1 bg-text-muted/30 hover:bg-text-muted/50 transition-colors"
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
