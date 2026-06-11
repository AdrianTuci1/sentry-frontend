import { useAppStore } from "@/stores/useAppStore";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { findSectionById } from "@/components/app-shared";
import { Bell, LayoutGrid, Search } from "lucide-react";
import "@/styles/header.css";

export function AppHeader() {
  const { activeSection, activeScope, currentOrganization, currentWorkspace } = useAppStore();
  const section = findSectionById(activeScope, activeSection);
  const scopeLabel =
    activeScope === "organization" ? currentOrganization.name : currentWorkspace.name;

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="header-left-side">
          <SidebarTrigger className="header-sidebar-trigger" />
          <div className="header-divider" />
          <div className="header-section-title">
            <LayoutGrid size={18} className="header-section-icon" />
            <div className="header-section-copy">
              <span className="header-section-eyebrow">
                {activeScope === "organization" ? "Organization" : "Project"}
              </span>
              <span className="header-section-text">
                {scopeLabel} · {section?.title || "Dashboard"}
              </span>
            </div>
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
