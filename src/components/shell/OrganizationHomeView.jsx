import { BarChart3, Briefcase, Building2, Database, ShieldCheck } from 'lucide-react';
import { ViewFrame } from '@/components/shell/ViewFrame';
import { useAppStore } from '@/stores/useAppStore';
import '@/styles/organization-home.css';

function MetricTile({ label, value, detail, trend }) {
  return (
    <div className="organization-metric-tile">
      <span className="organization-metric-label">{label}</span>
      <div className="organization-metric-value-row">
        <span className="organization-metric-value">{value}</span>
        <span className="organization-metric-trend">{trend}</span>
      </div>
      <span className="organization-metric-detail">{detail}</span>
    </div>
  );
}

export function OrganizationHomeView() {
  const { currentOrganization, workspaces, organizationMetrics } = useAppStore();

  return (
    <ViewFrame className="organization-home-frame" maxWidthClassName="max-w-7xl">
      <div className="organization-home-shell">
        <div className="organization-home-hero">
          <div>
            <span className="organization-home-kicker">Organization home</span>
            <h1 className="organization-home-title">{currentOrganization.name}</h1>
            <p className="organization-home-copy">
              Monitor portfolio health, warehouse pressure, connector adoption, and the projects your team is actively operating.
            </p>
          </div>
        </div>

        <div className="organization-home-grid">
          <section className="organization-panel organization-panel-span">
            <div className="organization-panel-header">
              <div className="organization-panel-title-row">
                <Building2 size={18} />
                <span>Portfolio</span>
              </div>
            </div>
            <div className="organization-panel-split">
              <MetricTile
                label="Managed organizations"
                value={organizationMetrics.managedOrganizations.value}
                detail={organizationMetrics.managedOrganizations.detail}
                trend={organizationMetrics.managedOrganizations.trend}
              />
              <MetricTile
                label="Active projects"
                value={organizationMetrics.activeProjects.value}
                detail={organizationMetrics.activeProjects.detail}
                trend={organizationMetrics.activeProjects.trend}
              />
            </div>
          </section>

          <section className="organization-panel organization-panel-span">
            <div className="organization-panel-header">
              <div className="organization-panel-title-row">
                <Database size={18} />
                <span>Consumption</span>
              </div>
            </div>
            <div className="organization-panel-split">
              <MetricTile
                label="Warehouse consumption"
                value={organizationMetrics.warehouseConsumption.value}
                detail={organizationMetrics.warehouseConsumption.detail}
                trend={organizationMetrics.warehouseConsumption.trend}
              />
              <MetricTile
                label="Monthly compute spend"
                value={organizationMetrics.monthlyCompute.value}
                detail={organizationMetrics.monthlyCompute.detail}
                trend={organizationMetrics.monthlyCompute.trend}
              />
            </div>
          </section>

          <section className="organization-panel organization-panel-span">
            <div className="organization-panel-header">
              <div className="organization-panel-title-row">
                <BarChart3 size={18} />
                <span>Activity</span>
              </div>
            </div>
            <div className="organization-panel-split">
              <MetricTile
                label="Connected sources"
                value={organizationMetrics.connectedSources.value}
                detail={organizationMetrics.connectedSources.detail}
                trend={organizationMetrics.connectedSources.trend}
              />
              <MetricTile
                label="Top connector"
                value={organizationMetrics.topConnector.value}
                detail={organizationMetrics.topConnector.detail}
                trend={organizationMetrics.topConnector.trend}
              />
            </div>
          </section>

          <section className="organization-card">
            <div className="organization-card-header">
              <div className="organization-panel-title-row">
                <Briefcase size={18} />
                <span>Projects</span>
              </div>
              <span className="organization-card-pill">{workspaces.length}</span>
            </div>

            <div className="organization-project-list">
              {workspaces.map((workspace) => (
                <div key={workspace.id} className="organization-project-row">
                  <div className="organization-project-main">
                    <div className="organization-project-dot" />
                    <div className="organization-project-copy">
                      <span className="organization-project-name">{workspace.name}</span>
                      <span className="organization-project-domain">{workspace.domain}</span>
                    </div>
                  </div>
                  <div className="organization-project-meta">
                    <span>{workspace.monthlyEvents}</span>
                    <span>{workspace.dataConsumption}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="organization-card">
            <div className="organization-card-header">
              <div className="organization-panel-title-row">
                <Database size={18} />
                <span>Connector adoption</span>
              </div>
            </div>

            <div className="organization-connector-list">
              {organizationMetrics.connectorUsage.map((connector) => (
                <div key={connector.name} className="organization-connector-row">
                  <div className="organization-connector-copy">
                    <span className="organization-connector-name">{connector.name}</span>
                    <span className="organization-connector-meta">{connector.count} projects</span>
                  </div>
                  <div className="organization-connector-bar-track">
                    <div
                      className="organization-connector-bar-fill"
                      style={{ width: `${connector.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="organization-card">
            <div className="organization-card-header">
              <div className="organization-panel-title-row">
                <ShieldCheck size={18} />
                <span>Recent activity</span>
              </div>
            </div>

            <div className="organization-activity-list">
              {organizationMetrics.recentActivity.map((item) => (
                <div key={item.title} className="organization-activity-item">
                  <span className="organization-activity-title">{item.title}</span>
                  <span className="organization-activity-meta">{item.meta}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </ViewFrame>
  );
}
