export function BarChartWidget({ data, config }) {
  const { labels, datasets } = data;
  const isHorizontal = config?.orientation === 'horizontal';
  const dataset = datasets?.[0] || { data: [] };
  const values = dataset.data;

  if (values.length === 0) return null;

  const max = Math.max(...values);

  return (
    <div className="h-full p-4 flex flex-col">
      <div className={`flex-1 ${isHorizontal ? 'flex flex-col gap-2' : 'flex items-end gap-1'}`}>
        {values.map((v, i) => {
          const percent = max > 0 ? (v / max) * 100 : 0;
          return (
            <div
              key={i}
              className={`${isHorizontal ? 'flex items-center gap-2' : 'flex-1 flex flex-col justify-end'}`}
            >
              {isHorizontal ? (
                <>
                  <span className="text-xs text-text-muted w-20 truncate">{labels?.[i] || i}</span>
                  <div className="flex-1 h-5 bg-bg-primary rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-text-muted/40 hover:bg-text-muted/60 transition-colors"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-text-secondary w-12 text-right tabular-nums">{v}</span>
                </>
              ) : (
                <>
                  <div
                    className="w-full bg-text-muted/40 hover:bg-text-muted/60 transition-colors rounded-t-sm"
                    style={{ height: `${percent}%` }}
                  />
                  <span className="text-xs text-text-muted text-center mt-1 truncate">{labels?.[i] || i}</span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
