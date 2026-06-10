import { cn } from "@/lib/utils";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";

export function AppShell({ children }) {
  return (
    <SidebarProvider
      className={cn(
        "min-h-svh bg-[#0B0D0E]",
        "[--sidebar-width:16rem]",
        "[--sidebar-width-icon:3rem]"
      )}
    >
      <AppSidebar />
      <SidebarInset className="bg-[#0B0D0E] flex flex-col min-w-0">
        <AppHeader />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
