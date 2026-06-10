export function SparklineWidget({ data, config }) {
  const { datasets } = data;
  const dataset = datasets?.[0] || { data: [] };
  const values = dataset.data;

  if (values.length === 0) return null;

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const fillPoints = config?.fill
    ? `0,100 ${points} 100,100`
    : null;

  return (
    <div className="h-full p-4 flex flex-col">
      {config?.showAxes && (
        <div className="flex justify-between text-xs text-text-muted mb-2">
          <span>{Math.round(max)}</span>
          <span>{Math.round(min)}</span>
        </div>
      )}
      <div className="flex-1 relative">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          {fillPoints && (
            <polygon
              points={fillPoints}
              fill="currentColor"
              className="text-text-muted/10"
            />
          )}
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-text-secondary"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
