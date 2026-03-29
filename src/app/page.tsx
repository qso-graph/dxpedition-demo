import Link from "next/link";
import DxeInfoCard from "@/components/DxeInfoCard";
import info from "@/data/3y0k/info.json";
import type { DxpeditionInfo } from "@/lib/types";

const pages = [
  {
    href: "/solar",
    title: "Solar Conditions",
    desc: "SFI, Kp, Bz timeline across the 18-day analysis window",
    icon: "&#9788;",
  },
  {
    href: "/activity",
    title: "Activity Timeline",
    desc: "Hourly spot rates by band — when was the DXpedition active?",
    icon: "&#9202;",
  },
  {
    href: "/bands",
    title: "Band Performance",
    desc: "Per-band statistics, SNR distributions, opening times",
    icon: "&#9835;",
  },
  {
    href: "/geography",
    title: "Geographic Reach",
    desc: "Great-circle paths, distance histograms, continental breakdown",
    icon: "&#127758;",
  },
  {
    href: "/greyline",
    title: "Greyline Analysis",
    desc: "Solar terminator, day/night paths, greyline enhancement",
    icon: "&#127769;",
  },
];

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <DxeInfoCard info={info as DxpeditionInfo} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="card card-hover block group"
          >
            <div className="flex items-start gap-3">
              <span
                className="text-2xl mt-0.5"
                dangerouslySetInnerHTML={{ __html: p.icon }}
              />
              <div>
                <h3 className="font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{p.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-slate-100 mb-3">
          About This Analysis
        </h2>
        <div className="text-sm text-slate-400 space-y-2">
          <p>
            3Y0K activated Bouvet Island (DXCC #24) from March 1-14, 2026 —
            the first activation in 6 years of the world&apos;s most wanted
            DXCC entity. Located at 54&deg;S in the South Atlantic, Bouvet
            presents extreme high-latitude propagation challenges.
          </p>
          <p>
            This analysis combines{" "}
            {info.rbn_spot_count.toLocaleString()} RBN
            skimmer observations and{" "}
            {info.pskr_spot_count.toLocaleString()} PSK
            Reporter spots with solar conditions data to map propagation
            patterns across all HF bands including WARC.
          </p>
          <p>
            Data sources: Reverse Beacon Network, PSK Reporter, NOAA SWPC,
            GFZ Potsdam, DSCOVR L1.
          </p>
        </div>
      </div>
    </div>
  );
}
