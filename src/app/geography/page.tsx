import ContinentBreakdown from "@/components/ContinentBreakdown";
import DistanceHistogram from "@/components/DistanceHistogram";
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

      <div className="card">
        <h3 className="text-sm font-medium text-slate-400 mb-4">
          Path Map
        </h3>
        <div className="bg-slate-800 rounded-lg flex items-center justify-center h-[400px] text-slate-500">
          <div className="text-center">
            <p className="text-lg">Interactive Map</p>
            <p className="text-sm mt-1">
              Leaflet great-circle arcs from JD04 to {geo.arcs.length} receiver
              grids
            </p>
            <p className="text-xs mt-2 text-slate-600">
              (Leaflet requires client-side rendering — will be enabled with
              dynamic import)
            </p>
          </div>
        </div>
      </div>

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
