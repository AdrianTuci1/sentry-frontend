import { useAppStore } from "@/stores/useAppStore";
import { DashboardLayout } from "@/components/widgets/DashboardLayout";

const viewLayouts = {
  servers: "server-monitor",
  financial: "campaign-sales",
  marketing: "campaign-sales",
  web: "analytics",
};

export function AnalyticsView() {
  const { activeAnalyticsView } = useAppStore();
  const layoutId = viewLayouts[activeAnalyticsView] || "server-monitor";

  return <DashboardLayout layoutId={layoutId} />;
}
