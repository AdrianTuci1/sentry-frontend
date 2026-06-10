import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AnalyticsView } from '@/components/shell/AnalyticsView';
import { NodesView } from '@/components/shell/NodesView';
import { IntegrationsView } from '@/components/shell/IntegrationsView';
import { ChatView } from '@/components/shell/ChatView';
import { useAppStore } from '@/stores/useAppStore';

const views = {
  analytics: AnalyticsView,
  nodes: NodesView,
  integrations: IntegrationsView,
  chat: ChatView,
};

export function AppLayout() {
  const { activeSection } = useAppStore();
  const ActiveView = views[activeSection] || NodesView;

  return (
    <div className="flex h-screen w-screen bg-bg-primary overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-hidden">
          <ActiveView />
        </main>
      </div>
    </div>
  );
}
