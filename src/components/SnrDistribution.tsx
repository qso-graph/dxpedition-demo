"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BAND_COLORS } from "@/lib/bands";
import type { BandStat } from "@/lib/types";

export default function SnrDistribution({ stats }: { stats: BandStat[] }) {
  const chartData = stats
    .filter((s) => s.total_spots > 5)
    .map((s) => ({
      name: s.band_name,
      band: s.band,
      min: s.snr_min,
      q1: Math.round(s.snr_median - (s.snr_median - s.snr_min) * 0.5),
      median: s.snr_median,
      q3: Math.round(s.snr_median + (s.snr_max - s.snr_median) * 0.4),
      max: s.snr_max,
      range: s.snr_max - s.snr_min,
    }));

  return (
    <div className="card">
      <h3 className="text-sm font-medium text-slate-400 mb-4">
        SNR Range by Band (dB)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            type="number"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            label={{
              value: "SNR (dB)",
              position: "bottom",
              fill: "#94a3b8",
              fontSize: 12,
            }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            width={50}
          />
          <Tooltip
            contentStyle={{
              background: "#1e293b",
              border: "1px solid #334155",
            }}
            labelStyle={{ color: "#f1f5f9" }}
            formatter={(value, name) => [
              `${value} dB`,
              name === "range" ? "Range" : String(name),
            ]}
          />
          <Bar dataKey="min" stackId="a" fill="transparent" />
          <Bar dataKey="range" stackId="a">
            {chartData.map((entry) => (
              <Cell
                key={entry.name}
                fill={BAND_COLORS[entry.band]}
                fillOpacity={0.7}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
