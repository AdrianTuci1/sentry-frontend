import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { ViewFrame } from '@/components/shell/ViewFrame';
import {
  Building2,
  ChevronRight,
  ArrowLeft,
  Trash2,
  Plus,
  Check,
  XIcon,
  Mail,
  CreditCard,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import '@/styles/organization-views.css';

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
    createOrganization: storeCreateOrg,
  } = useAppStore();
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const [localOrgs, setLocalOrgs] = useState(organizations);

  // Inline editing fields — local to the selected org
  const [editName, setEditName] = useState('');
  const [editPlan, setEditPlan] = useState('');
  const [editOwner, setEditOwner] = useState('');
  const [dirty, setDirty] = useState(false);

  const handleEditSave = (id, data) => {
    setLocalOrgs((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)));
    setDirty(false);
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

  const openDetail = (org) => {
    setSelectedOrg(org);
    setEditName(org.name);
    setEditPlan(org.plan);
    setEditOwner(org.owner);
    setDirty(false);
  };

  // Detail / inline edit view
  if (selectedOrg) {
    const isCurrent = selectedOrg.id === currentOrganization.id;
    return (
      <ViewFrame
        title={selectedOrg.name}
        description="Edit organization details, change plan, transfer ownership, or delete."
        maxWidthClassName="max-w-3xl"
      >
        <div className="org-detail-shell">
          <button className="org-back-btn" onClick={() => setSelectedOrg(null)}>
            <ArrowLeft size={15} />
            <span>All organizations</span>
          </button>

          <div className="org-section-panel">
            <div className="org-section-header">
              <span className="org-section-title">
                <Building2 size={14} />
                Organization
              </span>
            </div>

            <div className="org-detail-form">
              <label className="org-modal-field">
                <span className="org-modal-field-label">Name</span>
                <Input
                  className="org-modal-input"
                  value={editName}
                  onChange={(e) => { setEditName(e.target.value); setDirty(true); }}
                  placeholder="Organization name"
                />
              </label>

              <label className="org-modal-field">
                <span className="org-modal-field-label">Plan</span>
                <select
                  className="org-form-select"
                  value={editPlan}
                  onChange={(e) => { setEditPlan(e.target.value); setDirty(true); }}
                >
                  <option value="Starter">Starter</option>
                  <option value="Growth">Growth</option>
                  <option value="Scale">Scale</option>
                  <option value="Agency">Agency</option>
                </select>
              </label>
            </div>

            {dirty && (
              <div className="org-detail-save-bar">
                <span className="org-save-hint">Unsaved changes</span>
                <div className="org-detail-save-actions">
                  <button
                    className="org-btn-secondary"
                    onClick={() => {
                      setEditName(selectedOrg.name);
                      setEditPlan(selectedOrg.plan);
                      setEditOwner(selectedOrg.owner);
                      setDirty(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="org-btn-primary"
                    onClick={() => handleEditSave(selectedOrg.id, { name: editName, plan: editPlan })}
                  >
                    <Check size={14} />
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="org-section-panel">
            <div className="org-section-header">
              <span className="org-section-title">
                <Mail size={14} />
                Ownership
              </span>
            </div>
            <div className="org-detail-form">
              <label className="org-modal-field">
                <span className="org-modal-field-label">Owner email</span>
                <div className="org-detail-owner-row">
                  <Input
                    className="org-modal-input"
                    value={editOwner}
                    onChange={(e) => { setEditOwner(e.target.value); setDirty(true); }}
                    placeholder="owner@example.com"
                  />
                  <button className="org-btn-secondary" style={{ flexShrink: 0 }} onClick={() => setDirty(true)}>
                    <UserPlus size={13} />
                    Transfer
                  </button>
                </div>
              </label>
            </div>
          </div>

          <div className="org-section-panel">
            <div className="org-section-header">
              <span className="org-section-title">
                <CreditCard size={14} />
                Billing
              </span>
            </div>
            <div className="org-detail-form">
              <div className="org-detail-info-row">
                <div>
                  <div className="org-detail-info-label">Current plan</div>
                  <div className="org-detail-info-value">{selectedOrg.plan}</div>
                </div>
                <span className="org-badge">{selectedOrg.plan === 'Starter' ? 'Free' : 'Paid'}</span>
              </div>
            </div>
          </div>

          <div className="org-section-panel">
            <div className="org-section-header">
              <span className="org-section-title">
                <ShieldCheck size={14} />
                Danger zone
              </span>
            </div>
            <div className="org-detail-form">
              <div className="org-detail-danger-row">
                <div>
                  <div className="org-detail-info-label">Delete this organization</div>
                  <div className="org-detail-info-value" style={{ fontSize: 12, color: '#8E918F', marginTop: 2 }}>
                    Permanently remove this organization and all its projects.
                  </div>
                </div>
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

          {!isCurrent && (
            <button
              className="org-btn-primary"
              style={{ alignSelf: 'flex-start' }}
              onClick={() => {
                selectOrganization(selectedOrg.id);
                setSelectedOrg(null);
              }}
            >
              <Building2 size={14} />
              Switch to this organization
            </button>
          )}
        </div>
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
              onClick={() => openDetail(org)}
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
