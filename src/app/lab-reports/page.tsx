import type { Metadata } from "next";
import LabReportsClient, { LabReport } from "./LabReportsClient";
import PageBanner from "@/components/layout/PageBanner";

export const metadata: Metadata = {
  title: "Lab Reports & COA Results | Hemp & Barrel",
  description:
    "View third-party Certificates of Analysis (COA) for every Hemp & Barrel product — gummies, hempettes, CBD flower, and THCa flower strains. Full transparency guaranteed.",
};

const LAB_REPORTS_PAGE_ID = 14625;

interface LabReportsAcf {
  hero_eyebrow: string;
  hero_heading: string;
  hero_description: string;
  reports: LabReport[];
}

function heroTitle(heading: string) {
  const parts = heading.split(/\*(.+?)\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <span key={i} className="text-[#1A9248]">{part}</span> : part
  );
}

async function getContent(): Promise<LabReportsAcf | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages/${LAB_REPORTS_PAGE_ID}?acf_format=standard`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.acf ?? null;
}

export default async function LabReportsPage() {
  const acf = await getContent();
  if (!acf) return null;

  const categoryCounts = acf.reports.reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      {/* ── Hero ── */}
      <PageBanner
        crumbs={[{ label: "Lab Reports" }]}
        eyebrow={acf.hero_eyebrow}
        title={heroTitle(acf.hero_heading)}
        description={acf.hero_description}
        aside={
          <div className="flex gap-4 flex-shrink-0">
            {[
              { label: "COAs Published", value: String(acf.reports.length) },
              { label: "Product Categories", value: String(Object.keys(categoryCounts).length) },
              { label: "Testing Standard", value: "ISO" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-gray-100 shadow-sm rounded-2xl px-5 py-4 text-center min-w-[90px]">
                <p className="text-[#1A9248] text-[16.5px] font-bold">{s.value}</p>
                <p className="text-gray-400 text-[16.5px] uppercase tracking-wider mt-1 font-semibold leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        }
      />

      {/* ── Main content (client) ── */}
      <LabReportsClient reports={acf.reports} />
    </>
  );
}
