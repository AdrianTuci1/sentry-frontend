import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  currentOrganization: {
    id: 'adrian-account',
    name: "Adrian.tucicovenco@gmail.com's Account",
    owner: 'Adrian.tucicovenco@gmail.com',
    plan: 'Agency',
  },

  currentWorkspace: {
    id: 'pixtooth',
    name: 'Pixtooth',
    domain: 'pixtooth.com',
    status: 'Healthy',
    monthlyEvents: '13K',
    dataConsumption: '612 GB',
    lastUpdated: '4 min ago',
    connectors: ['Stripe', 'PostHog', 'HubSpot'],
  },

  workspaces: [
    {
      id: 'pixtooth',
      name: 'Pixtooth',
      domain: 'pixtooth.com',
      status: 'Healthy',
      monthlyEvents: '13K',
      dataConsumption: '612 GB',
      lastUpdated: '4 min ago',
      connectors: ['Stripe', 'PostHog', 'HubSpot'],
    },
    {
      id: 'octomus',
      name: 'Octomus',
      domain: 'octomus.dev',
      status: 'Healthy',
      monthlyEvents: '2.7K',
      dataConsumption: '421 GB',
      lastUpdated: '11 min ago',
      connectors: ['Stripe', 'Sentry', 'GA4'],
    },
    {
      id: 'staticlabs',
      name: 'Staticlabs',
      domain: 'staticlabs.ro',
      status: 'Monitoring',
      monthlyEvents: '1.9K',
      dataConsumption: '286 GB',
      lastUpdated: '18 min ago',
      connectors: ['Shopify', 'Klaviyo', 'PostHog'],
    },
    {
      id: 'tuci',
      name: 'Tuci',
      domain: 'tuci.dev',
      status: 'Healthy',
      monthlyEvents: '334',
      dataConsumption: '92 GB',
      lastUpdated: '42 min ago',
      connectors: ['HubSpot', 'BigQuery', 'Slack'],
    },
  ],

  activeScope: 'project',
  activeSection: 'analytics',
  activeProjectSection: 'analytics',
  activeOrganizationSection: 'organization-home',

  activeAnalyticsView: 'servers',
  timeRange: '1h',

  sidebarCollapsed: false,
  demoMode: true,

  chatSessions: [],
  activeChatId: null,
  isChatPanelOpen: true,

  organizationMetrics: {
    managedOrganizations: {
      value: '18',
      detail: '6 active, 12 monitored',
      trend: '+3 this quarter',
    },
    activeProjects: {
      value: '7',
      detail: '4 billable, 3 internal',
      trend: '+2 this month',
    },
    warehouseConsumption: {
      value: '3.8 TB',
      detail: 'across raw + modeled layers',
      trend: '+12.4%',
    },
    monthlyCompute: {
      value: '$2.4k',
      detail: 'BigQuery + orchestration',
      trend: '-8.1%',
    },
    connectedSources: {
      value: '41',
      detail: '94.8% healthy',
      trend: '+7.3%',
    },
    topConnector: {
      value: 'Stripe',
      detail: 'used in 6 projects',
      trend: '62% adoption',
    },
    connectorUsage: [
      { name: 'Stripe', count: 6, share: 86 },
      { name: 'PostHog', count: 5, share: 72 },
      { name: 'HubSpot', count: 4, share: 58 },
      { name: 'BigQuery', count: 3, share: 41 },
    ],
    recentActivity: [
      { title: 'Staticlabs sync latency improved', meta: 'Warehouse jobs down 14% after cache tuning.' },
      { title: 'Octomus enabled Salesforce push', meta: 'Destination activation is now live for deal health alerts.' },
      { title: 'Pixtooth added two new sources', meta: 'GA4 and Sentry were connected in the last 24 hours.' },
    ],
  },

  setActiveSection: (section) =>
    set((state) => ({
      activeSection: section,
      activeProjectSection:
        state.activeScope === 'project' ? section : state.activeProjectSection,
      activeOrganizationSection:
        state.activeScope === 'organization' ? section : state.activeOrganizationSection,
    })),

  setActiveAnalyticsView: (view) => set({ activeAnalyticsView: view }),

  setTimeRange: (timeRange) => set({ timeRange }),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleDemoMode: () => set((state) => ({ demoMode: !state.demoMode })),

  selectWorkspace: (workspaceId) => {
    const workspace = get().workspaces.find((item) => item.id === workspaceId);
    if (!workspace) {
      return;
    }

    set((state) => ({
      currentWorkspace: workspace,
      activeScope: 'project',
      activeSection: state.activeProjectSection || 'analytics',
    }));
  },

  createWorkspace: (name) => {
    const id = `project_${Date.now()}`;
    const newWorkspace = {
      id,
      name,
      domain: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.workspace`,
      status: 'Healthy',
      monthlyEvents: '0',
      dataConsumption: '0 GB',
      lastUpdated: 'just now',
      connectors: [],
    };

    set((state) => ({
      workspaces: [...state.workspaces, newWorkspace],
      currentWorkspace: newWorkspace,
      activeScope: 'project',
      activeSection: state.activeProjectSection || 'analytics',
    }));
  },

  goToOrganizationHome: () =>
    set((state) => ({
      activeScope: 'organization',
      activeSection: state.activeOrganizationSection || 'organization-home',
    })),

  openOrganizationSection: (section) =>
    set({
      activeScope: 'organization',
      activeSection: section,
      activeOrganizationSection: section,
    }),

  createChatSession: (title = 'New Chat') => {
    const session = {
      id: `chat_${Date.now()}`,
      title,
      messages: [],
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      chatSessions: [...state.chatSessions, session],
      activeChatId: session.id,
    }));
    return session;
  },

  selectChat: (chatId) => set({ activeChatId: chatId }),

  deleteChatSession: (chatId) =>
    set((state) => {
      const filtered = state.chatSessions.filter((chat) => chat.id !== chatId);
      return {
        chatSessions: filtered,
        activeChatId:
          state.activeChatId === chatId
            ? filtered.length > 0
              ? filtered[0].id
              : null
            : state.activeChatId,
      };
    }),

  addMessage: (chatId, message) =>
    set((state) => ({
      chatSessions: state.chatSessions.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: `msg_${Date.now()}`,
                  ...message,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : chat
      ),
    })),
}));
