"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BAND_COLORS, BAND_NAMES } from "@/lib/bands";
import type { ActivityTimelineEntry } from "@/lib/types";

const DISPLAY_BANDS = [105, 106, 107, 108, 109, 110, 111];

export default function SpotRateChart({
  data,
}: {
  data: ActivityTimelineEntry[];
}) {
  const chartData = data.map((d) => ({
    label: `${d.date.slice(5)} ${String(d.hour).padStart(2, "0")}z`,
    ...Object.fromEntries(
      DISPLAY_BANDS.map((b) => [
        BAND_NAMES[b],
        d[`band_${b}` as keyof ActivityTimelineEntry] as number,
      ])
    ),
  }));

  return (
    <div className="card">
      <h3 className="text-sm font-medium text-slate-400 mb-4">
        Spot Rate by Band (hourly)
      </h3>
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
          <Legend />
          {DISPLAY_BANDS.map((b) => (
            <Area
              key={b}
              type="monotone"
              dataKey={BAND_NAMES[b]}
              stackId="1"
              fill={BAND_COLORS[b]}
              stroke={BAND_COLORS[b]}
              fillOpacity={0.6}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
