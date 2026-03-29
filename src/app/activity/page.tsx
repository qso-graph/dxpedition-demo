import SpotRateChart from "@/components/SpotRateChart";
import activityData from "@/data/3y0k/activity-timeline.json";
import type { ActivityTimelineEntry } from "@/lib/types";

export default function ActivityPage() {
  const data = activityData as ActivityTimelineEntry[];
  const totalSpots = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Activity Timeline
        </h1>
        <p className="text-slate-500 mt-1">
          3Y0K Bouvet Island &middot; {totalSpots.toLocaleString()} RBN skimmer
          spots over 14 days
        </p>
      </div>
      <SpotRateChart data={data} />
      <div className="card">
        <h3 className="text-sm font-medium text-slate-400 mb-2">
          Reading This Chart
        </h3>
        <p className="text-sm text-slate-500">
          Each colored band shows hourly spot counts for that HF band. The
          stacked area reveals when the DXpedition was most active and which
          bands carried the most traffic. Gaps indicate rest periods or
          equipment changes. Diurnal patterns show propagation windows opening
          and closing with the solar terminator.
        </p>
      </div>
    </div>
  );
}
