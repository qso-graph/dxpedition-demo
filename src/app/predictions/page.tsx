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
          Storm Impact — Model Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-left border-b border-slate-700">
                <th className="pb-2 pr-4">Condition</th>
                <th className="pb-2 pr-4 text-right">Paths</th>
                <th className="pb-2 pr-4 text-right">Obs Mean (sigma)</th>
                <th className="pb-2 pr-4 text-right">Pred Mean (sigma)</th>
                <th className="pb-2 pr-4 text-right">Bias</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 text-slate-300">
                  RBN Quiet (Kp &lt; 2)
                </td>
                <td className="py-2 pr-4 text-right text-slate-400">
                  {quiet.length}
                </td>
                <td className="py-2 pr-4 text-right text-slate-300">
                  {avgObsQuiet.toFixed(2)}
                </td>
                <td className="py-2 pr-4 text-right text-slate-300">
                  {avgPredQuiet.toFixed(2)}
                </td>
                <td className="py-2 pr-4 text-right text-emerald-400">
                  {(avgPredQuiet - avgObsQuiet).toFixed(2)}
                </td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 text-slate-300">
                  RBN Storm (Kp &ge; 4)
                </td>
                <td className="py-2 pr-4 text-right text-slate-400">
                  {storm.length}
                </td>
                <td className="py-2 pr-4 text-right text-slate-300">
                  {avgObsStorm.toFixed(2)}
                </td>
                <td className="py-2 pr-4 text-right text-slate-300">
                  {avgPredStorm.toFixed(2)}
                </td>
                <td className="py-2 pr-4 text-right text-red-400">
                  {(avgPredStorm - avgObsStorm).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          During quiet conditions the model tracks well. During the Kp 6.0
          storm event, the model underpredicts the degradation — it sees the
          Kp rise but doesn&apos;t suppress signals as much as reality shows.
          This is a known limitation: V22-gamma&apos;s Storm Sidecar was
          trained on mid-latitude paths, not extreme southern polar geometry.
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

      <div className="card">
        <h3 className="text-sm font-medium text-slate-400 mb-2">
          About These Predictions
        </h3>
        <p className="text-sm text-slate-500">
          IONIS V22-gamma (207K params) predicts HF SNR from path geometry,
          frequency, and solar conditions. The model was trained on 175M+
          WSPR/RBN/Contest signatures — but Bouvet Island (JD04) is a grid
          with virtually zero training coverage. These predictions test
          whether the model generalizes to unseen polar paths purely from
          learned ionospheric physics.
        </p>
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
