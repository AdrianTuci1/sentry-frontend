export function ProgressListWidget({ data, config }) {
  const { items } = data;

  return (
    <div className="h-full overflow-auto">
      {items?.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-2.5 border-b border-border last:border-0"
        >
          <span className="text-xs text-text-secondary w-24 truncate">{item.label}</span>
          <div className="flex-1 h-1.5 bg-bg-primary rounded-full overflow-hidden">
            <div
              className="h-full bg-text-muted/50 rounded-full transition-all"
              style={{ width: `${item.percent}%` }}
            />
          </div>
          {config?.showValue && (
            <span className="text-xs text-text-muted tabular-nums w-12 text-right">
              {item.value}
            </span>
          )}
          {config?.showPercent && (
            <span className="text-xs text-text-muted tabular-nums w-10 text-right">
              {item.percent}%
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
