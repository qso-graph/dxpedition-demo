/**
 * Convert 4-char Maidenhead grid to lat/lon centroid.
 */
export function gridToLatLon(grid: string): [number, number] | null {
  if (!grid || grid.length < 4) return null;
  const g = grid.toUpperCase();
  const lon =
    (g.charCodeAt(0) - 65) * 20 - 180 + parseInt(g[2]) * 2 + 1;
  const lat =
    (g.charCodeAt(1) - 65) * 10 - 90 + parseInt(g[3]) + 0.5;
  return [lat, lon];
}

/**
 * Great-circle distance in km (Haversine).
 */
export function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

/**
 * Map grid square to continent (rough mapping by first letter).
 */
export function gridToContinent(grid: string): string {
  if (!grid || grid.length < 2) return "Unknown";
  const field = grid.substring(0, 2).toUpperCase();
  const lon = (field.charCodeAt(0) - 65) * 20 - 180 + 10;
  const lat = (field.charCodeAt(1) - 65) * 10 - 90 + 5;

  if (lat > 60 && lon > -30 && lon < 60) return "EU";
  if (lat >= 15 && lat <= 72 && lon >= -170 && lon <= -50) return "NA";
  if (lat < 15 && lat > -60 && lon >= -90 && lon <= -30) return "SA";
  if (lat >= -40 && lat <= 37 && lon >= -20 && lon <= 55) return "AF";
  if (lat >= -10 && lat <= 70 && lon >= 55 && lon <= 180) return "AS";
  if (lat >= -50 && lat <= -10 && lon >= 110 && lon <= 180) return "OC";
  if (lat >= 35 && lat <= 72 && lon >= -10 && lon <= 60) return "EU";
  return "OC";
}
