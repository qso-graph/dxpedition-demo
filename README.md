# DXpedition Propagation Analysis Demo

Interactive web app for exploring propagation data from major DXpeditions. Part of the [qso-graph](https://qso-graph.io) project.

## Live Demo

**[https://dxpedition-demo.vercel.app/](https://dxpedition-demo.vercel.app/)**

## Current: 3Y0K Bouvet Island (March 2026)

First activation in 6 years of the world's most wanted DXCC entity. 102,000+ QSOs from 54°S in the South Atlantic.

### Pages

- **Overview** — DXpedition info, key stats, solar summary
- **Solar Conditions** — SFI, Kp, Bz timeline across the analysis window
- **Activity Timeline** — Hourly spot rates by band
- **Band Performance** — Per-band statistics and SNR distributions
- **Geographic Reach** — Great-circle paths, distance histograms, continental breakdown
- **Greyline Analysis** — Solar terminator, day/night propagation paths

## Data Sources

- [Reverse Beacon Network](https://reversebeacon.net) — CW skimmer observations
- [PSK Reporter](https://pskreporter.info) — FT8/FT4 digital spots
- [NOAA SWPC](https://www.swpc.noaa.gov) — Solar flux, Kp index
- [GFZ Potsdam](https://www.gfz-potsdam.de) — Historical solar indices
- [DSCOVR L1](https://www.swpc.noaa.gov/products/real-time-solar-wind) — Solar wind Bz, speed, density

## Tech Stack

- Next.js 16 / TypeScript / Tailwind CSS
- Recharts for data visualization
- Leaflet for maps
- Static export — no server required

## Data Pipeline

```
export_dxpedition_analysis.py → SQLite dataset
sqlite-to-json.py → Static JSON files
Next.js static export → Vercel deployment
```

## Development

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # static export to out/
```

## License

MIT

## Credits

Built by [KI7MT](https://qrz.com/db/KI7MT) as part of the IONIS Sovereign AI Lab.
