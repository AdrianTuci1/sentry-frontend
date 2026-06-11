import { useAppStore } from '@/stores/useAppStore';
import { ViewFrame } from '@/components/shell/ViewFrame';
import { Globe, Bell, ShieldCheck, Database, RefreshCw, ToggleLeft } from 'lucide-react';
import '@/styles/organization-views.css';

export function OrganizationSettingsView() {
  const { currentOrganization, organizationMetrics } = useAppStore();

  return (
    <ViewFrame
      title="Organization Settings"
      description="Configure account-level defaults, governance rules, and managed infrastructure preferences."
      maxWidthClassName="max-w-5xl"
    >
      <div className="org-views-grid org-views-grid-3">
        <div className="org-stat-card">
          <div className="org-stat-card-row">
            <div className="org-stat-icon-box"><ShieldCheck size={18} /></div>
            <div>
              <div className="org-stat-label">Policies</div>
              <div className="org-stat-value">6</div>
            </div>
          </div>
          <p className="org-stat-copy">Default policies currently applied across all projects.</p>
        </div>

        <div className="org-stat-card">
          <div className="org-stat-card-row">
            <div className="org-stat-icon-box"><RefreshCw size={18} /></div>
            <div>
              <div className="org-stat-label">Pending</div>
              <div className="org-stat-value">2</div>
            </div>
          </div>
          <p className="org-stat-copy">Pending organization-level changes awaiting review.</p>
        </div>

        <div className="org-stat-card">
          <div className="org-stat-card-row">
            <div className="org-stat-icon-box"><Database size={18} /></div>
            <div>
              <div className="org-stat-label">Warehouse</div>
              <div className="org-stat-value">
                {organizationMetrics?.warehouseConsumption?.value || '3.8 TB'}
              </div>
            </div>
          </div>
          <p className="org-stat-copy">Total managed warehouse consumption across all projects.</p>
        </div>
      </div>

      <div className="org-gap-4">
        <div className="org-section-panel">
          <div className="org-section-header">
            <span className="org-section-title">General Settings</span>
          </div>

          <div className="org-setting-row">
            <div className="org-setting-left">
              <div className="org-setting-icon-box"><Globe size={16} /></div>
              <div>
                <div className="org-setting-label">Organization display name</div>
                <div className="org-setting-desc">{currentOrganization.name}</div>
              </div>
            </div>
            <button className="org-btn-secondary">Edit</button>
          </div>

          <div className="org-setting-row">
            <div className="org-setting-left">
              <div className="org-setting-icon-box"><Bell size={16} /></div>
              <div>
                <div className="org-setting-label">Notification preferences</div>
                <div className="org-setting-desc">Email and Slack alert routing</div>
              </div>
            </div>
            <button className="org-btn-secondary">Configure</button>
          </div>

          <div className="org-setting-row">
            <div className="org-setting-left">
              <div className="org-setting-icon-box"><ShieldCheck size={16} /></div>
              <div>
                <div className="org-setting-label">Default member role</div>
                <div className="org-setting-desc">Role assigned to new team members</div>
              </div>
            </div>
            <span className="org-badge">Member</span>
          </div>

          <div className="org-setting-row">
            <div className="org-setting-left">
              <div className="org-setting-icon-box"><Database size={16} /></div>
              <div>
                <div className="org-setting-label">Data retention policy</div>
                <div className="org-setting-desc">Automatic data archiving and cleanup</div>
              </div>
            </div>
            <span className="org-badge">90 days</span>
          </div>

          <div className="org-setting-row">
            <div className="org-setting-left">
              <div className="org-setting-icon-box"><ToggleLeft size={16} /></div>
              <div>
                <div className="org-setting-label">Auto-invite domains</div>
                <div className="org-setting-desc">Allow auto-join from verified domains</div>
              </div>
            </div>
            <div className="org-toggle">
              <div className="org-toggle-dot" />
            </div>
          </div>
        </div>
      </div>
    </ViewFrame>
  );
}
