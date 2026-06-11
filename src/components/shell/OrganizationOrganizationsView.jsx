import { useAppStore } from '@/stores/useAppStore';
import { ViewFrame } from '@/components/shell/ViewFrame';
import { Building2, Users, CreditCard, ChevronRight } from 'lucide-react';
import '@/styles/organization-views.css';

export function OrganizationOrganizationsView() {
  const { organizations, currentOrganization, selectOrganization, openOrganizationSection } =
    useAppStore();

  return (
    <ViewFrame
      title="Organizations"
      description="Switch between or manage all organizations under your account."
      maxWidthClassName="max-w-5xl"
    >
      <div className="org-stack">
        {organizations.map((org) => {
          const isCurrent = org.id === currentOrganization.id;
          return (
            <button
              key={org.id}
              onClick={() => {
                if (!isCurrent) {
                  selectOrganization(org.id);
                } else {
                  openOrganizationSection('organization-home');
                }
              }}
              className="org-item"
            >
              <div className="org-item-left">
                <div className="org-item-icon-box">
                  <Building2 size={20} />
                </div>
                <div className="min-w-0">
                  <div className="org-item-name">{org.name}</div>
                  <div className="org-item-details">
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {org.owner}
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCard size={12} />
                      {org.plan}
                    </span>
                  </div>
                </div>
              </div>
              <div className="org-item-right">
                {isCurrent && <span className="org-item-active-pill">Active</span>}
                <span className="org-item-chevron"><ChevronRight size={16} /></span>
              </div>
            </button>
          );
        })}
      </div>
    </ViewFrame>
  );
}
