# Reproducing the 3Y0K Analysis

This document describes how to reproduce the full analysis pipeline from raw
ClickHouse data to the live demo site. All scripts and data are public.

## Prerequisites

- ClickHouse with `rbn.bronze`, `pskr.bronze`, `solar.bronze`, `solar.dscovr`
- `voacapl` (v16.1207W) installed at `/usr/local/bin/voacapl`
- `~/itshfbc/` initialized via `makeitshfbc`
- Python 3.10+ with standard library only (no pip dependencies for export scripts)
- Node.js 20+ for the demo site
- IONIS V22-gamma checkpoint (for model predictions — requires PyTorch + MPS or CUDA)

## Step 1 — Export Dataset from ClickHouse

```bash
python dxpeditions/export_dxpedition_analysis.py \
  --callsign 3Y0K \
  --start 2026-03-01 \
  --end 2026-03-14 \
  --grid JD04 \
  --entity "Bouvet Island" \
  --output /mnt/sourceforge/dxpeditions/
```

**Script**: `ionis-devel/dxpeditions/export_dxpedition_analysis.py`
**Output**: `3y0k-bouvet-island-2026.sqlite` with 5 tables (rbn_spots,
rbn_signatures, pskr_signatures, solar_timeline, dxpedition_info)

## Step 2 — Generate IONIS V22-gamma Predictions

This step requires the production V22-gamma checkpoint and PyTorch. Run on a
machine with MPS (Mac) or CUDA (Linux) backend.

**Owner**: Watson (Mac Studio M3 Ultra)
**Method**: Load the DXpedition SQLite signatures, run V22-gamma inference on
each (grid_pair, band, hour, SFI, Kp) tuple, output predictions CSV.
**Script**: `ionis-jupyter/notebooks/dxpedition-3y0k-bouvet-2026.ipynb` (Section 7)
**Output**: `3y0k-predictions.csv` (6,964 rows)

The predictions CSV is then inserted into the SQLite `predictions` table:

```python
import csv, sqlite3

conn = sqlite3.connect("3y0k-bouvet-island-2026.sqlite")
conn.execute("""
    CREATE TABLE IF NOT EXISTS predictions (
        band INTEGER, hour INTEGER, observed_snr REAL,
        predicted_sigma REAL, distance REAL, kp REAL,
        overridden INTEGER, source TEXT,
        predicted_snr_db REAL, observed_sigma REAL
    )
""")
with open("3y0k-predictions.csv") as f:
    reader = csv.DictReader(f)
    rows = [(
        int(r['band']), int(r['hour']), float(r['observed_snr']),
        float(r['predicted_sigma']), float(r['distance']), float(r['kp']),
        1 if r['overridden'] == 'True' else 0, r['source'],
        float(r['predicted_snr_db']), float(r['observed_sigma'])
    ) for r in reader]
conn.executemany("INSERT INTO predictions VALUES (?,?,?,?,?,?,?,?,?,?)", rows)
conn.commit()
conn.close()
```

## Step 3 — Run VOACAP Predictions

```bash
python dxpeditions/voacap_dxpedition_runner.py \
  --input /mnt/sourceforge/dxpeditions/3y0k-bouvet-island-2026.sqlite \
  --workers 8 \
  --lat -54.42 \
  --lon 3.38
```

**Script**: `ionis-devel/dxpeditions/voacap_dxpedition_runner.py`
**Output**: Adds `voacap_snr` column to the `predictions`, `rbn_signatures`,
and `pskr_signatures` tables in the SQLite file.

**Important**: The `--lat` and `--lon` flags provide the exact DXpedition
coordinates. VOACAP's Fortran `antcalc.for` can crash at certain grid centroids
due to fixed-column format sensitivity. Use actual coordinates, not grid centroids.

**VOACAP configuration**: CCIR coefficients, Method 30 (complete system
performance), const17.voa antenna model (17 dBi constant gain). SSN derived
from SFI via `SSN ≈ SFI × 0.7`.

## Step 4 — Convert to Demo Site JSON

```bash
python scripts/sqlite-to-json.py \
  --input /mnt/sourceforge/dxpeditions/3y0k-bouvet-island-2026.sqlite \
  --slug 3y0k \
  --output src/data/3y0k
```

**Script**: `dxpedition-demo/scripts/sqlite-to-json.py`
**Output**: 8 JSON files in `src/data/3y0k/` (info, rbn-signatures,
pskr-signatures, solar-timeline, activity-timeline, band-stats, geography,
predictions)

## Step 5 — Build and Deploy

```bash
npm install
npm run build   # Static export to out/
git push        # Vercel auto-deploys from main
```

## Data Sources

| Source | URL | Data Used |
|--------|-----|-----------|
| Reverse Beacon Network | reversebeacon.net | CW skimmer spots (dx_call = '3Y0K') |
| PSK Reporter | pskreporter.info | FT8/FT4 digital spots (sender_call = '3Y0K') |
| GFZ Potsdam | gfz-potsdam.de | Historical SFI, SSN, Kp, Ap indices |
| NOAA DSCOVR L1 | swpc.noaa.gov | Solar wind Bz, speed, density |
| VOACAP | github.com/jawatson/voacapl | HF propagation prediction engine (v16.1207W) |

## Verification

Run the audit script to verify all claims match the data:

```bash
python scripts/audit.py  # (TODO: formalize the audit checks from this session)
```
