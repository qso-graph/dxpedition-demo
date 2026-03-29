import SolarTimeline from "@/components/SolarTimeline";
import solarData from "@/data/3y0k/solar-timeline.json";
import type { SolarTimelineEntry } from "@/lib/types";

export default function SolarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Solar Conditions</h1>
        <p className="text-slate-500 mt-1">
          3Y0K Bouvet Island &middot; Feb 27 &ndash; Mar 16, 2026 (analysis
          window with &plusmn;48h padding)
        </p>
      </div>
      <SolarTimeline data={solarData as SolarTimelineEntry[]} />
    </div>
  );
}
