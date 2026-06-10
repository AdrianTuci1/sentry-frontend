import { cn } from "@/lib/utils";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";

export function AppShell({ children }) {
  return (
    <SidebarProvider
      className={cn(
        "min-h-svh bg-bg-primary",
        "[--sidebar-width:16rem]",
        "[--sidebar-width-icon:3rem]"
      )}
    >
      <AppSidebar />
      <SidebarInset className="bg-bg-primary">
        <AppHeader />
        <div className="flex flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
