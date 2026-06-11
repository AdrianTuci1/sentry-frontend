import { useEffect, useMemo, useState } from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import {
  AlertCircle,
  ArrowRightLeft,
  Check,
  ChevronsUpDown,
  Database,
  HardDrive,
  Plus,
  Radio,
  Trash2,
  XIcon,
} from 'lucide-react';
import { ViewFrame } from '@/components/shell/ViewFrame';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import connectorsData from '@/data/connectors.json';
import '@/styles/integrations.css';

const iconMap = {
  database: Database,
  sync: ArrowRightLeft,
  storage: HardDrive,
  signal: Radio,
};

const {
  connectedSources: defaultConnectedSources,
  connectedDestinations: defaultConnectedDestinations,
  sourceCategories,
  destinationCategories,
} = connectorsData;

const SOURCE_STORAGE_KEY = 'efferd.integrations.connectedSources';
const DESTINATION_STORAGE_KEY = 'efferd.integrations.connectedDestinations';

const authOptions = ['OAuth', 'API Key', 'Service Account', 'Database Credentials', 'Webhook Token'];

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function loadConnections(storageKey, fallback) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function buildConnectorOptions(categories, flow) {
  return categories.flatMap((category) =>
    category.connectors.map((name) => ({
      id: `${flow}:${slugify(name)}`,
      flow,
      name,
      categoryId: category.id,
      categoryTitle: category.title,
      description: category.description,
      icon: category.icon,
    }))
  );
}

function buildConnectionRecord(formState, selectedConnector) {
  const displayName = formState.displayName.trim() || selectedConnector.name;
  const scope = formState.scope.trim();
  const note = formState.notes.trim();

  return {
    id: `${selectedConnector.flow}-${slugify(displayName)}-${Date.now()}`,
    name: displayName,
    type: selectedConnector.categoryTitle,
    status: 'connected',
    lastSync: 'just now',
    note:
      note ||
      `${selectedConnector.name} connected via ${formState.authMethod}${scope ? ` for ${scope}` : ''}.`,
    authMethod: formState.authMethod,
    scope,
    connectorName: selectedConnector.name,
  };
}

function EmptyConnectionsState({ title, copy }) {
  return (
    <div className="integration-empty-state">
      <span className="integration-empty-title">{title}</span>
      <p className="integration-empty-copy">{copy}</p>
    </div>
  );
}

function IntegrationSelect({
  label,
  value,
  options,
  onChange,
  renderValue,
  renderOption,
}) {
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  return (
    <label className="integration-field">
      <span className="integration-field-label">{label}</span>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="integration-select-trigger" type="button" />
          }
        >
          <span className="integration-select-value">
            {selectedOption ? renderValue(selectedOption) : null}
          </span>
          <ChevronsUpDown size={15} className="integration-select-chevron" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="integration-select-menu"
        >
          <DropdownMenuRadioGroup value={value}>
            {options.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                onClick={() => onChange(option.value)}
                className="integration-select-option"
              >
                {renderOption(option)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </label>
  );
}

export function IntegrationsView() {
  const [connectedSources, setConnectedSources] = useState(() =>
    loadConnections(SOURCE_STORAGE_KEY, defaultConnectedSources)
  );
  const [connectedDestinations, setConnectedDestinations] = useState(() =>
    loadConnections(DESTINATION_STORAGE_KEY, defaultConnectedDestinations)
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [flowType, setFlowType] = useState('source');

  const sourceOptions = useMemo(() => buildConnectorOptions(sourceCategories, 'source'), []);
  const destinationOptions = useMemo(
    () => buildConnectorOptions(destinationCategories, 'destination'),
    []
  );

  const [selectedConnectorId, setSelectedConnectorId] = useState(sourceOptions[0]?.id ?? '');
  const [formState, setFormState] = useState({
    displayName: '',
    scope: '',
    authMethod: authOptions[0],
    credentials: '',
    notes: '',
  });

  const connectorOptions = flowType === 'source' ? sourceOptions : destinationOptions;
  const selectedConnector =
    connectorOptions.find((connector) => connector.id === selectedConnectorId) ??
    connectorOptions[0] ??
    null;
  const connectorSelectOptions = connectorOptions.map((connector) => ({
    value: connector.id,
    label: connector.name,
    hint: connector.categoryTitle,
  }));
  const authSelectOptions = authOptions.map((option) => ({
    value: option,
    label: option,
  }));

  useEffect(() => {
    window.localStorage.setItem(SOURCE_STORAGE_KEY, JSON.stringify(connectedSources));
  }, [connectedSources]);

  useEffect(() => {
    window.localStorage.setItem(DESTINATION_STORAGE_KEY, JSON.stringify(connectedDestinations));
  }, [connectedDestinations]);

  const openSheet = (flow, connectorName = '') => {
    const options = flow === 'source' ? sourceOptions : destinationOptions;
    const matchedConnector =
      options.find((item) => item.name === connectorName) ?? options[0] ?? null;

    setFlowType(flow);
    setSelectedConnectorId(matchedConnector?.id ?? '');
    setFormState({
      displayName: matchedConnector?.name ?? '',
      scope: '',
      authMethod: authOptions[0],
      credentials: '',
      notes: '',
    });
    setSheetOpen(true);
  };

  const handleFormChange = (field, value) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleConnectorChange = (value) => {
    const connector = connectorOptions.find((item) => item.id === value);
    setSelectedConnectorId(value);
    if (connector) {
      setFormState((current) => ({
        ...current,
        displayName: current.displayName === '' ? connector.name : current.displayName,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedConnector) {
      return;
    }

    const record = buildConnectionRecord(formState, selectedConnector);

    if (flowType === 'source') {
      setConnectedSources((current) => [record, ...current]);
    } else {
      setConnectedDestinations((current) => [record, ...current]);
    }

    setSheetOpen(false);
  };

  const handleRemoveConnection = (flow, id) => {
    if (flow === 'source') {
      setConnectedSources((current) => current.filter((item) => item.id !== id));
      return;
    }

    setConnectedDestinations((current) => current.filter((item) => item.id !== id));
  };

  return (
    <>
      <ViewFrame
        title="Integrations"
        description="Connect business data sources, then route modeled insights into the destinations your teams already use."
        maxWidthClassName="max-w-6xl"
        actions={
          <div className="integrations-action-row">
            <Button variant="outline" onClick={() => openSheet('destination')}>
              <Plus size={16} />
              Add Destination
            </Button>
            <Button onClick={() => openSheet('source')}>
              <Plus size={16} />
              Add Source
            </Button>
          </div>
        }
      >
        <div className="integrations-wrapper">
          <div className="integrations-section-head">
            <h3 className="available-integrations-title">Connected Sources</h3>
            <p className="integrations-section-copy">
              These are the live business systems currently ingesting into your managed data stack.
            </p>
          </div>

          <div className="integrations-grid">
            {connectedSources.map((integration) => (
              <div key={integration.id} className="integration-card">
                <div className="integration-card-header">
                  <div className="integration-card-info">
                    <div className="integration-icon-container">
                      <Database size={20} className="integration-icon-text" />
                    </div>
                    <div className="integration-name-status">
                      <span className="integration-name">{integration.name}</span>
                      <span className="integration-type">{integration.type}</span>
                    </div>
                  </div>
                  <div className="integration-card-actions">
                    <div className={cn('status-badge', integration.status)}>
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
                    <button
                      className="integration-remove-btn"
                      type="button"
                      onClick={() => handleRemoveConnection('source', integration.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="integration-card-note">{integration.note}</p>

                <div className="integration-card-meta">
                  <span className="integration-sync-time">Last sync: {integration.lastSync}</span>
                  <button className="integration-sync-btn" type="button">
                    Sync Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="integrations-section-head">
            <h3 className="available-integrations-title">Data Sources</h3>
            <p className="integrations-section-copy">
              Source systems users can connect directly. Storage, warehouse, and processing remain managed by your platform.
            </p>
          </div>

          <div className="integration-category-list">
            {sourceCategories.map((category) => {
              const Icon = iconMap[category.icon] || Database;
              return (
                <section key={category.id} className="integration-category-card">
                  <div className="integration-category-header">
                    <div className="integration-card-info">
                      <div className="integration-icon-container">
                        <Icon size={20} className="integration-icon-text" />
                      </div>
                      <div className="integration-name-status">
                        <span className="integration-name">{category.title}</span>
                        <span className="integration-type">{category.description}</span>
                      </div>
                    </div>
                  </div>

                  <div className="integration-chip-list">
                    {category.connectors.map((connector) => (
                      <button
                        key={connector}
                        className="integration-chip"
                        type="button"
                        onClick={() => openSheet('source', connector)}
                      >
                        <span>{connector}</span>
                      </button>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="integrations-section-head">
            <h3 className="available-integrations-title">Connected Destinations</h3>
            <p className="integrations-section-copy">
              Activation targets that receive alerts, segments, and modeled customer context from your platform.
            </p>
          </div>

          {connectedDestinations.length > 0 ? (
            <div className="integrations-grid">
              {connectedDestinations.map((integration) => (
                <div key={integration.id} className="integration-card">
                  <div className="integration-card-header">
                    <div className="integration-card-info">
                      <div className="integration-icon-container">
                        <ArrowRightLeft size={20} className="integration-icon-text" />
                      </div>
                      <div className="integration-name-status">
                        <span className="integration-name">{integration.name}</span>
                        <span className="integration-type">{integration.type}</span>
                      </div>
                    </div>
                    <div className="integration-card-actions">
                      <div className={cn('status-badge', integration.status)}>
                        <Check size={12} />
                        Connected
                      </div>
                      <button
                        className="integration-remove-btn"
                        type="button"
                        onClick={() => handleRemoveConnection('destination', integration.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="integration-card-note">{integration.note}</p>

                  <div className="integration-card-meta">
                    <span className="integration-sync-time">Updated: {integration.lastSync}</span>
                    <button className="integration-sync-btn" type="button">
                      Run Push
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyConnectionsState
              title="No destinations configured yet"
              copy="Connect Slack, CRM, or lifecycle tools when you want modeled signals to leave the platform."
            />
          )}

          <div className="integrations-section-head">
            <h3 className="available-integrations-title">Destinations</h3>
            <p className="integrations-section-copy">
              Optional activation targets for sending alerts, segments, and modeled customer context to downstream tools.
            </p>
          </div>

          <div className="integration-category-list">
            {destinationCategories.map((category) => {
              const Icon = iconMap[category.icon] || Database;
              return (
                <section key={category.id} className="integration-category-card">
                  <div className="integration-category-header">
                    <div className="integration-card-info">
                      <div className="integration-icon-container">
                        <Icon size={20} className="integration-icon-text" />
                      </div>
                      <div className="integration-name-status">
                        <span className="integration-name">{category.title}</span>
                        <span className="integration-type">{category.description}</span>
                      </div>
                    </div>
                  </div>

                  <div className="integration-chip-list">
                    {category.connectors.map((connector) => (
                      <button
                        key={connector}
                        className="integration-chip"
                        type="button"
                        onClick={() => openSheet('destination', connector)}
                      >
                        <span>{connector}</span>
                      </button>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </ViewFrame>

      <DialogPrimitive.Root open={sheetOpen} onOpenChange={setSheetOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop className="integration-modal-backdrop" />
          <DialogPrimitive.Popup className="integration-modal-frame">
            <div className="integration-modal">
              <DialogPrimitive.Close
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="integration-modal-close"
                    type="button"
                  />
                }
              >
                <XIcon />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>

              <form className="integration-sheet-form" onSubmit={handleSubmit}>
                <div className="integration-sheet-header">
                  <DialogPrimitive.Title className="integration-modal-title">
                    {flowType === 'source' ? 'Add Data Source' : 'Add Destination'}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="integration-modal-description">
                    {flowType === 'source'
                      ? 'Configure credentials and routing metadata for a new source connection.'
                      : 'Configure an activation target for alerts, synced segments, or downstream customer ops.'}
                  </DialogPrimitive.Description>
                </div>

                <div className="integration-form-grid">
                  <IntegrationSelect
                    label="Connector"
                    value={selectedConnectorId}
                    options={connectorSelectOptions}
                    onChange={handleConnectorChange}
                    renderValue={(option) => (
                      <>
                        <span className="integration-select-label">{option.label}</span>
                        <span className="integration-select-hint">{option.hint}</span>
                      </>
                    )}
                    renderOption={(option) => (
                      <div className="integration-select-option-copy">
                        <span className="integration-select-label">{option.label}</span>
                        <span className="integration-select-hint">{option.hint}</span>
                      </div>
                    )}
                  />

                  <label className="integration-field">
                    <span className="integration-field-label">Connection name</span>
                    <Input
                      className="integration-input"
                      value={formState.displayName}
                      onChange={(event) => handleFormChange('displayName', event.target.value)}
                      placeholder={selectedConnector?.name ?? 'Stripe Production'}
                    />
                  </label>

                  <label className="integration-field">
                    <span className="integration-field-label">
                      {flowType === 'source' ? 'Workspace / account' : 'Target workspace'}
                    </span>
                    <Input
                      className="integration-input"
                      value={formState.scope}
                      onChange={(event) => handleFormChange('scope', event.target.value)}
                      placeholder={flowType === 'source' ? 'prod-store-eu' : '#revenue-alerts'}
                    />
                  </label>

                  <IntegrationSelect
                    label="Auth method"
                    value={formState.authMethod}
                    options={authSelectOptions}
                    onChange={(value) => handleFormChange('authMethod', value)}
                    renderValue={(option) => (
                      <span className="integration-select-label">{option.label}</span>
                    )}
                    renderOption={(option) => (
                      <div className="integration-select-option-copy">
                        <span className="integration-select-label">{option.label}</span>
                      </div>
                    )}
                  />

                  <label className="integration-field integration-field-full">
                    <span className="integration-field-label">Credentials / configuration</span>
                    <Textarea
                      className="integration-textarea"
                      value={formState.credentials}
                      onChange={(event) => handleFormChange('credentials', event.target.value)}
                      placeholder='{"apiKey":"••••••••","accountId":"acct_123"}'
                    />
                  </label>

                  <label className="integration-field integration-field-full">
                    <span className="integration-field-label">Notes</span>
                    <Textarea
                      className="integration-textarea"
                      value={formState.notes}
                      onChange={(event) => handleFormChange('notes', event.target.value)}
                      placeholder="Optional context shown in the connected integrations list."
                    />
                  </label>
                </div>

                <div className="integration-sheet-footer">
                  <Button
                    type="button"
                    variant="outline"
                    className="integration-modal-secondary-btn"
                    onClick={() => setSheetOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="integration-modal-primary-btn">
                    {flowType === 'source' ? 'Create Source' : 'Create Destination'}
                  </Button>
                </div>
              </form>
            </div>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
