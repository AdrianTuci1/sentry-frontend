"use client";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarGroupAction,
  useSidebar,
} from "@/components/ui/sidebar";
import { LogoIcon } from "@/components/logo";
import { useAppStore } from "@/stores/useAppStore";
import {
  ChevronsUpDown,
  Check,
  Plus,
  LayoutDashboard,
  BarChart3,
  Briefcase,
  Plug,
  Settings,
  ChevronRight,
  BookOpen,
  Rocket,
  GitBranch,
  MessageSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "@/styles/sidebar.css";

export function AppSidebar() {
  const {
    currentWorkspace,
    workspaces,
    activeSection,
    setActiveSection,
    selectWorkspace,
    createWorkspace,
    chatSessions,
    activeChatId,
    selectChat,
    createChatSession,
  } = useAppStore();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const getWorkspaceGradient = (name) => {
    return name?.toLowerCase() === "shadcn"
      ? "bg-[linear-gradient(135deg,#d946ef,#3b82f6)]"
      : "bg-[linear-gradient(135deg,#4ade80,#3b82f6)]";
  };

  const gettingStartedItems = [
    { id: "onboarding", title: "Onboarding", icon: <Rocket size={18} /> },
  ];

  const platformItems = [
    { id: "analytics", title: "Analytics", icon: <BarChart3 size={18} /> },
    { id: "integrations", title: "Integrations", icon: <Plug size={18} /> },
    { id: "graph", title: "Graph", icon: <GitBranch size={18} /> },
    { id: "settings", title: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <Sidebar
      className={cn("app-sidebar-container", isCollapsed && "collapsed")}
      collapsible="icon"
      variant="sidebar"
    >
      {/* Brand Header */}
      <SidebarHeader className="sidebar-header-custom">
        <SidebarMenu className="sidebar-menu-custom">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="sidebar-logo-button">
              <div className="sidebar-logo-icon-wrapper">
                <LogoIcon className="h-5 w-5" />
              </div>
              <div className="sidebar-logo-title-wrapper group-data-[collapsible=icon]:hidden">
                <span className="sidebar-logo-title-text">
                  Efferd
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="sidebar-divider-custom" />

        {/* Organization Switcher Dropdown */}
        <div className="sidebar-switcher-wrapper">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="sidebar-switcher-trigger"
                    />
                  }
                >
                  <div className={cn("workspace-circle-logo", getWorkspaceGradient(currentWorkspace.name))} />
                  <div className="workspace-title-wrapper group-data-[collapsible=icon]:hidden">
                    <span className="workspace-title-text">
                      {currentWorkspace.name}
                    </span>
                  </div>
                  <ChevronsUpDown
                    size={14}
                    className="shrink-0 text-[#8E918F] group-data-[collapsible=icon]:hidden"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="start"
                  sideOffset={12}
                  className="sidebar-switcher-dropdown-content"
                >
                  <div className="dropdown-section-label">
                    Organizations
                  </div>
                  {workspaces.map((ws) => {
                    const isSelected = ws.id === currentWorkspace.id;
                    return (
                      <DropdownMenuItem
                        key={ws.id}
                        onClick={() => selectWorkspace(ws.id)}
                        className={cn(
                          "dropdown-item-custom",
                          isSelected && "selected"
                        )}
                      >
                        <div className="dropdown-item-left">
                          <div className={cn("dropdown-workspace-circle", getWorkspaceGradient(ws.name))} />
                          <div className="dropdown-item-meta">
                            <span className="dropdown-workspace-name">{ws.name}</span>
                            <span className="dropdown-workspace-plan">Free</span>
                          </div>
                        </div>
                        {isSelected && <Check size={16} className="text-white shrink-0" />}
                      </DropdownMenuItem>
                    );
                  })}
                  <div className="dropdown-separator" />
                  <DropdownMenuItem
                    onClick={() => {
                      const name = prompt("Organization name:");
                      if (name?.trim()) createWorkspace(name.trim());
                    }}
                    className="dropdown-create-org-item"
                  >
                    <Plus size={16} className="text-[#8E918F]" />
                    <span className="dropdown-create-org-text">Create new organization</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        <div className="sidebar-divider-custom" />
      </SidebarHeader>

      {/* Main Sidebar Navigation Groups */}
      <SidebarContent className="sidebar-content-custom">
        {/* Getting Started Group */}
        <SidebarGroup className="sidebar-group-custom">
          <SidebarGroupLabel className="sidebar-group-label-custom group-data-[collapsible=icon]:hidden">
            Getting Started
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="sidebar-menu-gap">
              {gettingStartedItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    tooltip={item.title}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "sidebar-nav-button",
                      activeSection === item.id && "active"
                    )}
                  >
                    <div className="sidebar-nav-left">
                      <div className="sidebar-nav-icon">
                        {item.icon}
                      </div>
                      <span className="sidebar-nav-label group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="sidebar-group-separator" />

        {/* Platform Group */}
        <SidebarGroup className="sidebar-group-custom">
          <SidebarGroupLabel className="sidebar-group-label-custom group-data-[collapsible=icon]:hidden">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="sidebar-menu-gap">
              {platformItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    tooltip={item.title}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "sidebar-nav-button",
                      activeSection === item.id && "active"
                    )}
                  >
                    <div className="sidebar-nav-left">
                      <div className="sidebar-nav-icon">
                        {item.icon}
                      </div>
                      <span className="sidebar-nav-label group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="sidebar-group-separator" />

        {/* Chat History Group */}
        <SidebarGroup className="sidebar-group-custom relative group/chat-group">
          <SidebarGroupLabel className="sidebar-group-label-custom group-data-[collapsible=icon]:hidden">
            Chat History
          </SidebarGroupLabel>
          <SidebarGroupAction
            onClick={() => {
              createChatSession();
              setActiveSection("chat");
            }}
            title="New Chat"
            className="chat-group-plus-btn"
          >
            <Plus size={14} />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu className="sidebar-menu-gap">
              {chatSessions.filter(s => s.messages && s.messages.length > 0).map((session) => (
                <SidebarMenuItem key={session.id}>
                  <SidebarMenuButton
                    isActive={activeSection === "chat" && activeChatId === session.id}
                    tooltip={session.title}
                    onClick={() => {
                      selectChat(session.id);
                      setActiveSection("chat");
                    }}
                    className={cn(
                      "sidebar-nav-button",
                      activeSection === "chat" && activeChatId === session.id && "active"
                    )}
                  >
                    <div className="sidebar-nav-left">
                      <div className="sidebar-nav-icon">
                        <MessageSquare size={18} />
                      </div>
                      <span className="sidebar-nav-label group-data-[collapsible=icon]:hidden">
                        {session.title}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="sidebar-separator-custom" />

      {/* Simple Clean Footer */}
      <SidebarFooter className="sidebar-footer-custom">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Documentation"
              onClick={() => alert("Opening documentation...")}
              className="sidebar-nav-button"
            >
              <div className="sidebar-nav-left">
                <div className="sidebar-nav-icon">
                  <BookOpen size={18} />
                </div>
                <span className="sidebar-nav-label group-data-[collapsible=icon]:hidden">
                  Documentation
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
