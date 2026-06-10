import { useAppStore } from "@/stores/useAppStore";
import { analyticsViews } from "@/components/app-shared";
import { Bell, Search, ChevronDown, RefreshCw } from "lucide-react";

export function AppHeader() {
  const {
    activeSection,
    activeAnalyticsView,
    setActiveAnalyticsView,
  } = useAppStore();

  const isAnalytics = activeSection === "analytics";

  return (
    <header className="border-b border-[#2A2D31] bg-[#131314] px-4 py-3">
      <div className="max-w-7xl mx-auto">
        {/* Top row - Title and controls */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-[#E3E3E3]">
              {isAnalytics ? "Analytics" : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-md hover:bg-[#2A2D31] text-[#8E918F] transition-colors">
              <Search size={16} />
            </button>
            <button className="p-2 rounded-md hover:bg-[#2A2D31] text-[#8E918F] transition-colors relative">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#A8C7FA] rounded-full" />
            </button>
            <div className="w-7 h-7 rounded-full bg-[#A8C7FA]/20 flex items-center justify-center ml-1">
              <span className="text-xs font-medium text-[#A8C7FA]">U</span>
            </div>
          </div>
        </div>

        {/* Bottom row - View switcher and filters */}
        {isAnalytics && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {analyticsViews.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setActiveAnalyticsView(view.id)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    activeAnalyticsView === view.id
                      ? "bg-[#2A2D31] text-[#A8C7FA] font-medium"
                      : "text-[#8E918F] hover:bg-[#2A2D31] hover:text-[#E3E3E3]"
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select className="appearance-none bg-[#1E1F20] border border-[#2A2D31] rounded-md px-3 py-1.5 pr-8 text-xs text-[#E3E3E3] focus:outline-none focus:border-[#A8C7FA]">
                  <option>Last 1h</option>
                  <option>Last 6h</option>
                  <option>Last 24h</option>
                  <option>Last 7d</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8E918F] pointer-events-none" />
              </div>
              <button className="p-1.5 rounded-md hover:bg-[#2A2D31] text-[#8E918F] transition-colors">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
