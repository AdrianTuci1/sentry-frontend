import { useAppStore } from "@/stores/useAppStore";
import { Bell, Search } from "lucide-react";

export function AppHeader() {
  const { activeSection, sections, analyticsViews, activeAnalyticsView } = useAppStore();

  const getTitle = () => {
    if (activeSection === "analytics") {
      const view = analyticsViews.find((v) => v.id === activeAnalyticsView);
      return view ? `${view.label} Analytics` : "Analytics";
    }
    const section = sections.find((s) => s.id === activeSection);
    return section?.label || "Dashboard";
  };

  return (
    <header className="h-12 border-b border-border bg-bg-secondary flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-medium text-text-primary">{getTitle()}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-md hover:bg-bg-hover text-text-muted transition-colors">
          <Search size={16} />
        </button>
        <button className="p-2 rounded-md hover:bg-bg-hover text-text-muted transition-colors relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />
        </button>
        <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center ml-1">
          <span className="text-xs font-medium text-accent">U</span>
        </div>
      </div>
    </header>
  );
}
