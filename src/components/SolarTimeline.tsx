"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { SolarTimelineEntry } from "@/lib/types";

export default function SolarTimeline({
  data,
}: {
  data: SolarTimelineEntry[];
}) {
  const chartData = data.map((d, i) => ({
    idx: i,
    label: `${d.date.slice(5)} ${String(d.hour).padStart(2, "0")}z`,
    sfi: d.sfi,
    kp: d.kp,
    bz: d.bz_avg,
  }));

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-sm font-medium text-slate-400 mb-4">
          Solar Flux Index (SFI)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="label"
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              interval={7}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{ background: "#1e293b", border: "1px solid #334155" }}
              labelStyle={{ color: "#f1f5f9" }}
            />
            <Line
              type="monotone"
              dataKey="sfi"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              name="SFI"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-slate-400 mb-4">
          Kp Index (Geomagnetic Activity)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="label"
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              interval={7}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} domain={[0, 6]} />
            <Tooltip
              contentStyle={{ background: "#1e293b", border: "1px solid #334155" }}
              labelStyle={{ color: "#f1f5f9" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="kp"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              name="Kp"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-slate-400 mb-4">
          IMF Bz (DSCOVR Solar Wind)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="label"
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              interval={7}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "#1e293b", border: "1px solid #334155" }}
              labelStyle={{ color: "#f1f5f9" }}
            />
            <Line
              type="monotone"
              dataKey="bz"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Bz (nT)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
