import type { Metadata } from "next";
import LabReportsClient from "./LabReportsClient";
import PageBanner from "@/components/layout/PageBanner";

export const metadata: Metadata = {
  title: "Lab Reports & COA Results | Hemp & Barrel",
  description:
    "View third-party Certificates of Analysis (COA) for every Hemp & Barrel product — gummies, hempettes, CBD flower, and THCa flower strains. Full transparency guaranteed.",
};

export default function LabReportsPage() {
  return (
    <>
      {/* ── Hero ── */}
      <PageBanner
        crumbs={[{ label: "Lab Reports" }]}
        eyebrow="Full Transparency"
        title={<>Lab Reports &amp; <span className="text-[#1A9248]">COA Results</span></>}
        description="Every product we carry is tested by an independent, ISO-accredited laboratory. Browse and download any Certificate of Analysis below."
        aside={
          <div className="flex gap-4 flex-shrink-0">
            {[
              { label: "COAs Published", value: "50+" },
              { label: "Product Categories", value: "4" },
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
      <LabReportsClient />
    </>
  );
}
