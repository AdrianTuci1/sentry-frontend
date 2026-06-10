import {
  BarChart3,
  GitBranch,
  Plug,
  MessageSquare,
  ChevronDown,
  Plus,
  Settings,
  PanelLeft,
  PanelLeftClose,
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

const sectionIcons = {
  BarChart3, GitBranch, Plug, MessageSquare,
};

export function Sidebar() {
  const {
    currentWorkspace,
    workspaces,
    activeSection,
    sidebarCollapsed,
    sections,
    setActiveSection,
    selectWorkspace,
    createWorkspace,
    toggleSidebar,
  } = useAppStore();

  return (
    <aside
      className={`flex flex-col h-full bg-bg-secondary border-r border-border transition-all duration-200 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Workspace Selector */}
      <div className="h-12 border-b border-border flex items-center px-3 shrink-0">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-2 w-full">
            <div className="relative group w-full">
              <button className="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-bg-hover transition-colors">
                <span className="text-sm font-medium text-text-primary truncate">
                  {currentWorkspace.name}
                </span>
                <ChevronDown size={14} className="text-text-muted shrink-0" />
              </button>
              <div className="absolute top-full left-0 w-56 mt-1 bg-bg-tertiary border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-1">
                <div className="px-3 py-2 text-xs text-text-muted font-medium uppercase tracking-wider">
                  Workspaces
                </div>
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => selectWorkspace(ws.id)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-bg-hover transition-colors ${
                      ws.id === currentWorkspace.id ? 'text-accent' : 'text-text-primary'
                    }`}
                  >
                    {ws.name}
                  </button>
                ))}
                <div className="border-t border-border my-1" />
                <button
                  onClick={() => {
                    const name = prompt('Workspace name:');
                    if (name?.trim()) createWorkspace(name.trim());
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-bg-hover transition-colors flex items-center gap-2"
                >
                  <Plus size={14} />
                  New Workspace
                </button>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-bg-hover text-text-muted transition-colors"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-bg-hover text-text-muted transition-colors mx-auto"
          >
            <PanelLeft size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <div className={`${sidebarCollapsed ? '' : 'px-2 mb-2 text-xs text-text-muted font-medium uppercase tracking-wider'}`}>
          {!sidebarCollapsed && 'Workspace'}
        </div>
        {sections.slice(0, 2).map((section) => {
          const Icon = sectionIcons[section.icon];
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md mb-1 transition-colors ${
                activeSection === section.id
                  ? 'bg-bg-hover text-accent'
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
              title={sidebarCollapsed ? section.label : ''}
            >
              <Icon size={18} />
              {!sidebarCollapsed && <span className="text-sm">{section.label}</span>}
            </button>
          );
        })}

        <div className={`${sidebarCollapsed ? 'mt-4' : 'mt-6 px-2 mb-2 text-xs text-text-muted font-medium uppercase tracking-wider'}`}>
          {!sidebarCollapsed && 'Connect'}
        </div>
        {sections.slice(2).map((section) => {
          const Icon = sectionIcons[section.icon];
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md mb-1 transition-colors ${
                activeSection === section.id
                  ? 'bg-bg-hover text-accent'
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
              title={sidebarCollapsed ? section.label : ''}
            >
              <Icon size={18} />
              {!sidebarCollapsed && <span className="text-sm">{section.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3 shrink-0">
        {!sidebarCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-xs font-medium text-accent">U</span>
              </div>
              <div className="text-sm text-text-primary">User</div>
            </div>
            <button className="p-1.5 rounded-md hover:bg-bg-hover text-text-muted transition-colors">
              <Settings size={16} />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-xs font-medium text-accent">U</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
