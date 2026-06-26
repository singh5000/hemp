"use client";

import { useState, useCallback } from "react";

interface Props {
  min: number;
  max: number;
  step: number;
  currentMax: number;
  onApply: (max: string) => void;
}

export default function PriceRangeSlider({ min, max, step, currentMax, onApply }: Props) {
  const [val, setVal] = useState(currentMax);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVal(Number(e.target.value));
  }, []);

  const handleRelease = useCallback(() => {
    onApply(val >= max ? "" : String(val));
  }, [val, max, onApply]);

  const pct = ((val - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span>${min}</span>
        <span>${max}</span>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute inset-x-0 h-1.5 bg-gray-200 rounded-full" />
        <div className="absolute left-0 h-1.5 bg-[#1A9248] rounded-full" style={{ width: `${pct}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={val}
          onChange={handleChange}
          onMouseUp={handleRelease}
          onTouchEnd={handleRelease}
          className="price-range-input absolute inset-x-0 w-full h-5 appearance-none bg-transparent cursor-pointer"
        />
      </div>
      <p className="text-center text-xs text-gray-600 mt-2">
        Up to <strong>${val}</strong>
      </p>
    </div>
  );
}
