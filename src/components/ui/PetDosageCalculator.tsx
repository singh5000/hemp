"use client";

import { useState } from "react";

const DOSAGE_TABLE = [
  { maxLbs: 10,  label: "Under 10 lbs",  low: 1,   mid: 3,   high: 5   },
  { maxLbs: 25,  label: "10–25 lbs",      low: 3,   mid: 5,   high: 10  },
  { maxLbs: 50,  label: "25–50 lbs",      low: 5,   mid: 10,  high: 15  },
  { maxLbs: 75,  label: "50–75 lbs",      low: 10,  mid: 15,  high: 20  },
  { maxLbs: 999, label: "75+ lbs",        low: 15,  mid: 20,  high: 30  },
];

export default function PetDosageCalculator() {
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<typeof DOSAGE_TABLE[0] | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const lbs = parseFloat(weight);
    if (!lbs || lbs <= 0) return;
    const row = DOSAGE_TABLE.find(r => lbs <= r.maxLbs) ?? DOSAGE_TABLE[DOSAGE_TABLE.length - 1];
    setResult(row);
  };

  return (
    <section className="border-t border-gray-100">
      <div className="max-w-[1320px] mx-auto px-4 py-14">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-[10px] font-bold text-[#1A9248] uppercase tracking-[0.3em]">CBD for Pets</span>
            <h2 className="text-[32px] font-bold text-[#2a1008] mt-2">Pet CBD Dosage Calculator</h2>
            <p className="text-gray-500 text-[16.5px] mt-2">Enter your pet&apos;s weight for a recommended starting dosage.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
            <form onSubmit={calculate} className="flex flex-col sm:flex-row items-end gap-4 mb-6">
              <div className="flex-1 w-full">
                <label className="text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-2 block">
                  Pet&apos;s Weight (lbs)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  placeholder="e.g. 30"
                  min="1"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[#3d2b1f] text-sm focus:outline-none focus:border-[#1A9248] placeholder:text-gray-300"
                />
              </div>
              <button type="submit"
                className="bg-[#1A9248] hover:bg-[#148038] text-white font-bold text-sm px-8 py-3 rounded-xl transition-colors w-full sm:w-auto">
                Calculate
              </button>
            </form>

            {result && (
              <div className="space-y-4 animate-[fadeSlideIn_0.3s_ease-out]">
                <p className="text-[16.5px] text-gray-500">
                  Recommended daily CBD dosage for a <strong className="text-[#3d2b1f]">{weight} lb</strong> pet:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#f5f0eb] rounded-xl p-4 text-center">
                    <p className="text-[16.5px] font-bold uppercase tracking-wider text-gray-500 mb-1">Low</p>
                    <p className="text-[16.5px] font-bold text-[#3d2b1f]">{result.low}<span className="text-sm font-normal text-gray-400">mg</span></p>
                    <p className="text-[16.5px] text-gray-400 mt-1">Mild support</p>
                  </div>
                  <div className="bg-[#1A9248]/10 border-2 border-[#1A9248]/20 rounded-xl p-4 text-center">
                    <p className="text-[16.5px] font-bold uppercase tracking-wider text-[#1A9248] mb-1">Medium</p>
                    <p className="text-[16.5px] font-bold text-[#1A9248]">{result.mid}<span className="text-sm font-normal text-[#1A9248]/60">mg</span></p>
                    <p className="text-[16.5px] text-[#1A9248]/70 mt-1">Recommended</p>
                  </div>
                  <div className="bg-[#f5f0eb] rounded-xl p-4 text-center">
                    <p className="text-[16.5px] font-bold uppercase tracking-wider text-gray-500 mb-1">High</p>
                    <p className="text-[16.5px] font-bold text-[#3d2b1f]">{result.high}<span className="text-sm font-normal text-gray-400">mg</span></p>
                    <p className="text-[16.5px] text-gray-400 mt-1">Strong support</p>
                  </div>
                </div>
                <p className="text-[16.5px] text-gray-400 leading-relaxed">
                  *Start with the low dose and gradually increase. Consult your veterinarian before starting any CBD regimen. These are general guidelines — individual needs may vary.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
