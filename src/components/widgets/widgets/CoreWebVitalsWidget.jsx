export function CoreWebVitalsWidget({ data }) {
  const { metrics = [] } = data;

  const statusColors = {
    good: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Good' },
    needs_improvement: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Needs Improvement' },
    poor: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', label: 'Poor' }
  };

  return (
    <div className="core-web-vitals-widget-container">
      {metrics.map((m, i) => {
        const style = statusColors[m.status] || statusColors.good;
        return (
          <div key={i} className="core-web-vitals-col">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-text-primary tracking-wide">
                  {m.acronym}
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${style.text} ${style.bg} ${style.border}`}>
                  {style.label}
                </span>
              </div>
              <div className="text-[10px] text-text-muted truncate">
                {m.label}
              </div>
            </div>

            <div className="my-2">
              <span className="text-2xl font-semibold text-text-primary tabular-nums">
                {m.value}
              </span>
            </div>

            <div className="text-[10px] text-text-secondary truncate">
              {m.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}
