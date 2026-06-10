"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { navGroups } from "@/components/app-shared";
import { CustomTrigger } from "@/components/custom-trigger";
import { useAppStore } from "@/stores/useAppStore";
import { ChevronDown, Plus } from "lucide-react";

export function AppSidebar() {
  const {
    currentWorkspace,
    workspaces,
    activeSection,
    activeAnalyticsView,
    setActiveSection,
    setActiveAnalyticsView,
    selectWorkspace,
    createWorkspace,
  } = useAppStore();

  const handleNavClick = (item) => {
    if (item.view) {
      setActiveSection("analytics");
      setActiveAnalyticsView(item.view);
    } else if (item.section) {
      setActiveSection(item.section);
    }
  };

  const isItemActive = (item) => {
    if (item.view) {
      return activeSection === "analytics" && activeAnalyticsView === item.view;
    }
    if (item.section) {
      return activeSection === item.section;
    }
    return false;
  };

  return (
    <Sidebar
      className={cn(
        "border-r border-border",
        "transition-[left,right,top,width]"
      )}
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader className="h-12 flex-row items-center justify-between border-b border-border px-3">
        <div className="relative group w-full">
          <Button
            variant="ghost"
            className="w-full justify-between px-2 text-sm font-medium text-text-primary hover:bg-bg-hover"
          >
            <span className="truncate">{currentWorkspace.name}</span>
            <ChevronDown size={14} className="text-text-muted shrink-0" />
          </Button>
          <div className="absolute top-full left-0 w-56 mt-1 bg-bg-tertiary border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-1">
            <div className="px-3 py-2 text-xs text-text-muted font-medium uppercase tracking-wider">
              Workspaces
            </div>
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => selectWorkspace(ws.id)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-bg-hover transition-colors ${
                  ws.id === currentWorkspace.id ? "text-accent" : "text-text-primary"
                }`}
              >
                {ws.name}
              </button>
            ))}
            <div className="border-t border-border my-1" />
            <button
              onClick={() => {
                const name = prompt("Workspace name:");
                if (name?.trim()) createWorkspace(name.trim());
              }}
              className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-bg-hover transition-colors flex items-center gap-2"
            >
              <Plus size={14} />
              New Workspace
            </button>
          </div>
        </div>
        <CustomTrigger place="sidebar" />
      </SidebarHeader>

      <SidebarContent className="py-2">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-xs text-text-muted font-medium uppercase tracking-wider px-3 py-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isItemActive(item)}
                    tooltip={item.title}
                    onClick={() => handleNavClick(item)}
                    className={cn(
                      "text-text-secondary hover:bg-bg-hover hover:text-text-primary",
                      isItemActive(item) && "bg-bg-hover text-accent"
                    )}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-xs font-medium text-accent">U</span>
          </div>
          <span className="text-sm text-text-primary group-data-[collapsible=icon]:hidden">
            User
          </span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
