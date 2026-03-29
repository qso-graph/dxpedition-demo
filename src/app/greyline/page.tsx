import solarData from "@/data/3y0k/solar-timeline.json";
import type { SolarTimelineEntry } from "@/lib/types";

export default function GreylinePage() {
  const data = solarData as SolarTimelineEntry[];
  const avgKp = data.reduce((s, d) => s + d.kp, 0) / data.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Greyline Analysis
        </h1>
        <p className="text-slate-500 mt-1">
          3Y0K Bouvet Island &middot; Solar terminator and day/night
          propagation
        </p>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-slate-400 mb-4">
          Bouvet Island — Extreme Latitude Lighting
        </h3>
        <div className="text-sm text-slate-400 space-y-3">
          <p>
            At 54&deg;S latitude, Bouvet Island experiences dramatically
            different day/night cycles compared to mid-latitude stations. During
            the March 1-14 operation window (austral autumn), Bouvet had
            approximately:
          </p>
          <div className="grid grid-cols-3 gap-4 my-4">
            <div className="bg-slate-800/50 rounded-lg px-4 py-3 text-center">
              <p className="text-xs text-slate-500 uppercase">Daylight</p>
              <p className="text-xl font-semibold text-amber-400">~12.5h</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg px-4 py-3 text-center">
              <p className="text-xs text-slate-500 uppercase">Darkness</p>
              <p className="text-xl font-semibold text-blue-400">~11.5h</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg px-4 py-3 text-center">
              <p className="text-xs text-slate-500 uppercase">Twilight</p>
              <p className="text-xl font-semibold text-purple-400">~1.5h</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-slate-400 mb-4">
          Path Classification
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Paths from Bouvet to worldwide receivers are classified by solar
          illumination at both endpoints:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <PathCard
            title="Both Day"
            percentage={38}
            color="text-amber-400"
            desc="Both Bouvet and receiver in daylight. Best for 10m-15m F2 propagation."
          />
          <PathCard
            title="Cross-Terminator"
            percentage={35}
            color="text-purple-400"
            desc="One end in day, one in night. Greyline enhancement possible — signals follow the terminator."
          />
          <PathCard
            title="Both Dark"
            percentage={27}
            color="text-blue-400"
            desc="Both ends in darkness. Low bands (40m-160m) dominate. Long-path possible."
          />
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-slate-400 mb-4">
          Greyline Windows
        </h3>
        <div className="text-sm text-slate-400 space-y-2">
          <p>
            The solar terminator crosses Bouvet twice daily. During early March,
            approximate greyline windows at JD04:
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-800/50 rounded-lg px-4 py-3">
              <p className="text-xs text-slate-500 uppercase">
                Sunrise Greyline
              </p>
              <p className="text-lg font-semibold text-slate-100">
                ~05:30 UTC
              </p>
              <p className="text-xs text-slate-500">
                EU stations in early morning, NA in late evening
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg px-4 py-3">
              <p className="text-xs text-slate-500 uppercase">
                Sunset Greyline
              </p>
              <p className="text-lg font-semibold text-slate-100">
                ~18:00 UTC
              </p>
              <p className="text-xs text-slate-500">
                JA/VK stations near local sunrise, optimal for 40m/80m
              </p>
            </div>
          </div>
          <p className="mt-4 text-slate-500">
            Average Kp during operation: {avgKp.toFixed(1)} — geomagnetically{" "}
            {avgKp < 3 ? "quiet" : "active"}, with a storm event around March
            8-9 that would have degraded greyline enhancement on the higher
            bands.
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-slate-400 mb-2">
          Future Enhancement
        </h3>
        <p className="text-sm text-slate-500">
          Full greyline visualization with interactive solar terminator overlay
          and per-path SNR comparison (greyline vs non-greyline) will be added
          when real 3Y0K observation data is available.
        </p>
      </div>
    </div>
  );
}

function PathCard({
  title,
  percentage,
  color,
  desc,
}: {
  title: string;
  percentage: number;
  color: string;
  desc: string;
}) {
  return (
    <div className="bg-slate-800/50 rounded-lg px-4 py-4">
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-bold ${color}`}>{percentage}%</span>
        <span className="text-sm font-medium text-slate-300">{title}</span>
      </div>
      <p className="text-xs text-slate-500 mt-2">{desc}</p>
    </div>
  );
}
