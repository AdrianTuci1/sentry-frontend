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
  ChevronDown,
  UserPlus,
  Mail,
  CreditCard,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import '@/styles/organization-views.css';

export function OrganizationOrganizationsView() {
  const {
    organizations,
    currentOrganization,
    createOrganization: storeCreateOrg,
  } = useAppStore();
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [creating, setCreating] = useState(false);

  const [localOrgs, setLocalOrgs] = useState(organizations);

  // Inline editing fields
  const [editName, setEditName] = useState('');
  const [editPlan, setEditPlan] = useState('');
  const [editOwner, setEditOwner] = useState('');
  const [dirty, setDirty] = useState(false);

  // Create form fields
  const [createName, setCreateName] = useState('');
  const [createPlan, setCreatePlan] = useState('Starter');

  const handleEditSave = (id, data) => {
    setLocalOrgs((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)));
    setDirty(false);
  };

  const handleDelete = (id) => {
    setLocalOrgs((prev) => prev.filter((o) => o.id !== id));
    setSelectedOrg(null);
  };

  const handleCreate = () => {
    if (!createName.trim()) return;
    const newOrg = {
      id: `org_${Date.now()}`,
      name: createName.trim(),
      plan: createPlan,
      owner: 'you@example.com',
    };
    setLocalOrgs((prev) => [...prev, newOrg]);
    storeCreateOrg(createName.trim());
    setCreating(false);
    setCreateName('');
    setCreatePlan('Starter');
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
    const plans = ['Starter', 'Growth', 'Scale', 'Agency'];
    return (
      <ViewFrame
        title={selectedOrg.name}
        description="Edit organization details and settings."
        maxWidthClassName="max-w-3xl"
      >
        <div className="org-detail-shell">
          <button className="org-back-btn" onClick={() => setSelectedOrg(null)}>
            <ArrowLeft size={15} />
            <span>All organizations</span>
          </button>

          {/* General */}
          <div className="org-edit-section">
            <div className="org-edit-header">
              <Building2 size={14} />
              <span>General</span>
            </div>
            <div className="org-edit-fields">
              <label className="org-modal-field">
                <span className="org-modal-field-label">Name</span>
                <Input className="org-modal-input" value={editName} onChange={(e) => { setEditName(e.target.value); setDirty(true); }} placeholder="Organization name" />
              </label>
            </div>
            {dirty && (
              <div className="org-detail-save-bar">
                <span className="org-save-hint">Unsaved changes</span>
                <div className="org-detail-save-actions">
                  <button className="org-btn-secondary" onClick={() => { setEditName(selectedOrg.name); setEditPlan(selectedOrg.plan); setEditOwner(selectedOrg.owner); setDirty(false); }}>Cancel</button>
                  <button className="org-btn-primary" onClick={() => { handleEditSave(selectedOrg.id, { name: editName, plan: editPlan, owner: editOwner }); setDirty(false); }}><Check size={14} /> Save</button>
                </div>
              </div>
            )}
          </div>

          {/* Plan */}
          <div className="org-edit-section">
            <div className="org-edit-header">
              <CreditCard size={14} />
              <span>Plan</span>
            </div>
            <div className="org-edit-fields">
              <label className="org-modal-field">
                <span className="org-modal-field-label">Subscription plan</span>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="org-edit-dropdown-trigger"
                  >
                    <span>{editPlan}</span>
                    <ChevronDown size={14} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="org-edit-dropdown-content">
                    {plans.map((p) => (
                      <DropdownMenuItem
                        key={p}
                        onClick={() => { setEditPlan(p); setDirty(true); }}
                        className="org-edit-dropdown-item"
                      >
                        {editPlan === p && <Check size={13} />}
                        <span style={editPlan === p ? { color: '#f3f4f6' } : {}}>{p}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </label>
            </div>
          </div>

          {/* Ownership */}
          <div className="org-edit-section">
            <div className="org-edit-header">
              <Mail size={14} />
              <span>Ownership</span>
            </div>
            <div className="org-edit-fields">
              <label className="org-modal-field">
                <span className="org-modal-field-label">Owner email</span>
                <div className="org-edit-owner-row">
                  <Input className="org-modal-input" value={editOwner} onChange={(e) => { setEditOwner(e.target.value); setDirty(true); }} placeholder="owner@example.com" />
                  <button className="org-btn-secondary" style={{ flexShrink: 0 }} onClick={() => setDirty(true)}>
                    <UserPlus size={13} />
                    Transfer
                  </button>
                </div>
              </label>
            </div>
          </div>

          {/* Danger zone */}
          <div className="org-edit-section">
            <div className="org-edit-header">
              <Trash2 size={14} />
              <span>Danger zone</span>
            </div>
            <div className="org-edit-fields">
              <div className="org-edit-danger-row">
                <div>
                  <div className="org-edit-danger-label">Delete this organization</div>
                  <div className="org-edit-danger-desc">Permanently remove this organization and all its projects.</div>
                </div>
                <button className="org-btn-danger" onClick={() => { if (window.confirm(`Delete "${selectedOrg.name}"?`)) handleDelete(selectedOrg.id); }}><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          </div>
        </div>
      </ViewFrame>
    );
  }

  // Create inline view
  if (creating) {
    return (
      <ViewFrame
        title="New organization"
        description="Set up a new organization for your account."
        maxWidthClassName="max-w-3xl"
      >
        <div className="org-detail-shell">
          <button className="org-back-btn" onClick={() => { setCreating(false); setCreateName(''); setCreatePlan('Starter'); }}>
            <ArrowLeft size={15} />
            <span>All organizations</span>
          </button>

          <div className="org-edit-section">
            <div className="org-edit-fields">
              <label className="org-modal-field">
                <span className="org-modal-field-label">Name</span>
                <Input className="org-modal-input" value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="Organization name" />
              </label>
              <label className="org-modal-field">
                <span className="org-modal-field-label">Plan</span>
                <select className="org-form-select" value={createPlan} onChange={(e) => setCreatePlan(e.target.value)}>
                  <option value="Starter">Starter</option>
                  <option value="Growth">Growth</option>
                  <option value="Scale">Scale</option>
                  <option value="Agency">Agency</option>
                </select>
              </label>
            </div>
            <div className="org-edit-actions">
              <button className="org-btn-secondary" onClick={() => { setCreating(false); setCreateName(''); setCreatePlan('Starter'); }}>Cancel</button>
              <button className="org-btn-primary" onClick={handleCreate}><Plus size={14} /> Create</button>
            </div>
          </div>
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
      actions={
        <button className="org-btn-secondary" onClick={() => setCreating(true)}>
          <Plus size={13} />
          New organization
        </button>
      }
    >
      <div className="org-stack">
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
    </ViewFrame>
  );
}
