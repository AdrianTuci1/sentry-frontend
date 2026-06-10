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
  SidebarRail,
} from "@/components/ui/sidebar";
import { navItems } from "@/components/app-shared";
import { useAppStore } from "@/stores/useAppStore";
import { ChevronDown, Plus } from "lucide-react";

export function AppSidebar() {
  const {
    currentWorkspace,
    workspaces,
    activeSection,
    setActiveSection,
    selectWorkspace,
    createWorkspace,
  } = useAppStore();

  return (
    <Sidebar
      className={cn(
        "border-r border-border bg-[#131314]",
        "transition-[left,right,top,width]"
      )}
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader className="h-12 flex-row items-center justify-between border-b border-[#2A2D31] px-3 bg-[#131314]">
        <div className="relative group w-full">
          <button className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-medium text-[#E3E3E3] hover:bg-[#2A2D31] rounded-md transition-colors">
            <span className="truncate">{currentWorkspace.name}</span>
            <ChevronDown size={14} className="text-[#8E918F] shrink-0" />
          </button>
          <div className="absolute top-full left-0 w-56 mt-1 bg-[#1E1F20] border border-[#2A2D31] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-1">
            <div className="px-3 py-2 text-xs text-[#8E918F] font-medium uppercase tracking-wider">
              Workspaces
            </div>
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => selectWorkspace(ws.id)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2A2D31] transition-colors ${
                  ws.id === currentWorkspace.id ? "text-[#A8C7FA]" : "text-[#E3E3E3]"
                }`}
              >
                {ws.name}
              </button>
            ))}
            <div className="border-t border-[#2A2D31] my-1" />
            <button
              onClick={() => {
                const name = prompt("Workspace name:");
                if (name?.trim()) createWorkspace(name.trim());
              }}
              className="w-full text-left px-3 py-2 text-sm text-[#E3E3E3] hover:bg-[#2A2D31] transition-colors flex items-center gap-2"
            >
              <Plus size={14} />
              New Workspace
            </button>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2 bg-[#131314]">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={activeSection === item.id}
                tooltip={item.title}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "text-[#C4C7C5] hover:bg-[#2A2D31] hover:text-[#E3E3E3]",
                  activeSection === item.id && "bg-[#2A2D31] text-[#A8C7FA]"
                )}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#2A2D31] p-3 bg-[#131314]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#A8C7FA]/20 flex items-center justify-center">
            <span className="text-xs font-medium text-[#A8C7FA]">U</span>
          </div>
          <span className="text-sm text-[#E3E3E3] group-data-[collapsible=icon]:hidden">
            User
          </span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
