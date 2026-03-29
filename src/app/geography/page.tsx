import ContinentBreakdown from "@/components/ContinentBreakdown";
import DistanceHistogram from "@/components/DistanceHistogram";
import PathMap from "@/components/PathMap";
import geoData from "@/data/3y0k/geography.json";
import info from "@/data/3y0k/info.json";
import { gridToLatLon } from "@/lib/grid";
import type { GeographyData, DxpeditionInfo } from "@/lib/types";

export default function GeographyPage() {
  const geo = geoData as GeographyData;
  const dxe = info as DxpeditionInfo;
  const latlon = gridToLatLon(dxe.grid);
  const lat = dxe.latitude ?? latlon?.[0] ?? 0;
  const lon = dxe.longitude ?? latlon?.[1] ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Geographic Reach</h1>
        <p className="text-slate-500 mt-1">
          3Y0K Bouvet Island &middot; Signal paths from {dxe.grid} (
          {Math.abs(lat).toFixed(1)}&deg;{lat < 0 ? "S" : "N"},{" "}
          {Math.abs(lon).toFixed(1)}&deg;{lon < 0 ? "W" : "E"})
        </p>
      </div>

      <PathMap arcs={geo.arcs} txLat={lat} txLon={lon} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContinentBreakdown data={geo.continent_breakdown} />
        <DistanceHistogram data={geo.distance_bins} />
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-slate-400 mb-3">
          Arc Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-lg px-4 py-3">
            <p className="text-xs text-slate-500 uppercase">Total Arcs</p>
            <p className="text-lg font-semibold text-slate-100">
              {geo.arcs.length}
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg px-4 py-3">
            <p className="text-xs text-slate-500 uppercase">Unique Grids</p>
            <p className="text-lg font-semibold text-slate-100">
              {new Set(geo.arcs.map((a) => a.rx_grid_4)).size}
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg px-4 py-3">
            <p className="text-xs text-slate-500 uppercase">Continents</p>
            <p className="text-lg font-semibold text-slate-100">
              {new Set(geo.continent_breakdown.map((c) => c.continent)).size}
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg px-4 py-3">
            <p className="text-xs text-slate-500 uppercase">Max Distance</p>
            <p className="text-lg font-semibold text-slate-100">
              {Math.max(...geo.distance_bins.map((d) => d.bin_end)).toLocaleString()} km
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
