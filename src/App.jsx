import { AppShell } from "@/components/app-shell";
import { AnalyticsView } from "@/components/shell/AnalyticsView";
import { NodesView } from "@/components/shell/NodesView";
import { IntegrationsView } from "@/components/shell/IntegrationsView";
import { ChatView } from "@/components/shell/ChatView";
import { useAppStore } from "@/stores/useAppStore";

const sectionComponents = {
  analytics: AnalyticsView,
  nodes: NodesView,
  integrations: IntegrationsView,
  chat: ChatView,
};

function App() {
  const { activeSection } = useAppStore();
  const ActiveView = sectionComponents[activeSection] || AnalyticsView;

  return (
    <AppShell>
      <ActiveView />
    </AppShell>
  );
}

export default App;
