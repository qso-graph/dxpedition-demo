"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BAND_COLORS, BAND_NAMES } from "@/lib/bands";
import type { ContinentBand } from "@/lib/types";

const DISPLAY_BANDS = [105, 107, 109, 111];

export default function ContinentBreakdown({
  data,
}: {
  data: ContinentBand[];
}) {
  const continents = [...new Set(data.map((d) => d.continent))].sort();
  const chartData = continents.map((c) => {
    const row: Record<string, string | number> = { continent: c };
    for (const b of DISPLAY_BANDS) {
      const entry = data.find((d) => d.continent === c && d.band === b);
      row[BAND_NAMES[b]] = entry?.spot_count ?? 0;
    }
    return row;
  });

  return (
    <div className="card">
      <h3 className="text-sm font-medium text-slate-400 mb-4">
        Spots by Continent &amp; Band
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="continent"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: "#1e293b",
              border: "1px solid #334155",
            }}
            labelStyle={{ color: "#f1f5f9" }}
          />
          <Legend />
          {DISPLAY_BANDS.map((b) => (
            <Bar
              key={b}
              dataKey={BAND_NAMES[b]}
              fill={BAND_COLORS[b]}
              fillOpacity={0.8}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
