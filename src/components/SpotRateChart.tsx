"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BAND_COLORS, BAND_NAMES } from "@/lib/bands";
import type { ActivityTimelineEntry } from "@/lib/types";

const ALL_BANDS = [102, 103, 105, 106, 107, 108, 109, 110, 111];

export default function SpotRateChart({
  data,
}: {
  data: ActivityTimelineEntry[];
}) {
  const [activeBands, setActiveBands] = useState<Set<number>>(
    new Set(ALL_BANDS)
  );

  const toggleBand = (band: number) => {
    setActiveBands((prev) => {
      const next = new Set(prev);
      if (next.has(band)) {
        next.delete(band);
      } else {
        next.add(band);
      }
      return next;
    });
  };

  const showAll = () => setActiveBands(new Set(ALL_BANDS));
  const showNone = () => setActiveBands(new Set());

  const chartData = data.map((d) => ({
    label: `${d.date.slice(5)} ${String(d.hour).padStart(2, "0")}z`,
    ...Object.fromEntries(
      ALL_BANDS.map((b) => [
        BAND_NAMES[b],
        activeBands.has(b)
          ? (d[`band_${b}` as keyof ActivityTimelineEntry] as number)
          : 0,
      ])
    ),
  }));

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-400">
          Spot Rate by Band (hourly)
        </h3>
        <div className="flex gap-1 flex-wrap justify-end">
          <button
            onClick={showAll}
            className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-500 hover:text-slate-300"
          >
            All
          </button>
          <button
            onClick={showNone}
            className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-500 hover:text-slate-300"
          >
            None
          </button>
          {ALL_BANDS.map((b) => (
            <button
              key={b}
              onClick={() => toggleBand(b)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                activeBands.has(b)
                  ? "text-slate-100"
                  : "bg-slate-800 text-slate-600"
              }`}
              style={
                activeBands.has(b)
                  ? { backgroundColor: BAND_COLORS[b] }
                  : undefined
              }
            >
              {BAND_NAMES[b]}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#94a3b8", fontSize: 9 }}
            interval={23}
            angle={-45}
            textAnchor="end"
            height={50}
          />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: "#1e293b",
              border: "1px solid #334155",
            }}
            labelStyle={{ color: "#f1f5f9" }}
          />
          {ALL_BANDS.map((b) => (
            <Area
              key={b}
              type="monotone"
              dataKey={BAND_NAMES[b]}
              stackId="1"
              fill={BAND_COLORS[b]}
              stroke={BAND_COLORS[b]}
              fillOpacity={activeBands.has(b) ? 0.6 : 0}
              strokeOpacity={activeBands.has(b) ? 1 : 0}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
