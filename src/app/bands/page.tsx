import SnrDistribution from "@/components/SnrDistribution";
import bandStats from "@/data/3y0k/band-stats.json";
import { BAND_COLORS } from "@/lib/bands";
import type { BandStat } from "@/lib/types";

export default function BandsPage() {
  const stats = bandStats as BandStat[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Band Performance</h1>
        <p className="text-slate-500 mt-1">
          3Y0K Bouvet Island &middot; All 10 HF bands including WARC
        </p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 text-left border-b border-slate-700">
              <th className="pb-2 pr-4">Band</th>
              <th className="pb-2 pr-4 text-right">Spots</th>
              <th className="pb-2 pr-4 text-right">Skimmers</th>
              <th className="pb-2 pr-4 text-right">SNR Med</th>
              <th className="pb-2 pr-4 text-right">SNR Range</th>
              <th className="pb-2 pr-4 text-right">Peak Hour</th>
            </tr>
          </thead>
          <tbody>
            {stats
              .sort((a, b) => b.total_spots - a.total_spots)
              .map((s) => (
                <tr
                  key={s.band}
                  className="border-b border-slate-800 hover:bg-slate-800/50"
                >
                  <td className="py-2 pr-4">
                    <span className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{
                          backgroundColor:
                            BAND_COLORS[s.band] ?? "#64748b",
                        }}
                      />
                      <span className="font-medium text-slate-200">
                        {s.band_name}
                      </span>
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-right text-slate-300">
                    {s.total_spots.toLocaleString()}
                  </td>
                  <td className="py-2 pr-4 text-right text-slate-400">
                    {s.unique_skimmers}
                  </td>
                  <td className="py-2 pr-4 text-right text-slate-300">
                    {s.snr_median} dB
                  </td>
                  <td className="py-2 pr-4 text-right text-slate-400">
                    {s.snr_min} &ndash; {s.snr_max} dB
                  </td>
                  <td className="py-2 pr-4 text-right text-slate-400">
                    {String(s.peak_hour).padStart(2, "0")}z
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <SnrDistribution stats={stats} />

      <div className="card">
        <h3 className="text-sm font-medium text-slate-400 mb-2">
          WARC Bands Note
        </h3>
        <p className="text-sm text-slate-500">
          17m and 12m (WARC bands) are excluded from major contests, making
          DXpeditions one of the best times to study propagation on these
          frequencies. 3Y0K operated on both, providing rare data from the
          extreme southern latitudes.
        </p>
      </div>
    </div>
  );
}
