import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { ViewFrame } from '@/components/shell/ViewFrame';
import {
  Building2,
  Users,
  CreditCard,
  ChevronRight,
  ArrowLeft,
  Pencil,
  Trash2,
  Plus,
  Check,
  XIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import '@/styles/organization-views.css';

function EditOrgModal({ org, open, onClose, onSave }) {
  const [name, setName] = useState(org?.name || '');
  const [plan, setPlan] = useState(org?.plan || 'Starter');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(org.id, { name: name.trim(), plan });
    onClose();
  };

  return (
    <div className="org-modal-backdrop" onClick={onClose}>
      <div className="org-modal-frame" onClick={(e) => e.stopPropagation()}>
        <div className="org-modal">
          <button className="org-modal-close" onClick={onClose}>
            <XIcon size={18} />
          </button>
          <form className="org-modal-form" onSubmit={handleSubmit}>
            <div className="org-modal-header">
              <div className="org-modal-title">Edit organization</div>
              <div className="org-modal-description">Update organization name and plan.</div>
            </div>
            <div className="org-modal-body">
              <label className="org-modal-field">
                <span className="org-modal-field-label">Name</span>
                <Input className="org-modal-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Organization name" />
              </label>
              <label className="org-modal-field">
                <span className="org-modal-field-label">Plan</span>
                <select className="org-form-select" value={plan} onChange={(e) => setPlan(e.target.value)}>
                  <option value="Starter">Starter</option>
                  <option value="Growth">Growth</option>
                  <option value="Scale">Scale</option>
                  <option value="Agency">Agency</option>
                </select>
              </label>
            </div>
            <div className="org-modal-footer">
              <Button type="button" variant="outline" className="org-modal-secondary-btn" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="org-modal-primary-btn"><Check size={14} /> Save</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function CreateOrgModal({ open, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [plan, setPlan] = useState('Starter');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), plan);
    onClose();
  };

  return (
    <div className="org-modal-backdrop" onClick={onClose}>
      <div className="org-modal-frame" onClick={(e) => e.stopPropagation()}>
        <div className="org-modal">
          <button className="org-modal-close" onClick={onClose}>
            <XIcon size={18} />
          </button>
          <form className="org-modal-form" onSubmit={handleSubmit}>
            <div className="org-modal-header">
              <div className="org-modal-title">Create organization</div>
              <div className="org-modal-description">Set up a new organization for your account.</div>
            </div>
            <div className="org-modal-body">
              <label className="org-modal-field">
                <span className="org-modal-field-label">Name</span>
                <Input className="org-modal-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Organization name" />
              </label>
              <label className="org-modal-field">
                <span className="org-modal-field-label">Plan</span>
                <select className="org-form-select" value={plan} onChange={(e) => setPlan(e.target.value)}>
                  <option value="Starter">Starter</option>
                  <option value="Growth">Growth</option>
                  <option value="Scale">Scale</option>
                  <option value="Agency">Agency</option>
                </select>
              </label>
            </div>
            <div className="org-modal-footer">
              <Button type="button" variant="outline" className="org-modal-secondary-btn" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="org-modal-primary-btn"><Plus size={14} /> Create</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function OrganizationOrganizationsView() {
  const {
    organizations,
    currentOrganization,
    selectOrganization,
    openOrganizationSection,
    createOrganization: storeCreateOrg,
  } = useAppStore();
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [editOrg, setEditOrg] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const [localOrgs, setLocalOrgs] = useState(organizations);

  const handleEditSave = (id, data) => {
    setLocalOrgs((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)));
  };

  const handleDelete = (id) => {
    setLocalOrgs((prev) => prev.filter((o) => o.id !== id));
    setSelectedOrg(null);
  };

  const handleCreate = (name, plan) => {
    const newOrg = {
      id: `org_${Date.now()}`,
      name,
      plan,
      owner: 'you@example.com',
    };
    setLocalOrgs((prev) => [...prev, newOrg]);
    storeCreateOrg(name);
  };

  // Detail view
  if (selectedOrg) {
    return (
      <ViewFrame
        title={selectedOrg.name}
        description="Manage this organization — edit details, delete, or switch to it."
        maxWidthClassName="max-w-3xl"
      >
        <div className="org-detail-shell">
          <button className="org-back-btn" onClick={() => setSelectedOrg(null)}>
            <ArrowLeft size={15} />
            <span>All organizations</span>
          </button>

          <div className="org-detail-card">
            <div className="org-detail-hero">
              <div className="org-detail-icon">
                <Building2 size={28} />
              </div>
              <div>
                <div className="org-detail-name">{selectedOrg.name}</div>
                <div className="org-detail-meta">
                  <span>{selectedOrg.plan} plan</span>
                  <span>·</span>
                  <span>{selectedOrg.owner}</span>
                </div>
              </div>
            </div>

            <div className="org-detail-actions">
              {selectedOrg.id !== currentOrganization.id && (
                <button
                  className="org-btn-primary"
                  onClick={() => {
                    selectOrganization(selectedOrg.id);
                    setSelectedOrg(null);
                  }}
                >
                  <Building2 size={14} />
                  Switch to this organization
                </button>
              )}
              <button className="org-btn-secondary" onClick={() => setEditOrg(selectedOrg)}>
                <Pencil size={14} />
                Edit
              </button>
              <button
                className="org-btn-danger"
                onClick={() => {
                  if (window.confirm(`Delete "${selectedOrg.name}"? This cannot be undone.`)) {
                    handleDelete(selectedOrg.id);
                  }
                }}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>

        <EditOrgModal
          open={!!editOrg}
          org={editOrg}
          onClose={() => setEditOrg(null)}
          onSave={handleEditSave}
        />
      </ViewFrame>
    );
  }

  // List view
  return (
    <ViewFrame
      title="Organizations"
      description="Switch between or manage all organizations under your account."
      maxWidthClassName="max-w-5xl"
    >
      <div className="org-section-panel">
        <div className="org-section-header">
          <span className="org-section-title">All organizations</span>
          <button className="org-btn-secondary" onClick={() => setShowCreate(true)}>
            <Plus size={13} />
            Create
          </button>
        </div>

        {localOrgs.map((org) => {
          const isCurrent = org.id === currentOrganization.id;
          return (
            <button
              key={org.id}
              onClick={() => setSelectedOrg(org)}
              className="org-item"
            >
              <div className="org-item-left">
                <div className="org-item-icon-box">
                  <Building2 size={20} />
                </div>
                <div className="min-w-0">
                  <div className="org-item-name">{org.name}</div>
                  <div className="org-item-details">
                    <span>{org.owner}</span>
                    <span>·</span>
                    <span>{org.plan}</span>
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

      <CreateOrgModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
      />
    </ViewFrame>
  );
}
