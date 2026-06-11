import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRightLeft,
  Check,
  Database,
  Plus,
  Trash2,
} from 'lucide-react';
import { IntegrationConnectionModal } from '@/components/shell/IntegrationConnectionModal';
import { ViewFrame } from '@/components/shell/ViewFrame';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import connectorsData from '@/data/connectors.json';
import '@/styles/integrations.css';

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

  const setModalFlowType = (flow, connectorName = '') => {
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
  };

  const openSheet = (flow, connectorName = '') => {
    setModalFlowType(flow, connectorName);
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
            <Button className="integrations-connect-btn" onClick={() => openSheet('source')}>
              <Plus size={16} />
              Connect
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

          {connectedSources.length > 0 ? (
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
          ) : (
            <EmptyConnectionsState
              title="No sources connected yet"
              copy="Use Connect to attach billing, commerce, analytics, CRM, or observability systems."
            />
          )}

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
        </div>
      </ViewFrame>
      <IntegrationConnectionModal
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        flowType={flowType}
        onFlowTypeChange={setModalFlowType}
        connectorSelectOptions={connectorSelectOptions}
        selectedConnectorId={selectedConnectorId}
        onConnectorChange={handleConnectorChange}
        authSelectOptions={authSelectOptions}
        formState={formState}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        selectedConnector={selectedConnector}
      />
    </>
  );
}
