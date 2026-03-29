export const BAND_NAMES: Record<number, string> = {
  102: "160m",
  103: "80m",
  104: "60m",
  105: "40m",
  106: "30m",
  107: "20m",
  108: "17m",
  109: "15m",
  110: "12m",
  111: "10m",
};

export const BAND_COLORS: Record<number, string> = {
  102: "#6366f1", // indigo
  103: "#8b5cf6", // violet
  104: "#a78bfa", // light violet
  105: "#3b82f6", // blue
  106: "#06b6d4", // cyan
  107: "#10b981", // emerald
  108: "#f59e0b", // amber
  109: "#f97316", // orange
  110: "#ef4444", // red
  111: "#ec4899", // pink
};

export const HF_BANDS = [102, 103, 104, 105, 106, 107, 108, 109, 110, 111];

export function bandName(id: number): string {
  return BAND_NAMES[id] ?? `${id}`;
}
