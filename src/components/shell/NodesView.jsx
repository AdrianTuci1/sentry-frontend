import { useAppStore } from '@/stores/useAppStore';
import { GitBranch, Circle, ArrowRight } from 'lucide-react';

export function NodesView() {
  const nodes = [
    { id: '1', label: 'Data Source', type: 'source', status: 'active' },
    { id: '2', label: 'Processor', type: 'transform', status: 'active' },
    { id: '3', label: 'Filter', type: 'transform', status: 'idle' },
    { id: '4', label: 'Aggregator', type: 'transform', status: 'active' },
    { id: '5', label: 'Output', type: 'sink', status: 'active' },
  ];

  const connections = [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
  ];

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold text-text-primary mb-6">Nodes / Findings</h2>

        <div className="flex items-center gap-4 mb-8">
          {nodes.map((node, index) => (
            <div key={node.id} className="flex items-center gap-4">
              <div
                className={`relative px-4 py-3 rounded-lg border min-w-[140px] text-center ${
                  node.status === 'active'
                    ? 'border-accent/50 bg-accent/10'
                    : 'border-border bg-bg-secondary'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  {node.type === 'source' && <GitBranch size={14} className="text-accent" />}
                  {node.type === 'sink' && <Circle size={14} className="text-green-400" />}
                  {node.type === 'transform' && <Circle size={14} className="text-text-muted" />}
                  <span className="text-sm font-medium text-text-primary">{node.label}</span>
                </div>
                <div className={`text-xs ${node.status === 'active' ? 'text-accent' : 'text-text-muted'}`}>
                  {node.status}
                </div>
                {node.status === 'active' && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full animate-pulse" />
                )}
              </div>
              {index < nodes.length - 1 && (
                <ArrowRight size={16} className="text-text-muted shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-bg-secondary border border-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-text-primary mb-3">Node Details</h3>
            <div className="space-y-2">
              {nodes.map((node) => (
                <div key={node.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-text-secondary">{node.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    node.status === 'active'
                      ? 'bg-accent/20 text-accent'
                      : 'bg-bg-hover text-text-muted'
                  }`}>
                    {node.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-bg-secondary border border-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-text-primary mb-3">Findings</h3>
            <div className="space-y-3">
              {[
                { id: 'F-001', severity: 'high', message: 'Anomalous pattern detected in node 2' },
                { id: 'F-002', severity: 'medium', message: 'Latency spike at 14:23' },
                { id: 'F-003', severity: 'low', message: 'Connection pool near limit' },
              ].map((finding) => (
                <div key={finding.id} className="flex items-start gap-3 p-3 rounded-md bg-bg-primary">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    finding.severity === 'high' ? 'bg-red-400' :
                    finding.severity === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                  }`} />
                  <div>
                    <div className="text-xs text-text-muted mb-0.5">{finding.id}</div>
                    <div className="text-sm text-text-secondary">{finding.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
