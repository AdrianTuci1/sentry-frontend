export function SegmentedBarWidget({ data, config }) {
  const { segments, total } = data;

  return (
    <div className="h-full p-4 flex flex-col justify-center">
      <div className="flex h-6 bg-bg-primary rounded-sm overflow-hidden">
        {segments?.map((segment, i) => {
          const percent = total > 0 ? (segment.value / total) * 100 : 0;
          return (
            <div
              key={segment.key}
              className="h-full transition-all hover:opacity-80"
              style={{
                width: `${percent}%`,
                backgroundColor: segment.color,
              }}
              title={`${segment.label}: ${segment.value}`}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-2">
        {segments?.map((segment) => (
          <div key={segment.key} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-xs text-text-muted">
              {segment.label}: {segment.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
