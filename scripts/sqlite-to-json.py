#!/usr/bin/env python3
"""Convert per-DXpedition SQLite dataset to static JSON files for the SPA.

Reads a SQLite file produced by export_dxpedition_analysis.py and writes
7 JSON files to src/data/{slug}/ for the Next.js demo site.

Usage:
  python scripts/sqlite-to-json.py \
    --input 3y0k-bouvet-2026.sqlite \
    --slug 3y0k \
    --output src/data/3y0k
"""
import argparse
import json
import math
import sqlite3
from collections import defaultdict
from pathlib import Path

BAND_NAMES = {
    102: "160m", 103: "80m", 104: "60m", 105: "40m", 106: "30m",
    107: "20m", 108: "17m", 109: "15m", 110: "12m", 111: "10m",
}


def grid_to_latlon(grid):
    if not grid or len(grid) < 4:
        return None, None
    g = grid.upper()
    lon = (ord(g[0]) - 65) * 20 - 180 + int(g[2]) * 2 + 1
    lat = (ord(g[1]) - 65) * 10 - 90 + int(g[3]) + 0.5
    return lat, lon


def grid_to_continent(grid):
    lat, lon = grid_to_latlon(grid)
    if lat is None:
        return "Unknown"
    if 15 <= lat <= 72 and -170 <= lon <= -50:
        return "NA"
    if lat < 15 and lon >= -90 and lon <= -30:
        return "SA"
    if 35 <= lat <= 72 and -10 <= lon <= 60:
        return "EU"
    if -40 <= lat <= 37 and -20 <= lon <= 55:
        return "AF"
    if -10 <= lat <= 70 and 55 <= lon <= 180:
        return "AS"
    if -50 <= lat <= -10 and 110 <= lon <= 180:
        return "OC"
    return "OC"


def export_info(conn, outdir):
    cur = conn.execute("SELECT * FROM dxpedition_info LIMIT 1")
    cols = [d[0] for d in cur.description]
    row = cur.fetchone()
    if not row:
        print("  WARNING: dxpedition_info is empty")
        return
    data = dict(zip(cols, row))
    with open(outdir / "info.json", "w") as f:
        json.dump(data, f, indent=2)
    print(f"  info.json: {len(data)} fields")


def export_signatures(conn, outdir, table, outname):
    cur = conn.execute(f"SELECT * FROM {table}")
    cols = [d[0] for d in cur.description]
    rows = [dict(zip(cols, r)) for r in cur.fetchall()]
    with open(outdir / outname, "w") as f:
        json.dump(rows, f, separators=(",", ":"))
    print(f"  {outname}: {len(rows)} rows")
    return rows


def export_solar(conn, outdir):
    cur = conn.execute("SELECT * FROM solar_timeline ORDER BY date, hour")
    cols = [d[0] for d in cur.description]
    rows = [dict(zip(cols, r)) for r in cur.fetchall()]
    with open(outdir / "solar-timeline.json", "w") as f:
        json.dump(rows, f, separators=(",", ":"))
    print(f"  solar-timeline.json: {len(rows)} rows")


def export_activity(conn, outdir):
    """Derive hourly activity from rbn_spots table."""
    try:
        cur = conn.execute("""
            SELECT date(timestamp) as date,
                   CAST(strftime('%H', timestamp) AS INTEGER) as hour,
                   band, COUNT(*) as cnt
            FROM rbn_spots
            GROUP BY date, hour, band
            ORDER BY date, hour, band
        """)
    except sqlite3.OperationalError:
        print("  activity-timeline.json: SKIPPED (no rbn_spots table)")
        return

    activity = defaultdict(lambda: {"total": 0})
    for date, hour, band, cnt in cur:
        key = (date, hour)
        activity[key]["date"] = date
        activity[key]["hour"] = hour
        activity[key][f"band_{band}"] = cnt
        activity[key]["total"] += cnt

    rows = []
    for key in sorted(activity.keys()):
        entry = activity[key]
        for b in BAND_NAMES:
            entry.setdefault(f"band_{b}", 0)
        rows.append(entry)

    with open(outdir / "activity-timeline.json", "w") as f:
        json.dump(rows, f, separators=(",", ":"))
    print(f"  activity-timeline.json: {len(rows)} rows")


def export_band_stats(sigs, outdir):
    """Derive per-band stats from signature data."""
    band_data = defaultdict(list)
    band_grids = defaultdict(set)
    for s in sigs:
        b = s["band"]
        band_data[b].append(s)
        band_grids[b].add(s["rx_grid_4"])

    stats = []
    for band_id in sorted(BAND_NAMES.keys()):
        entries = band_data.get(band_id, [])
        if not entries:
            continue
        snrs = [e["median_snr"] for e in entries]
        spots = sum(e["spot_count"] for e in entries)
        hours = [e["hour"] for e in entries]
        hour_spots = defaultdict(int)
        for e in entries:
            hour_spots[e["hour"]] += e["spot_count"]
        peak_hour = max(hour_spots, key=hour_spots.get) if hour_spots else 0

        stats.append({
            "band": band_id,
            "band_name": BAND_NAMES[band_id],
            "total_spots": spots,
            "unique_skimmers": len(band_grids[band_id]),
            "snr_min": round(min(snrs)),
            "snr_max": round(max(snrs)),
            "snr_median": round(sorted(snrs)[len(snrs) // 2]),
            "snr_mean": round(sum(snrs) / len(snrs), 1),
            "peak_hour": peak_hour,
            "first_spot_hour": min(hours),
            "last_spot_hour": max(hours),
            "snr_distribution": sorted([round(s) for s in snrs[:20]]),
        })

    with open(outdir / "band-stats.json", "w") as f:
        json.dump(stats, f, separators=(",", ":"))
    print(f"  band-stats.json: {len(stats)} bands")


def export_geography(sigs, outdir):
    """Derive geography data from signatures."""
    arcs = []
    continent_map = defaultdict(int)
    distance_bins = defaultdict(int)
    seen_arcs = set()

    for s in sigs:
        grid = s["rx_grid_4"]
        band = s["band"]
        key = (grid, band)
        if key in seen_arcs:
            continue
        seen_arcs.add(key)

        lat, lon = grid_to_latlon(grid)
        if lat is None:
            continue

        cont = grid_to_continent(grid)
        spots = s["spot_count"]
        arcs.append({
            "rx_grid_4": grid,
            "rx_lat": lat,
            "rx_lon": lon,
            "band": band,
            "spot_count": spots,
            "median_snr": s["median_snr"],
        })
        continent_map[(cont, band)] += spots

        dist = s.get("avg_distance", 0)
        bin_start = int(dist // 2000) * 2000
        distance_bins[(band, bin_start)] += spots

    continent_breakdown = [
        {"continent": c, "band": b, "band_name": BAND_NAMES.get(b, "?"), "spot_count": cnt}
        for (c, b), cnt in sorted(continent_map.items())
    ]
    dist_bins = [
        {"band": b, "band_name": BAND_NAMES.get(b, "?"),
         "bin_start": bs, "bin_end": bs + 2000, "count": cnt}
        for (b, bs), cnt in sorted(distance_bins.items())
    ]

    geo = {
        "continent_breakdown": continent_breakdown,
        "distance_bins": dist_bins,
        "arcs": arcs,
    }
    with open(outdir / "geography.json", "w") as f:
        json.dump(geo, f, separators=(",", ":"))
    print(f"  geography.json: {len(arcs)} arcs, {len(continent_breakdown)} continent entries")


def export_predictions(conn, outdir):
    """Export predictions table (IONIS + VOACAP) to JSON."""
    try:
        cur = conn.execute(
            "SELECT * FROM predictions LIMIT 1"
        )
        cols = [d[0] for d in cur.description]
    except sqlite3.OperationalError:
        print("  predictions.json: SKIPPED (no predictions table)")
        return

    has_voacap = "voacap_snr" in cols

    cur = conn.execute("SELECT * FROM predictions")
    rows = []
    for r in cur:
        d = dict(zip(cols, r))
        row = {
            "band": d["band"],
            "hour": d["hour"],
            "observed_snr": round(float(d["observed_snr"]), 1),
            "predicted_snr_db": round(float(d["predicted_snr_db"]), 1),
            "observed_sigma": round(float(d["observed_sigma"]), 3),
            "predicted_sigma": round(float(d["predicted_sigma"]), 3),
            "distance": round(float(d["distance"])),
            "kp": round(float(d["kp"]), 1),
            "overridden": bool(d["overridden"]),
            "source": d["source"],
        }
        if has_voacap:
            v = d.get("voacap_snr")
            row["voacap_snr"] = round(float(v), 1) if v is not None else None
        rows.append(row)

    with open(outdir / "predictions.json", "w") as f:
        json.dump(rows, f, separators=(",", ":"))
    voacap_count = sum(1 for r in rows if r.get("voacap_snr") is not None) if has_voacap else 0
    print(f"  predictions.json: {len(rows)} rows ({voacap_count} with VOACAP)")


def main():
    parser = argparse.ArgumentParser(description="Convert DXpedition SQLite to JSON for SPA")
    parser.add_argument("--input", required=True, help="Input SQLite file")
    parser.add_argument("--slug", required=True, help="DXpedition slug (e.g., 3y0k)")
    parser.add_argument("--output", required=True, help="Output directory")
    args = parser.parse_args()

    outdir = Path(args.output)
    outdir.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(args.input)
    print(f"Converting {args.input} -> {outdir}/")

    export_info(conn, outdir)
    rbn_sigs = export_signatures(conn, outdir, "rbn_signatures", "rbn-signatures.json")
    export_signatures(conn, outdir, "pskr_signatures", "pskr-signatures.json")
    export_solar(conn, outdir)
    export_activity(conn, outdir)
    export_band_stats(rbn_sigs, outdir)
    export_geography(rbn_sigs, outdir)
    export_predictions(conn, outdir)

    conn.close()
    print("Done.")


if __name__ == "__main__":
    main()
