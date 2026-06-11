import { Building2 } from 'lucide-react';
import { ViewFrame } from '@/components/shell/ViewFrame';
import { useAppStore } from '@/stores/useAppStore';

export function OrganizationOrganizationsView() {
  const { organizations } = useAppStore();

  return (
    <ViewFrame
      title="Organizations"
      description="Review every organization managed in the account and move between their project portfolios."
      maxWidthClassName="max-w-5xl"
    >
      <div className="grid gap-4">
        {organizations.map((organization) => (
          <div
            key={organization.id}
            className="rounded-2xl border border-border bg-bg-secondary px-4 py-4"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-bg-hover text-text-primary">
                <Building2 size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-text-primary">{organization.name}</h3>
                <p className="mt-1 text-sm text-text-muted">{organization.owner}</p>
                <p className="mt-2 text-xs text-text-muted">{organization.plan} plan</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ViewFrame>
  );
}
