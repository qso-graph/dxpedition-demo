"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DistanceBin } from "@/lib/types";

export default function DistanceHistogram({
  data,
  band,
}: {
  data: DistanceBin[];
  band?: number;
}) {
  const filtered = band ? data.filter((d) => d.band === band) : data;

  // Aggregate by distance bin across bands if no filter
  const binMap = new Map<number, number>();
  for (const d of filtered) {
    binMap.set(d.bin_start, (binMap.get(d.bin_start) ?? 0) + d.count);
  }

  const chartData = [...binMap.entries()]
    .sort(([a], [b]) => a - b)
    .map(([start, count]) => ({
      distance: `${(start / 1000).toFixed(0)}-${((start + 2000) / 1000).toFixed(0)}k`,
      count,
    }));

  return (
    <div className="card">
      <h3 className="text-sm font-medium text-slate-400 mb-4">
        Distance Distribution (km)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="distance"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
          />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: "#1e293b",
              border: "1px solid #334155",
            }}
            labelStyle={{ color: "#f1f5f9" }}
            formatter={(value) => [
              Number(value).toLocaleString(),
              "Spots",
            ]}
          />
          <Bar dataKey="count" fill="#10b981" fillOpacity={0.7} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
