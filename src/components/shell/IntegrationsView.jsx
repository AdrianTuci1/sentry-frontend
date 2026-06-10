import { useState } from 'react';
import { Plug, Plus, Check, AlertCircle } from 'lucide-react';

export function IntegrationsView() {
  const [integrations, setIntegrations] = useState([
    { id: '1', name: 'PostgreSQL', type: 'database', status: 'connected', lastSync: '2 min ago' },
    { id: '2', name: 'Kafka', type: 'stream', status: 'connected', lastSync: '5 min ago' },
    { id: '3', name: 'S3 Bucket', type: 'storage', status: 'error', lastSync: '1h ago' },
    { id: '4', name: 'Redis', type: 'cache', status: 'connected', lastSync: '1 min ago' },
  ]);

  const available = [
    { name: 'MongoDB', type: 'database' },
    { name: 'RabbitMQ', type: 'stream' },
    { name: 'Elasticsearch', type: 'search' },
    { name: 'Datadog', type: 'monitoring' },
  ];

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Integrations</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent text-bg-primary rounded-md text-sm font-medium hover:bg-accent-hover transition-colors">
            <Plus size={16} />
            Add Integration
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {integrations.map((integration) => (
            <div key={integration.id} className="bg-bg-secondary border border-border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center">
                    <Plug size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">{integration.name}</div>
                    <div className="text-xs text-text-muted capitalize">{integration.type}</div>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${
                  integration.status === 'connected' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {integration.status === 'connected' ? (
                    <Check size={12} />
                  ) : (
                    <AlertCircle size={12} />
                  )}
                  {integration.status}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-text-muted">Last sync: {integration.lastSync}</span>
                <button className="text-xs text-accent hover:text-accent-hover transition-colors">
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-sm font-medium text-text-primary mb-3">Available Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {available.map((item) => (
            <div key={item.name} className="bg-bg-secondary border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center">
                  <Plug size={20} className="text-text-muted" />
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">{item.name}</div>
                  <div className="text-xs text-text-muted capitalize">{item.type}</div>
                </div>
              </div>
              <button className="px-3 py-1.5 border border-border rounded-md text-xs text-text-secondary hover:bg-bg-hover transition-colors">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
