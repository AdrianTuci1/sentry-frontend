export function AnalyticsView() {
  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold text-text-primary mb-6">Analytics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Total Events', value: '12,543', change: '+12%', positive: true },
            { title: 'Active Nodes', value: '48', change: '+3', positive: true },
            { title: 'Avg Response', value: '124ms', change: '-8ms', positive: true },
            { title: 'Errors', value: '23', change: '+5', positive: false },
            { title: 'Throughput', value: '1.2k/s', change: '+0.3k', positive: true },
            { title: 'Uptime', value: '99.9%', change: '0%', positive: true },
          ].map((stat) => (
            <div key={stat.title} className="bg-bg-secondary border border-border rounded-lg p-4">
              <div className="text-sm text-text-muted mb-1">{stat.title}</div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-semibold text-text-primary">{stat.value}</div>
                <div className={`text-sm ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-bg-secondary border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-text-primary mb-4">Activity Overview</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {Array.from({ length: 24 }).map((_, i) => {
              const height = Math.random() * 80 + 20;
              return (
                <div
                  key={i}
                  className="flex-1 bg-accent/30 rounded-t-sm hover:bg-accent/50 transition-colors"
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-text-muted">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:59</span>
          </div>
        </div>
      </div>
    </div>
  );
}
