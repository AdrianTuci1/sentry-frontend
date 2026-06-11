function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function StackedBarChartWidget({ data, config }) {
  const { labels = [], datasets = [], summary } = data;
  const series = datasets.slice(0, 2);

  if (labels.length === 0 || series.length === 0) {
    return null;
  }

  const allValues = series.flatMap((dataset) => dataset.data || []);
  const max = Math.max(...allValues, 0);

  return (
    <div className="stacked-bar-chart-widget">
      {summary ? (
        <div className="stacked-bar-chart-summary">
          <div className="stacked-bar-chart-stat">
            <span className="stacked-bar-chart-dot" style={{ backgroundColor: summary.primaryColor || series[0]?.color || '#8E918F' }} />
            <span className="stacked-bar-chart-stat-label">{summary.primaryLabel}</span>
            <span className="stacked-bar-chart-stat-value">{formatCurrency(summary.primaryValue)}</span>
          </div>

          <div className="stacked-bar-chart-stat">
            <span className="stacked-bar-chart-dot" style={{ backgroundColor: summary.secondaryColor || series[1]?.color || '#D4D4D8' }} />
            <span className="stacked-bar-chart-stat-label">{summary.secondaryLabel}</span>
            <span className="stacked-bar-chart-stat-value">{formatCurrency(summary.secondaryValue)}</span>
          </div>

          {summary.delta !== undefined ? (
            <div className="stacked-bar-chart-delta">
              <span className={summary.delta >= 0 ? 'stacked-bar-chart-delta-positive' : 'stacked-bar-chart-delta-negative'}>
                {summary.delta >= 0 ? '+' : ''}
                {summary.delta.toFixed(1)}%
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        className={`stacked-bar-chart-plot ${config?.mode === 'overlay' ? 'overlay' : 'stacked'}`}
        style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}
      >
        {labels.map((label, index) => {
          const firstValue = series[0]?.data?.[index] || 0;
          const secondValue = series[1]?.data?.[index] || 0;
          const firstHeight = max > 0 ? (firstValue / max) * 100 : 0;
          const secondHeight = max > 0 ? (secondValue / max) * 100 : 0;
          const stackedHeight = max > 0 ? ((firstValue + secondValue) / (max * 2)) * 100 : 0;

          return (
            <div key={label} className="stacked-bar-chart-column">
              <div className="stacked-bar-chart-bars">
                {config?.mode === 'overlay' ? (
                  <>
                    <div
                      className="stacked-bar-chart-bar overlay-background"
                      style={{
                        height: `${firstHeight}%`,
                        backgroundColor: series[0]?.color || 'rgba(255,255,255,0.22)',
                      }}
                    />
                    <div
                      className="stacked-bar-chart-bar overlay-foreground"
                      style={{
                        height: `${secondHeight}%`,
                        backgroundColor: series[1]?.color || 'rgba(255,255,255,0.8)',
                      }}
                    />
                  </>
                ) : (
                  <div
                    className="stacked-bar-chart-stack"
                    style={{ height: `${Math.max(stackedHeight, 3)}%` }}
                  >
                    <div
                      className="stacked-bar-chart-bar"
                      style={{
                        height: `${(firstValue / Math.max(firstValue + secondValue, 1)) * 100}%`,
                        backgroundColor: series[0]?.color || 'rgba(255,255,255,0.22)',
                      }}
                    />
                    <div
                      className="stacked-bar-chart-bar"
                      style={{
                        height: `${(secondValue / Math.max(firstValue + secondValue, 1)) * 100}%`,
                        backgroundColor: series[1]?.color || 'rgba(255,255,255,0.8)',
                      }}
                    />
                  </div>
                )}
              </div>
              <span className="stacked-bar-chart-label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
