import { BarChart3, Database, ShieldCheck } from 'lucide-react';
import { ViewFrame } from '@/components/shell/ViewFrame';
import { useAppStore } from '@/stores/useAppStore';
import '@/styles/organization-views.css';

function StatTile({ label, value, detail, trend }) {
  return (
    <div className="org-stat-card" style={{ padding: '18px 20px' }}>
      <div className="org-stat-card-row" style={{ marginBottom: 4 }}>
        <div>
          <div className="org-stat-label">{label}</div>
          <div className="org-stat-value">{value}</div>
        </div>
      </div>
      <p className="org-stat-copy" style={{ margin: 0 }}>{detail}</p>
      <span style={{ fontSize: 11, color: '#8E918F', marginTop: 4, display: 'block' }}>{trend}</span>
    </div>
  );
}

export function OrganizationStatsView() {
  const { currentOrganization, workspaces, organizationMetrics } = useAppStore();
  const orgProjects = workspaces.filter(
    (w) => w.organizationId === currentOrganization.id
  );
  const totalEvents = orgProjects.reduce((sum, w) => {
    const num = parseInt(w.monthlyEvents.replace(/[^0-9.]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  const suffix = orgProjects.some((w) => w.monthlyEvents.includes('K')) ? 'K' : '';
  const totalConsumption = orgProjects.reduce((sum, w) => {
    const num = parseInt(w.dataConsumption.replace(/[^0-9.]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <ViewFrame
      title={`${currentOrganization.name} — Stats`}
      description="Usage, consumption, and activity metrics for this organization."
      maxWidthClassName="max-w-5xl"
    >
      <div className="org-views-grid org-views-grid-3">
        <StatTile
          label="Active projects"
          value={String(orgProjects.length)}
          detail={`${orgProjects.filter((w) => w.status === 'Healthy').length} healthy, ${orgProjects.filter((w) => w.status !== 'Healthy').length} monitoring`}
          trend="+2 this month"
        />
        <StatTile
          label="Monthly events"
          value={`${totalEvents}${suffix}`}
          detail="Across all projects"
          trend="+12.4% vs last month"
        />
        <StatTile
          label="Data consumption"
          value={`${totalConsumption} GB`}
          detail="Raw + modeled warehouse layers"
          trend="+8.1%"
        />
      </div>

      <div className="org-gap-4">
        <div className="org-section-panel">
          <div className="org-section-header">
            <span className="org-section-title"><Database size={15} /> Consumption breakdown</span>
          </div>
          {orgProjects.map((w) => (
            <div key={w.id} className="org-row">
              <div className="org-row-left">
                <div className="org-row-name">{w.name}</div>
                <div className="org-row-meta">{w.domain}</div>
              </div>
              <div className="org-row-right" style={{ gap: 16 }}>
                <span style={{ fontSize: 12, color: '#8E918F' }}>{w.monthlyEvents} events</span>
                <span style={{ fontSize: 12, color: '#E3E3E3' }}>{w.dataConsumption}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="org-section-panel">
          <div className="org-section-header">
            <span className="org-section-title"><BarChart3 size={15} /> Connector adoption</span>
          </div>
          {organizationMetrics.connectorUsage.map((c) => (
            <div key={c.name} className="org-row">
              <div className="org-row-left">
                <span className="org-row-name">{c.name}</span>
              </div>
              <div className="org-row-right">
                <span style={{ fontSize: 12, color: '#8E918F' }}>{c.count} projects</span>
              </div>
            </div>
          ))}
        </div>

        <div className="org-section-panel">
          <div className="org-section-header">
            <span className="org-section-title"><ShieldCheck size={15} /> Recent activity</span>
          </div>
          {organizationMetrics.recentActivity.map((item) => (
            <div key={item.title} className="org-row">
              <div className="org-row-left">
                <span className="org-row-name">{item.title}</span>
                <div className="org-row-meta">{item.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ViewFrame>
  );
}
