import { useAppStore } from "@/stores/useAppStore";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, LayoutGrid, Search } from "lucide-react";
import "@/styles/header.css";

export function AppHeader() {
  const { activeSection } = useAppStore();
  const sectionLabel =
    activeSection === "nodes"
      ? "Nodes / Findings"
      : activeSection.charAt(0).toUpperCase() + activeSection.slice(1);

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="header-left-side">
          <SidebarTrigger className="header-sidebar-trigger" />
          <div className="header-divider" />
          <div className="header-section-title">
            <LayoutGrid size={18} className="header-section-icon" />
            <span className="header-section-text">
              {sectionLabel}
            </span>
          </div>
        </div>

        <div className="header-right-side">
          <button className="header-search-btn">
            <Search size={18} />
            <span className="header-search-text">Search</span>
            <span className="header-search-kbd">K</span>
          </button>
          <button className="header-bell-btn">
            <Bell size={18} />
            <span className="header-bell-badge" />
          </button>
          <div className="header-avatar-wrapper">
            <div className="header-avatar-circle">U</div>
          </div>
        </div>
      </div>
    </header>
  );
}
