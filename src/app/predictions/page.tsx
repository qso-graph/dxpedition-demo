import PredictionScatter from "@/components/PredictionScatter";
import predictions from "@/data/3y0k/predictions.json";
import { BAND_NAMES, BAND_COLORS } from "@/lib/bands";
import type { Prediction } from "@/lib/types";

export default function PredictionsPage() {
  const data = predictions as Prediction[];

  const rbn = data.filter((d) => d.source === "RBN");
  const pskr = data.filter((d) => d.source === "PSKR");
  const quiet = rbn.filter((d) => d.kp < 2);
  const storm = rbn.filter((d) => d.kp >= 4);
  const overridden = data.filter((d) => d.overridden);

  const avgObsQuiet =
    quiet.reduce((s, d) => s + d.observed_sigma, 0) / (quiet.length || 1);
  const avgPredQuiet =
    quiet.reduce((s, d) => s + d.predicted_sigma, 0) / (quiet.length || 1);
  const avgObsStorm =
    storm.reduce((s, d) => s + d.observed_sigma, 0) / (storm.length || 1);
  const avgPredStorm =
    storm.reduce((s, d) => s + d.predicted_sigma, 0) / (storm.length || 1);

  // dB-scale storm comparison (3-way with VOACAP)
  const quietDb = {
    obs: quiet.reduce((s, d) => s + d.observed_snr, 0) / (quiet.length || 1),
    ionis: quiet.reduce((s, d) => s + d.predicted_snr_db, 0) / (quiet.length || 1),
    voacap: quiet.filter(d => d.voacap_snr != null).reduce((s, d) => s + (d.voacap_snr ?? 0), 0) / (quiet.filter(d => d.voacap_snr != null).length || 1),
  };
  const stormDb = {
    obs: storm.reduce((s, d) => s + d.observed_snr, 0) / (storm.length || 1),
    ionis: storm.reduce((s, d) => s + d.predicted_snr_db, 0) / (storm.length || 1),
    voacap: storm.filter(d => d.voacap_snr != null).reduce((s, d) => s + (d.voacap_snr ?? 0), 0) / (storm.filter(d => d.voacap_snr != null).length || 1),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Predictions vs Observations
        </h1>
        <p className="text-slate-500 mt-1">
          IONIS V22-gamma model predictions against {data.length.toLocaleString()}{" "}
          observed signatures from 3Y0K Bouvet Island
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatBox label="Total Predictions" value={data.length.toLocaleString()} />
        <StatBox label="RBN Paths" value={rbn.length.toLocaleString()} />
        <StatBox label="PSKR Paths" value={pskr.length.toLocaleString()} />
        <StatBox
          label="Physics Overrides"
          value={overridden.length.toString()}
          detail="Night/high-band closure"
        />
      </div>

      <PredictionScatter data={data} />

      <div className="card">
        <h3 className="text-sm font-medium text-slate-400 mb-4">
          Storm Impact — 3-Way Comparison (RBN, dB)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-left border-b border-slate-700">
                <th className="pb-2 pr-4">Condition</th>
                <th className="pb-2 pr-4 text-right">Paths</th>
                <th className="pb-2 pr-4 text-right">Observed</th>
                <th className="pb-2 pr-4 text-right">IONIS</th>
                <th className="pb-2 pr-4 text-right">VOACAP</th>
                <th className="pb-2 pr-4 text-right">IONIS Bias</th>
                <th className="pb-2 pr-4 text-right">VOACAP Bias</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 text-slate-300">
                  Quiet (Kp &lt; 2)
                </td>
                <td className="py-2 pr-4 text-right text-slate-400">
                  {quiet.length}
                </td>
                <td className="py-2 pr-4 text-right text-slate-300">
                  {quietDb.obs.toFixed(1)} dB
                </td>
                <td className="py-2 pr-4 text-right text-slate-300">
                  {quietDb.ionis.toFixed(1)} dB
                </td>
                <td className="py-2 pr-4 text-right text-slate-300">
                  {quietDb.voacap.toFixed(1)} dB
                </td>
                <td className="py-2 pr-4 text-right text-emerald-400">
                  {(quietDb.ionis - quietDb.obs) >= 0 ? "+" : ""}{(quietDb.ionis - quietDb.obs).toFixed(1)}
                </td>
                <td className="py-2 pr-4 text-right text-amber-400">
                  {(quietDb.voacap - quietDb.obs) >= 0 ? "+" : ""}{(quietDb.voacap - quietDb.obs).toFixed(1)}
                </td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 text-slate-300">
                  Storm (Kp &ge; 4)
                </td>
                <td className="py-2 pr-4 text-right text-slate-400">
                  {storm.length}
                </td>
                <td className="py-2 pr-4 text-right text-slate-300">
                  {stormDb.obs.toFixed(1)} dB
                </td>
                <td className="py-2 pr-4 text-right text-slate-300">
                  {stormDb.ionis.toFixed(1)} dB
                </td>
                <td className="py-2 pr-4 text-right text-slate-300">
                  {stormDb.voacap.toFixed(1)} dB
                </td>
                <td className="py-2 pr-4 text-right text-amber-400">
                  {(stormDb.ionis - stormDb.obs) >= 0 ? "+" : ""}{(stormDb.ionis - stormDb.obs).toFixed(1)}
                </td>
                <td className="py-2 pr-4 text-right text-red-400">
                  {(stormDb.voacap - stormDb.obs) >= 0 ? "+" : ""}{(stormDb.voacap - stormDb.obs).toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          During quiet conditions (Kp &lt; 2), IONIS tracks observed SNR
          within 0.2 dB. During the Kp 6.0 storm, observed SNR dropped from
          19.3 to 12.4 dB. IONIS correctly predicts degradation but
          underestimates the magnitude (+5.8 dB bias). VOACAP does not model
          geomagnetic effects (it uses monthly-median SSN only) and predicts
          severe band closure (&minus;245.9 dB) for paths that were actually
          open at reduced signal levels.
        </p>
        <p className="text-xs text-slate-500 mt-2">
          <strong className="text-slate-400">Note on VOACAP RMSE:</strong>{" "}
          VOACAP&apos;s &ldquo;band closed&rdquo; predictions (811 values
          below &minus;100 dB, e.g. &minus;994 dB on 160m) are not real SNR
          values — they represent circuits VOACAP considers impossible. These
          inflate VOACAP&apos;s RMSE to 98.3 dB. The mean bias
          (&minus;11.3 dB) is the fairer comparison metric. IONIS RMSE is
          9.8 dB.
        </p>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-slate-400 mb-4">
          IONIS V22-gamma vs VOACAP — Head-to-Head (RBN)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-left border-b border-slate-700">
                <th className="pb-2 pr-4">Band</th>
                <th className="pb-2 pr-4 text-right">Paths</th>
                <th className="pb-2 pr-4 text-right">Observed</th>
                <th className="pb-2 pr-4 text-right">IONIS</th>
                <th className="pb-2 pr-4 text-right">VOACAP</th>
                <th className="pb-2 pr-4 text-right">IONIS Bias</th>
                <th className="pb-2 pr-4 text-right">VOACAP Bias</th>
              </tr>
            </thead>
            <tbody>
              {[102, 103, 105, 106, 107, 108, 109, 110, 111]
                .map((b) => {
                  const bd = rbn.filter((d) => d.band === b && d.voacap_snr !== null);
                  if (bd.length === 0) return null;
                  const obsM = bd.reduce((s, d) => s + d.observed_snr, 0) / bd.length;
                  const ionisM = bd.reduce((s, d) => s + d.predicted_snr_db, 0) / bd.length;
                  const voacapM = bd.reduce((s, d) => s + (d.voacap_snr ?? 0), 0) / bd.length;
                  const ionisBias = ionisM - obsM;
                  const voacapBias = voacapM - obsM;
                  return (
                    <tr key={b} className="border-b border-slate-800">
                      <td className="py-2 pr-4">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full inline-block"
                            style={{ backgroundColor: BAND_COLORS[b] }}
                          />
                          <span className="text-slate-200">{BAND_NAMES[b]}</span>
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-right text-slate-400">{bd.length}</td>
                      <td className="py-2 pr-4 text-right text-slate-300">{obsM.toFixed(1)} dB</td>
                      <td className="py-2 pr-4 text-right text-slate-300">{ionisM.toFixed(1)} dB</td>
                      <td className="py-2 pr-4 text-right text-slate-300">{voacapM.toFixed(1)} dB</td>
                      <td className={`py-2 pr-4 text-right ${Math.abs(ionisBias) < 5 ? "text-emerald-400" : Math.abs(ionisBias) < 10 ? "text-amber-400" : "text-red-400"}`}>
                        {ionisBias >= 0 ? "+" : ""}{ionisBias.toFixed(1)}
                      </td>
                      <td className={`py-2 pr-4 text-right ${Math.abs(voacapBias) < 5 ? "text-emerald-400" : Math.abs(voacapBias) < 10 ? "text-amber-400" : "text-red-400"}`}>
                        {voacapBias >= 0 ? "+" : ""}{voacapBias.toFixed(1)}
                      </td>
                    </tr>
                  );
                })
                .filter(Boolean)}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          IONIS V22-gamma (207K params, trained on 175M signatures) vs VOACAP
          (1980s NTIA/ITS Fortran engine, CCIR ionospheric coefficients).
          Neither system was tuned for Bouvet Island paths. Bias color:
          green (&lt;5 dB), amber (5-10 dB), red (&gt;10 dB).
        </p>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-slate-400 mb-4">
          Per-Band Prediction Summary (RBN)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-left border-b border-slate-700">
                <th className="pb-2 pr-4">Band</th>
                <th className="pb-2 pr-4 text-right">Paths</th>
                <th className="pb-2 pr-4 text-right">Obs Mean</th>
                <th className="pb-2 pr-4 text-right">Pred Mean</th>
                <th className="pb-2 pr-4 text-right">Bias</th>
              </tr>
            </thead>
            <tbody>
              {[102, 103, 105, 106, 107, 108, 109, 110, 111]
                .map((b) => {
                  const bdata = rbn.filter((d) => d.band === b);
                  if (bdata.length === 0) return null;
                  const obsM =
                    bdata.reduce((s, d) => s + d.observed_sigma, 0) /
                    bdata.length;
                  const predM =
                    bdata.reduce((s, d) => s + d.predicted_sigma, 0) /
                    bdata.length;
                  const bias = predM - obsM;
                  return (
                    <tr key={b} className="border-b border-slate-800">
                      <td className="py-2 pr-4">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full inline-block"
                            style={{ backgroundColor: BAND_COLORS[b] }}
                          />
                          <span className="text-slate-200">
                            {BAND_NAMES[b]}
                          </span>
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-right text-slate-400">
                        {bdata.length}
                      </td>
                      <td className="py-2 pr-4 text-right text-slate-300">
                        {obsM.toFixed(2)}&#963;
                      </td>
                      <td className="py-2 pr-4 text-right text-slate-300">
                        {predM.toFixed(2)}&#963;
                      </td>
                      <td
                        className={`py-2 pr-4 text-right ${
                          Math.abs(bias) < 0.2
                            ? "text-emerald-400"
                            : Math.abs(bias) < 0.5
                            ? "text-amber-400"
                            : "text-red-400"
                        }`}
                      >
                        {bias >= 0 ? "+" : ""}
                        {bias.toFixed(2)}&#963;
                      </td>
                    </tr>
                  );
                })
                .filter(Boolean)}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Bias color: green (&lt;0.2&#963;), amber (0.2-0.5&#963;), red
          (&gt;0.5&#963;). JD04 has near-zero coverage in training data —
          this is the model&apos;s hardest test.
        </p>
      </div>

      <div className="card border-amber-900/50">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">
          Analysis Summary
        </h3>
        <div className="text-sm text-slate-400 space-y-3">
          <p>
            This comparison tests two independent HF propagation prediction
            systems against real observations from Bouvet Island &mdash; a
            location that neither system was specifically designed or tuned for.
          </p>
          <p>
            <strong className="text-slate-200">VOACAP</strong> is the
            industry-standard HF prediction engine, developed by NTIA/ITS in
            the 1980s and trusted by broadcasters, military planners, and radio
            amateurs for four decades. It uses climatological ionospheric
            coefficients (CCIR/URSI) derived from decades of ionosonde
            measurements to predict monthly-median circuit performance.
          </p>
          <p>
            <strong className="text-slate-200">IONIS V22-gamma</strong> is a
            neural network (207K parameters) trained on 175 million propagation
            signatures from WSPR beacons, RBN skimmers, and contest QSOs. It
            learns propagation patterns directly from observed data rather than
            from ionospheric models.
          </p>
          <p>
            Bouvet Island at 54&deg;S presents a genuine blind test for both
            systems. VOACAP&apos;s ionospheric coefficients have sparse
            coverage at extreme southern latitudes, and IONIS had virtually
            zero training data from grid JD04.
          </p>
          <p className="text-slate-300">
            The results show that IONIS tracks observed SNR within a few dB
            across most bands (overall bias: &minus;1.9 dB), while
            VOACAP&apos;s predictions diverge significantly at this latitude
            (overall bias: &minus;11.3 dB), particularly on the low bands
            where it underestimates propagation and on the high bands where
            it overestimates.
          </p>
          <p>
            This does not diminish VOACAP&apos;s value &mdash; it remains an
            essential tool and the foundation that the entire HF prediction
            field is built on. What it suggests is that data-driven approaches
            may extend prediction accuracy into regions where traditional
            climatological models have less observational support, such as
            extreme polar paths. Both approaches are complementary:
            VOACAP&apos;s physics-based framework provides interpretability
            and reliability across well-characterized paths, while ML models
            can generalize from large observational datasets to fill gaps in
            coverage.
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-slate-400 mb-2">
          About These Predictions
        </h3>
        <div className="text-sm text-slate-500 space-y-2">
          <p>
            IONIS V22-gamma predictions generated from the DXpedition
            signature dataset using the production checkpoint. VOACAP
            predictions generated by voacapl (v16.1207W) with CCIR
            coefficients, Method 30 (complete system performance), and
            const17 antenna model. Both systems received identical inputs:
            path geometry, frequency, and smoothed sunspot number.
          </p>
          <p>
            All data and code used in this comparison are publicly available.
            The 3Y0K dataset is on{" "}
            <a
              href="https://sourceforge.net/projects/ionis-ai/"
              className="text-slate-400 hover:text-slate-300 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SourceForge
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="card">
      <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-lg font-semibold text-slate-100 mt-1">{value}</p>
      {detail && <p className="text-xs text-slate-500 mt-0.5">{detail}</p>}
    </div>
  );
}
