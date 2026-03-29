import type { DxpeditionInfo } from "@/lib/types";
import { gridToLatLon } from "@/lib/grid";

function modesArray(modes: string | string[]): string[] {
  return Array.isArray(modes) ? modes : modes.split(", ").filter(Boolean);
}

function bandsArray(bands: string | string[]): string[] {
  return Array.isArray(bands) ? bands : bands.split(", ").filter(Boolean);
}

function dateDiffDays(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  return Math.round((e.getTime() - s.getTime()) / 86400000) + 1;
}

export default function DxeInfoCard({ info }: { info: DxpeditionInfo }) {
  const latlon = gridToLatLon(info.grid);
  const lat = info.latitude ?? latlon?.[0] ?? 0;
  const lon = info.longitude ?? latlon?.[1] ?? 0;
  const modes = modesArray(info.modes);
  const bands = bandsArray(info.bands);
  const duration = dateDiffDays(info.start_utc, info.end_utc);
  const totalSpots = info.rbn_spot_count + info.pskr_spot_count;

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-400">{info.callsign}</h1>
          <p className="text-xl text-slate-300 mt-1">{info.entity}</p>
          <p className="text-sm text-slate-500 mt-2">
            {info.dxcc_number ? `DXCC #${info.dxcc_number} · ` : ""}
            Grid {info.grid} &middot;{" "}
            {Math.abs(lat).toFixed(1)}&deg;{lat < 0 ? "S" : "N"},{" "}
            {Math.abs(lon).toFixed(1)}&deg;{lon < 0 ? "W" : "E"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-slate-100">
            {info.qso_count
              ? `${info.qso_count.toLocaleString()} QSOs`
              : `${totalSpots.toLocaleString()} spots`}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {info.start_utc.slice(0, 10)} &ndash; {info.end_utc.slice(0, 10)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <StatBox label="RBN Spots" value={info.rbn_spot_count.toLocaleString()} />
        <StatBox label="PSKR Spots" value={info.pskr_spot_count.toLocaleString()} />
        <StatBox label="Modes" value={modes.join(", ")} />
        <StatBox label="Bands" value={`${bands.length} HF`} />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <StatBox
          label="SFI"
          value={info.sfi_avg.toString()}
          detail={`${info.sfi_min} – ${info.sfi_max}`}
        />
        <StatBox
          label="Kp"
          value={`${info.kp_min} – ${info.kp_max}`}
          detail={info.kp_max >= 4 ? "Storm detected" : "Quiet"}
          highlight={info.kp_max >= 4}
        />
        <StatBox label="Duration" value={`${duration} days`} />
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  detail,
  highlight,
}: {
  label: string;
  value: string;
  detail?: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-slate-800/50 rounded-lg px-4 py-3">
      <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-lg font-semibold text-slate-100 mt-1">{value}</p>
      {detail && (
        <p
          className={`text-xs mt-0.5 ${
            highlight ? "text-red-400" : "text-slate-500"
          }`}
        >
          {detail}
        </p>
      )}
    </div>
  );
}
