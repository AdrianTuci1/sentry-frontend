import { ViewFrame } from "@/components/shell/ViewFrame";
import FeatureMindMap from "@/components/mindmap/DetachedMindMap";

export function GraphView() {
  return (
    <ViewFrame
      title="Graph"
      description="Telemetry connection topology visual graph."
    >
      <div className="flex-1 min-h-[600px] h-[75vh] w-full border border-white/10 rounded-xl overflow-hidden bg-[#0F1012] relative">
        <FeatureMindMap />
      </div>
    </ViewFrame>
  );
}
