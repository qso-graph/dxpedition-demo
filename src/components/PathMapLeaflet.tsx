"use client";

import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { BAND_COLORS, BAND_NAMES } from "@/lib/bands";
import type { Arc } from "@/lib/types";

export default function PathMapLeaflet({
  arcs,
  txLat,
  txLon,
  selectedBand,
}: {
  arcs: Arc[];
  txLat: number;
  txLon: number;
  selectedBand: number | null;
}) {
  return (
    <MapContainer
      center={[txLat, txLon]}
      zoom={2}
      style={{ height: "100%", width: "100%", background: "#0f172a" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {/* TX location — DXpedition */}
      <CircleMarker
        center={[txLat, txLon]}
        radius={8}
        pathOptions={{
          color: "#f59e0b",
          fillColor: "#f59e0b",
          fillOpacity: 1,
          weight: 2,
        }}
      >
        <Tooltip permanent direction="top" offset={[0, -10]}>
          <span style={{ color: "#f59e0b", fontWeight: "bold" }}>
            3Y0K — JD04
          </span>
        </Tooltip>
      </CircleMarker>

      {/* Arcs */}
      {arcs.map((arc, i) => {
        const color = BAND_COLORS[arc.band] ?? "#64748b";
        const opacity = selectedBand ? 0.7 : 0.3;
        return (
          <Polyline
            key={`${arc.rx_grid_4}-${arc.band}-${i}`}
            positions={[
              [txLat, txLon],
              [arc.rx_lat, arc.rx_lon],
            ]}
            pathOptions={{
              color,
              weight: Math.min(3, Math.max(1, arc.spot_count / 100)),
              opacity,
            }}
          >
            <Tooltip>
              <div style={{ fontSize: 12 }}>
                <strong>{arc.rx_grid_4}</strong> — {BAND_NAMES[arc.band] ?? arc.band}
                <br />
                {arc.spot_count} spots, {arc.median_snr} dB median
              </div>
            </Tooltip>
          </Polyline>
        );
      })}

      {/* RX locations */}
      {arcs.map((arc, i) => {
        const color = BAND_COLORS[arc.band] ?? "#64748b";
        return (
          <CircleMarker
            key={`rx-${arc.rx_grid_4}-${arc.band}-${i}`}
            center={[arc.rx_lat, arc.rx_lon]}
            radius={3}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.8,
              weight: 1,
            }}
          />
        );
      })}
    </MapContainer>
  );
}
