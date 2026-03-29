"use client";

import { useEffect, useState } from "react";
import { BAND_COLORS, BAND_NAMES } from "@/lib/bands";
import type { Arc } from "@/lib/types";

const DISPLAY_BANDS = [102, 103, 105, 106, 107, 108, 109, 110, 111];

export default function PathMap({
  arcs,
  txLat,
  txLon,
}: {
  arcs: Arc[];
  txLat: number;
  txLon: number;
}) {
  const [selectedBand, setSelectedBand] = useState<number | null>(null);
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{
    arcs: Arc[];
    txLat: number;
    txLon: number;
    selectedBand: number | null;
  }> | null>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with Leaflet
    import("./PathMapLeaflet").then((mod) => {
      setMapComponent(() => mod.default);
    });
  }, []);

  const filteredArcs = selectedBand
    ? arcs.filter((a) => a.band === selectedBand)
    : arcs;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-400">
          Signal Paths from JD04 ({filteredArcs.length} arcs)
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setSelectedBand(null)}
            className={`px-2 py-1 text-xs rounded ${
              selectedBand === null
                ? "bg-slate-600 text-slate-100"
                : "bg-slate-800 text-slate-500 hover:text-slate-300"
            }`}
          >
            All
          </button>
          {DISPLAY_BANDS.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBand(b)}
              className={`px-2 py-1 text-xs rounded ${
                selectedBand === b
                  ? "text-slate-100"
                  : "bg-slate-800 text-slate-500 hover:text-slate-300"
              }`}
              style={
                selectedBand === b
                  ? { backgroundColor: BAND_COLORS[b] }
                  : undefined
              }
            >
              {BAND_NAMES[b]}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-lg overflow-hidden" style={{ height: 450 }}>
        {MapComponent ? (
          <MapComponent
            arcs={filteredArcs}
            txLat={txLat}
            txLon={txLon}
            selectedBand={selectedBand}
          />
        ) : (
          <div className="bg-slate-800 flex items-center justify-center h-full text-slate-500">
            Loading map...
          </div>
        )}
      </div>
    </div>
  );
}
