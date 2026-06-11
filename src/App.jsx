import { AppShell } from "@/components/app-shell";
import { OnboardingView } from "@/components/shell/OnboardingView";
import { AnalyticsView } from "@/components/shell/AnalyticsView";
import { IntegrationsView } from "@/components/shell/IntegrationsView";
import { GraphView } from "@/components/shell/GraphView";
import { SettingsView } from "@/components/shell/SettingsView";
import { ChatView } from "@/components/shell/ChatView";
import { useAppStore } from "@/stores/useAppStore";

const sectionComponents = {
  onboarding: OnboardingView,
  analytics: AnalyticsView,
  integrations: IntegrationsView,
  graph: GraphView,
  settings: SettingsView,
  chat: ChatView,
};

function App() {
  const { activeSection } = useAppStore();
  const ActiveView = sectionComponents[activeSection] || OnboardingView;

  return (
    <AppShell>
      <ActiveView />
    </AppShell>
  );
}

export default App;
