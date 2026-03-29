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

const DISPLAY_BANDS = [102, 103, 105, 106, 107, 108, 109, 110, 111];

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
              stackId="1"
              fill={BAND_COLORS[b]}
              fillOpacity={0.8}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-600 border-b border-slate-800">
              <th className="pb-1 pr-2 text-left">Band</th>
              {continents.map((c) => (
                <th key={c} className="pb-1 px-2 text-right">{c}</th>
              ))}
              <th className="pb-1 pl-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {DISPLAY_BANDS.map((b) => {
              const bandTotal = continents.reduce((sum, c) => {
                const entry = data.find((d) => d.continent === c && d.band === b);
                return sum + (entry?.spot_count ?? 0);
              }, 0);
              if (bandTotal === 0) return null;
              return (
                <tr key={b} className="border-b border-slate-800/50">
                  <td className="py-0.5 pr-2">
                    <span className="flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: BAND_COLORS[b] }}
                      />
                      <span className="text-slate-400">{BAND_NAMES[b]}</span>
                    </span>
                  </td>
                  {continents.map((c) => {
                    const entry = data.find((d) => d.continent === c && d.band === b);
                    const val = entry?.spot_count ?? 0;
                    return (
                      <td key={c} className={`py-0.5 px-2 text-right ${val > 0 ? "text-slate-400" : "text-slate-700"}`}>
                        {val > 0 ? val : "\u2014"}
                      </td>
                    );
                  })}
                  <td className="py-0.5 pl-2 text-right text-slate-300 font-medium">
                    {bandTotal}
                  </td>
                </tr>
              );
            }).filter(Boolean)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
