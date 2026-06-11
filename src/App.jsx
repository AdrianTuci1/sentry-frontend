import { AppShell } from "@/components/app-shell";
import { OnboardingView } from "@/components/shell/OnboardingView";
import { AnalyticsView } from "@/components/shell/AnalyticsView";
import { IntegrationsView } from "@/components/shell/IntegrationsView";
import { GraphView } from "@/components/shell/GraphView";
import { SettingsView } from "@/components/shell/SettingsView";
import { ChatView } from "@/components/shell/ChatView";
import { OrganizationHomeView } from "@/components/shell/OrganizationHomeView";
import { OrganizationProjectsView } from "@/components/shell/OrganizationProjectsView";
import { OrganizationAdminView } from "@/components/shell/OrganizationAdminView";
import { useAppStore } from "@/stores/useAppStore";

const sectionComponents = {
  onboarding: OnboardingView,
  analytics: AnalyticsView,
  integrations: IntegrationsView,
  graph: GraphView,
  settings: SettingsView,
  chat: ChatView,
  "organization-home": OrganizationHomeView,
  "organization-projects": OrganizationProjectsView,
  "organization-members": () => (
    <OrganizationAdminView
      title="Members"
      description="Manage the people who can operate projects, connectors, and downstream activations."
      primaryStat={{ value: "14", copy: "Active members across analytics, ops, and GTM." }}
      secondaryStat={{ value: "3", copy: "Pending invites waiting for owner approval." }}
    />
  ),
  "organization-billing": () => (
    <OrganizationAdminView
      title="Billing"
      description="Track infrastructure spend, warehouse pressure, and project profitability."
      primaryStat={{ value: "$2.4k", copy: "Projected monthly managed infrastructure cost." }}
      secondaryStat={{ value: "91%", copy: "Spend currently attributed to billable projects." }}
    />
  ),
  "organization-settings": () => (
    <OrganizationAdminView
      title="Organization Settings"
      description="Configure organization-wide defaults, governance, and managed data platform behavior."
      primaryStat={{ value: "6", copy: "Default rules active across all connected projects." }}
      secondaryStat={{ value: "2", copy: "Pending account-level changes awaiting review." }}
    />
  ),
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
