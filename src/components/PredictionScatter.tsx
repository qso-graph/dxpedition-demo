"use client";

import { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { BAND_COLORS, BAND_NAMES } from "@/lib/bands";
import type { Prediction } from "@/lib/types";

const ALL_BANDS = [102, 103, 105, 106, 107, 108, 109, 110, 111];

export default function PredictionScatter({
  data,
}: {
  data: Prediction[];
}) {
  const [mode, setMode] = useState<"sigma" | "db">("sigma");
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [bandFilter, setBandFilter] = useState<number | null>(null);

  const filtered = data.filter((d) => {
    if (sourceFilter && d.source !== sourceFilter) return false;
    if (bandFilter && d.band !== bandFilter) return false;
    return true;
  });

  // Group by band for coloring
  const bandGroups = ALL_BANDS.map((b) => ({
    band: b,
    data: filtered
      .filter((d) => d.band === b)
      .map((d) => ({
        x: mode === "sigma" ? d.observed_sigma : d.observed_snr,
        y: mode === "sigma" ? d.predicted_sigma : d.predicted_snr_db,
        kp: d.kp,
        source: d.source,
        distance: d.distance,
        overridden: d.overridden,
        band: b,
      })),
  })).filter((g) => g.data.length > 0);

  const axisLabel = mode === "sigma" ? "SNR (z-score)" : "SNR (dB)";

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-sm font-medium text-slate-400">
          Predicted vs Observed ({filtered.length.toLocaleString()} points)
        </h3>
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setMode(mode === "sigma" ? "db" : "sigma")}
            className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            {mode === "sigma" ? "z-score" : "dB"}
          </button>
          <span className="text-slate-600 px-1">|</span>
          <button
            onClick={() => setSourceFilter(null)}
            className={`px-2 py-1 text-xs rounded ${
              !sourceFilter ? "bg-slate-600 text-slate-100" : "bg-slate-800 text-slate-500"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSourceFilter("RBN")}
            className={`px-2 py-1 text-xs rounded ${
              sourceFilter === "RBN" ? "bg-emerald-700 text-slate-100" : "bg-slate-800 text-slate-500"
            }`}
          >
            RBN
          </button>
          <button
            onClick={() => setSourceFilter("PSKR")}
            className={`px-2 py-1 text-xs rounded ${
              sourceFilter === "PSKR" ? "bg-blue-700 text-slate-100" : "bg-slate-800 text-slate-500"
            }`}
          >
            PSKR
          </button>
          <span className="text-slate-600 px-1">|</span>
          <button
            onClick={() => setBandFilter(null)}
            className={`px-2 py-1 text-xs rounded ${
              !bandFilter ? "bg-slate-600 text-slate-100" : "bg-slate-800 text-slate-500"
            }`}
          >
            All
          </button>
          {ALL_BANDS.map((b) => (
            <button
              key={b}
              onClick={() => setBandFilter(bandFilter === b ? null : b)}
              className={`px-2 py-1 text-xs rounded ${
                bandFilter === b ? "text-slate-100" : "bg-slate-800 text-slate-500"
              }`}
              style={bandFilter === b ? { backgroundColor: BAND_COLORS[b] } : undefined}
            >
              {BAND_NAMES[b]}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 40, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            type="number"
            dataKey="x"
            name="Observed"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            label={{
              value: `Observed ${axisLabel}`,
              position: "bottom",
              fill: "#94a3b8",
              fontSize: 12,
              offset: 20,
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Predicted"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            label={{
              value: `Predicted ${axisLabel}`,
              angle: -90,
              position: "insideLeft",
              fill: "#94a3b8",
              fontSize: 12,
            }}
          />
          <Tooltip
            content={({ payload }) => {
              if (!payload || !payload[0]) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-xs">
                  <p className="text-slate-100 font-medium">
                    {BAND_NAMES[d.band]} — {d.source}
                  </p>
                  <p className="text-slate-400">
                    Observed: {d.x.toFixed(2)} | Predicted: {d.y.toFixed(2)}
                  </p>
                  <p className="text-slate-500">
                    Kp: {d.kp.toFixed(1)} | {(d.distance / 1000).toFixed(0)}k km
                    {d.overridden ? " | Override" : ""}
                  </p>
                </div>
              );
            }}
          />
          <ReferenceLine
            segment={[
              { x: mode === "sigma" ? -3 : -10, y: mode === "sigma" ? -3 : -10 },
              { x: mode === "sigma" ? 3 : 50, y: mode === "sigma" ? 3 : 50 },
            ]}
            stroke="#f59e0b"
            strokeDasharray="5 5"
            strokeOpacity={0.5}
          />
          {bandGroups.map((g) => (
            <Scatter
              key={g.band}
              name={BAND_NAMES[g.band]}
              data={g.data}
              fill={BAND_COLORS[g.band]}
              fillOpacity={0.6}
              r={3}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-600 mt-2 text-center">
        Dashed line = perfect prediction (1:1). Points above = model overpredicts. Points below = model underpredicts.
      </p>
    </div>
  );
}
