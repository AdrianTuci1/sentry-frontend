import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // Workspace state
  currentWorkspace: {
    id: 'default',
    name: 'Sentry Data',
  },
  workspaces: [
    { id: 'default', name: 'Sentry Data' },
  ],

  // Navigation state
  activeSection: 'analytics',

  // Analytics sub-views
  activeAnalyticsView: 'servers',

  // Sidebar state
  sidebarCollapsed: false,

  // Chat state
  chatSessions: [],
  activeChatId: null,
  isChatPanelOpen: true,

  setActiveSection: (section) => set({ activeSection: section }),

  setActiveAnalyticsView: (view) => set({ activeAnalyticsView: view }),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  selectWorkspace: (workspaceId) => {
    const ws = get().workspaces.find(w => w.id === workspaceId);
    if (ws) set({ currentWorkspace: ws });
  },

  createWorkspace: (name) => {
    const id = `ws_${Date.now()}`;
    const newWs = { id, name };
    set((state) => ({
      workspaces: [...state.workspaces, newWs],
      currentWorkspace: newWs,
    }));
  },

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

  deleteChatSession: (chatId) => set((state) => {
    const filtered = state.chatSessions.filter(c => c.id !== chatId);
    return {
      chatSessions: filtered,
      activeChatId: state.activeChatId === chatId
        ? (filtered.length > 0 ? filtered[0].id : null)
        : state.activeChatId,
    };
  }),

  addMessage: (chatId, message) => set((state) => ({
    chatSessions: state.chatSessions.map(chat =>
      chat.id === chatId
        ? {
            ...chat,
            messages: [...chat.messages, {
              id: `msg_${Date.now()}`,
              ...message,
              timestamp: new Date().toISOString(),
            }]
          }
        : chat
    ),
  })),
}));
