export interface DxpeditionInfo {
  callsign: string;
  entity: string;
  dxcc_number?: number;
  grid: string;
  latitude?: number;
  longitude?: number;
  start_utc: string;
  end_utc: string;
  analysis_start: string;
  analysis_end: string;
  modes: string | string[];
  bands: string | string[];
  rbn_spot_count: number;
  pskr_spot_count: number;
  rbn_sig_count: number;
  pskr_sig_count: number;
  sfi_avg: number;
  sfi_min: number;
  sfi_max: number;
  kp_min: number;
  kp_max: number;
  qso_count?: number;
}

export interface Signature {
  tx_grid_4: string;
  rx_grid_4: string;
  band: number;
  hour: number;
  month: number;
  median_snr: number;
  spot_count: number;
  snr_std: number;
  reliability: number;
  avg_sfi: number;
  avg_kp: number;
  avg_distance: number;
  avg_azimuth: number;
}

export interface SolarTimelineEntry {
  date: string;
  hour: number;
  sfi: number;
  ssn: number;
  kp: number;
  ap: number;
  bz_min: number;
  bz_max: number;
  bz_avg: number;
  wind_speed: number;
  density: number;
}

export interface ActivityTimelineEntry {
  date: string;
  hour: number;
  band_102: number;
  band_103: number;
  band_104: number;
  band_105: number;
  band_106: number;
  band_107: number;
  band_108: number;
  band_109: number;
  band_110: number;
  band_111: number;
  total: number;
}

export interface BandStat {
  band: number;
  band_name: string;
  total_spots: number;
  unique_skimmers: number;
  snr_min: number;
  snr_max: number;
  snr_median: number;
  snr_mean: number;
  peak_hour: number;
  first_spot_hour: number;
  last_spot_hour: number;
  snr_distribution: number[];
}

export interface GeographyData {
  continent_breakdown: ContinentBand[];
  distance_bins: DistanceBin[];
  arcs: Arc[];
}

export interface ContinentBand {
  continent: string;
  band: number;
  band_name: string;
  spot_count: number;
}

export interface DistanceBin {
  band: number;
  band_name: string;
  bin_start: number;
  bin_end: number;
  count: number;
}

export interface Arc {
  rx_grid_4: string;
  rx_lat: number;
  rx_lon: number;
  band: number;
  spot_count: number;
  median_snr: number;
}

export interface DxpeditionIndex {
  dxpeditions: {
    slug: string;
    callsign: string;
    entity: string;
    grid: string;
    start: string;
    end: string;
  }[];
}
