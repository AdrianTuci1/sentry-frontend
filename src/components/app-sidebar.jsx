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
import { getNavigationGroups } from "@/components/app-shared";
import { useAppStore } from "@/stores/useAppStore";
import {
  Plus,
  LayoutDashboard,
  BarChart3,
  Briefcase,
  Plug,
  Settings,
  BookOpen,
  Rocket,
  GitBranch,
  MessageSquare,
  Undo2,
  Users,
  CreditCard,
  Power,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "@/styles/sidebar.css";

const sectionIcons = {
  "bar-chart-3": BarChart3,
  briefcase: Briefcase,
  "credit-card": CreditCard,
  "git-branch": GitBranch,
  "layout-dashboard": LayoutDashboard,
  "message-square": MessageSquare,
  plug: Plug,
  rocket: Rocket,
  settings: Settings,
  users: Users,
};

export function AppSidebar() {
  const {
    currentOrganization,
    currentWorkspace,
    organizations,
    workspaces,
    activeScope,
    activeSection,
    setActiveSection,
    selectOrganization,
    selectWorkspace,
    createWorkspace,
    goToOrganizationHome,
    chatSessions,
    activeChatId,
    selectChat,
    createChatSession,
    demoMode,
    toggleDemoMode,
  } = useAppStore();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const navigationGroups = getNavigationGroups(activeScope);
  const organizationProjects = workspaces.filter(
    (workspace) => workspace.organizationId === currentOrganization.id
  );

  const getWorkspaceGradient = (name) => {
    return name?.toLowerCase() === "pixtooth"
      ? "bg-[linear-gradient(135deg,#4ade80,#3b82f6)]"
      : "bg-[linear-gradient(135deg,#60a5fa,#1d4ed8)]";
  };

  return (
    <Sidebar
      className={cn("app-sidebar-container", isCollapsed && "collapsed")}
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader className="sidebar-header-custom">
        <SidebarMenu className="sidebar-menu-custom">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="sidebar-logo-button">
              <div className="sidebar-logo-icon-wrapper">
                <LogoIcon className="h-5 w-5" />
              </div>
              <div className="sidebar-logo-title-wrapper group-data-[collapsible=icon]:hidden">
                <span className="sidebar-logo-title-text">Efferd</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="sidebar-divider-custom" />

        <div className="sidebar-switcher-wrapper">
          <SidebarMenu>
            <SidebarMenuItem>
              {activeScope === "organization" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<SidebarMenuButton size="lg" className="sidebar-switcher-trigger" />}
                  >
                    <div
                      className={cn(
                        "workspace-circle-logo",
                        getWorkspaceGradient(currentOrganization.name)
                      )}
                    />
                    <div className="workspace-title-wrapper group-data-[collapsible=icon]:hidden">
                      <span className="workspace-title-text">{currentOrganization.name}</span>
                      <span className="workspace-subtitle-text">Organizations</span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="start"
                    sideOffset={12}
                    className="sidebar-switcher-dropdown-content"
                  >
                    <div className="dropdown-section-label">Organizations</div>
                    {organizations.map((organization) => (
                      <DropdownMenuItem
                        key={organization.id}
                        onClick={() => selectOrganization(organization.id)}
                        className={cn(
                          "dropdown-item-custom",
                          currentOrganization.id === organization.id && "selected"
                        )}
                      >
                        <div className="dropdown-item-left">
                          <div
                            className={cn(
                              "dropdown-workspace-circle",
                              getWorkspaceGradient(organization.name)
                            )}
                          />
                          <div className="dropdown-item-meta">
                            <span className="dropdown-workspace-name">{organization.name}</span>
                            <span className="dropdown-workspace-plan">{organization.owner}</span>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <SidebarMenuButton size="lg" className="sidebar-switcher-trigger static">
                  <div
                    className={cn(
                      "workspace-circle-logo",
                      getWorkspaceGradient(currentWorkspace.name)
                    )}
                  />
                  <div className="workspace-title-wrapper group-data-[collapsible=icon]:hidden">
                    <span className="workspace-title-text">{currentWorkspace.name}</span>
                    <span className="workspace-subtitle-text">{currentOrganization.name}</span>
                  </div>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        <div className="sidebar-divider-custom" />
      </SidebarHeader>

      <SidebarContent className="sidebar-content-custom">
        {activeScope === "project" ? (
          <div className="sidebar-back-link-wrap group-data-[collapsible=icon]:hidden">
            <button onClick={goToOrganizationHome} className="sidebar-back-link-btn">
              <Undo2 size={14} />
              <span>Back to organization</span>
            </button>
          </div>
        ) : null}

        {navigationGroups.map((group, index) => (
          <div key={group.id}>
            {index > 0 ? null : null}
            <SidebarGroup className="sidebar-group-custom">
              <SidebarGroupContent>
                <SidebarMenu className="sidebar-menu-gap">
                  {group.items.map((item) => {
                    const Icon = sectionIcons[item.icon];
                    return (
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
                              <Icon size={18} />
                            </div>
                            <span className="sidebar-nav-label group-data-[collapsible=icon]:hidden">
                              {item.title}
                            </span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ))}

        {activeScope === "organization" ? (
          <>
            <div className="sidebar-group-separator" />
            <SidebarGroup className="sidebar-group-custom">
              <SidebarGroupLabel className="sidebar-group-label-custom group-data-[collapsible=icon]:hidden">
                Projects
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="sidebar-menu-gap">
                  {organizationProjects.map((workspace) => (
                    <SidebarMenuItem key={workspace.id}>
                      <SidebarMenuButton
                        isActive={false}
                        tooltip={workspace.name}
                        onClick={() => selectWorkspace(workspace.id)}
                        className={cn(
                          "sidebar-nav-button",
                          activeScope === "project" &&
                            currentWorkspace.id === workspace.id &&
                            "active"
                        )}
                      >
                        <div className="sidebar-nav-left">
                          <div
                            className={cn(
                              "sidebar-nav-org-dot",
                              getWorkspaceGradient(workspace.name)
                            )}
                          />
                          <span className="sidebar-nav-label group-data-[collapsible=icon]:hidden">
                            {workspace.name}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Create project"
                      onClick={() => {
                        const name = prompt("Project name:");
                        if (name?.trim()) createWorkspace(name.trim());
                      }}
                      className="sidebar-nav-button"
                    >
                      <div className="sidebar-nav-left">
                        <div className="sidebar-nav-icon">
                          <Plus size={18} />
                        </div>
                        <span className="sidebar-nav-label group-data-[collapsible=icon]:hidden">
                          Create project
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        ) : null}

        {activeScope === "project" ? (
          <>
            <div className="sidebar-group-separator" />
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
                  {chatSessions
                    .filter((session) => session.messages && session.messages.length > 0)
                    .map((session) => (
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
                            activeSection === "chat" &&
                              activeChatId === session.id &&
                              "active"
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
          </>
        ) : null}
      </SidebarContent>

      <SidebarSeparator className="sidebar-separator-custom" />

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

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Demo Mode"
              onClick={toggleDemoMode}
              className={cn("sidebar-nav-button", demoMode && "active")}
            >
              <div className="sidebar-nav-left">
                <div className="sidebar-nav-icon">
                  <Power size={18} />
                </div>
                <span className="sidebar-nav-label group-data-[collapsible=icon]:hidden">
                  Demo mode
                </span>
              </div>
              <div className="sidebar-toggle-pill group-data-[collapsible=icon]:hidden">
                <span className={cn("sidebar-toggle-dot", demoMode && "active")} />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
