import { useState } from 'react';
import { Plug, Plus, Check, AlertCircle } from 'lucide-react';
import { ViewFrame } from '@/components/shell/ViewFrame';
import { cn } from '@/lib/utils';
import '@/styles/integrations.css';

export function IntegrationsView() {
  const [integrations] = useState([
    { id: '1', name: 'PostgreSQL', type: 'database', status: 'connected', lastSync: '2 min ago' },
    { id: '2', name: 'Kafka', type: 'stream', status: 'connected', lastSync: '5 min ago' },
    { id: '3', name: 'S3 Bucket', type: 'storage', status: 'error', lastSync: '1h ago' },
  ]);

  const [available] = useState([
    { name: 'Redis', type: 'cache', description: 'In-memory data structure store' },
    { name: 'Slack', type: 'notification', description: 'Team communication and alerts' },
    { name: 'Datadog', type: 'monitoring', description: 'Cloud monitoring and analytics' },
  ]);

  return (
    <ViewFrame
      title="Integrations"
      description="Sources and services use the same padded page rhythm as the dashboard views."
      maxWidthClassName="max-w-6xl"
      actions={
        <button className="flex items-center gap-2 rounded-2xl bg-accent px-4 py-2 text-sm font-medium text-bg-primary transition-colors hover:bg-accent-hover">
          <Plus size={16} />
          Add Integration
        </button>
      }
    >
      <div className="integrations-wrapper">
        <div className="integrations-grid">
          {integrations.map((integration) => (
            <div key={integration.id} className="integration-card">
              <div className="integration-card-header">
                <div className="integration-card-info">
                  <div className="integration-icon-container">
                    <Plug size={20} className="integration-icon-text" />
                  </div>
                  <div className="integration-name-status">
                    <span className="integration-name">{integration.name}</span>
                    <span className="integration-type">{integration.type}</span>
                  </div>
                </div>
                <div className={cn("status-badge", integration.status)}>
                  {integration.status === 'connected' ? (
                    <>
                      <Check size={12} />
                      Connected
                    </>
                  ) : (
                    <>
                      <AlertCircle size={12} />
                      Error
                    </>
                  )}
                </div>
              </div>

              <div className="integration-card-meta">
                <span className="integration-sync-time">Last sync: {integration.lastSync}</span>
                <button className="integration-sync-btn">Sync Now</button>
              </div>
            </div>
          ))}
        </div>

        <h3 className="available-integrations-title">Available Integrations</h3>
        <div className="integrations-grid">
          {available.map((item) => (
            <div key={item.name} className="integration-available-card">
              <div className="integration-card-info">
                <div className="integration-icon-container">
                  <Plug size={20} className="integration-icon-text" />
                </div>
                <div className="integration-name-status">
                  <span className="integration-name">{item.name}</span>
                  <span className="integration-type">{item.type} — {item.description}</span>
                </div>
              </div>
              <button className="integration-available-connect-btn">Connect</button>
            </div>
          ))}
        </div>
      </div>
    </ViewFrame>
  );
}
