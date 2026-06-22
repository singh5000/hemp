"use client";

const HEMP_LEAF = (
  <svg viewBox="0 0 64 64" fill="currentColor">
    <path d="M32 4c0 0-8 8-10 16-1 4 0 7 2 10-3-1-7-2-10-5 0 0 2 8 7 12-4-1-7-1-10-3 0 0 3 7 9 10-3 0-5 0-7-1 0 0 3 5 9 6H32h10c6-1 9-6 9-6-2 1-4 1-7 1 6-3 9-10 9-10-3 2-6 2-10 3 5-4 7-12 7-12-3 3-7 4-10 5 2-3 3-6 2-10C40 12 32 4 32 4z"/>
    <rect x="31" y="38" width="2" height="22" rx="1"/>
  </svg>
);

const CBD_DROPPER = (
  <svg viewBox="0 0 64 64" fill="currentColor">
    <rect x="26" y="2" width="12" height="8" rx="2"/>
    <rect x="30" y="10" width="4" height="12"/>
    <rect x="24" y="22" width="16" height="32" rx="6"/>
    <ellipse cx="32" cy="38" rx="4" ry="6" opacity="0.3"/>
    <path d="M30 54 L32 62 L34 54" opacity="0.5"/>
  </svg>
);

const GUMMY = (
  <svg viewBox="0 0 64 64" fill="currentColor">
    <ellipse cx="32" cy="36" rx="18" ry="20"/>
    <circle cx="24" cy="30" r="3" opacity="0.3"/>
    <circle cx="36" cy="28" r="2.5" opacity="0.3"/>
    <circle cx="30" cy="40" r="2" opacity="0.3"/>
    <ellipse cx="22" cy="20" rx="5" ry="8" transform="rotate(-30 22 20)"/>
    <ellipse cx="42" cy="20" rx="5" ry="8" transform="rotate(30 42 20)"/>
  </svg>
);

const VAPE = (
  <svg viewBox="0 0 64 64" fill="currentColor">
    <rect x="28" y="8" width="8" height="48" rx="4"/>
    <rect x="26" y="12" width="12" height="4" rx="1" opacity="0.3"/>
    <rect x="26" y="44" width="12" height="4" rx="1" opacity="0.3"/>
    <circle cx="32" cy="6" r="3" opacity="0.4"/>
    <path d="M30 2 Q32-2 34 2" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
  </svg>
);

const FLOWER_BUD = (
  <svg viewBox="0 0 64 64" fill="currentColor">
    <ellipse cx="32" cy="28" rx="14" ry="18"/>
    <ellipse cx="24" cy="22" rx="8" ry="12" transform="rotate(-15 24 22)" opacity="0.6"/>
    <ellipse cx="40" cy="22" rx="8" ry="12" transform="rotate(15 40 22)" opacity="0.6"/>
    <path d="M28 16 Q32 8 36 16" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
    <rect x="31" y="42" width="2" height="18" rx="1"/>
    <path d="M27 50 Q31 46 33 50" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
    <path d="M31 48 Q35 44 37 48" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
  </svg>
);

const CAPSULE = (
  <svg viewBox="0 0 64 64" fill="currentColor">
    <rect x="12" y="24" width="40" height="16" rx="8"/>
    <rect x="32" y="24" width="20" height="16" rx="8" opacity="0.5"/>
    <line x1="32" y1="24" x2="32" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
  </svg>
);

const MOLECULE = (
  <svg viewBox="0 0 64 64" fill="currentColor" opacity="0.8">
    <circle cx="32" cy="16" r="5"/>
    <circle cx="18" cy="36" r="5"/>
    <circle cx="46" cy="36" r="5"/>
    <circle cx="32" cy="52" r="4"/>
    <line x1="32" y1="21" x2="22" y2="32" stroke="currentColor" strokeWidth="2"/>
    <line x1="32" y1="21" x2="42" y2="32" stroke="currentColor" strokeWidth="2"/>
    <line x1="22" y1="40" x2="32" y2="49" stroke="currentColor" strokeWidth="2"/>
    <line x1="42" y1="40" x2="32" y2="49" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

interface FloatingIcon {
  svg: React.ReactNode;
  x: string;
  y: string;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
}

const ICONS: FloatingIcon[] = [
  // Hero area
  { svg: HEMP_LEAF, x: "3%", y: "8%", size: 32, duration: 8, delay: 0, rotate: 15 },
  { svg: CBD_DROPPER, x: "92%", y: "12%", size: 26, duration: 7, delay: 1.5, rotate: -10 },

  // Featured Products area
  { svg: GUMMY, x: "2%", y: "28%", size: 24, duration: 9, delay: 0.5, rotate: 8 },
  { svg: MOLECULE, x: "95%", y: "25%", size: 28, duration: 6, delay: 2, rotate: 0 },

  // Shop by Category area
  { svg: VAPE, x: "4%", y: "42%", size: 22, duration: 7.5, delay: 1, rotate: -5 },
  { svg: FLOWER_BUD, x: "93%", y: "40%", size: 30, duration: 8, delay: 3, rotate: 12 },

  // Education area
  { svg: CAPSULE, x: "96%", y: "55%", size: 26, duration: 6.5, delay: 0.8, rotate: 20 },
  { svg: HEMP_LEAF, x: "1%", y: "58%", size: 22, duration: 9, delay: 2.5, rotate: -20 },

  // Testimonials area
  { svg: CBD_DROPPER, x: "94%", y: "70%", size: 24, duration: 7, delay: 1.2, rotate: 10 },
  { svg: GUMMY, x: "3%", y: "75%", size: 20, duration: 8.5, delay: 0.3, rotate: -8 },

  // Store section area
  { svg: MOLECULE, x: "5%", y: "88%", size: 26, duration: 7, delay: 2, rotate: 5 },
  { svg: FLOWER_BUD, x: "92%", y: "85%", size: 22, duration: 6, delay: 1.8, rotate: -15 },
];

export default function FloatingHempIcons() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden hidden lg:block">
      {ICONS.map((icon, i) => (
        <div
          key={i}
          className="absolute text-[#1A9248]"
          style={{
            left: icon.x,
            top: icon.y,
            width: icon.size,
            height: icon.size,
            opacity: 0.18,
            transform: `rotate(${icon.rotate}deg)`,
            animation: `hempFloat ${icon.duration}s ease-in-out ${icon.delay}s infinite alternate`,
          }}
        >
          {icon.svg}
        </div>
      ))}

      <style>{`
        @keyframes hempFloat {
          0% {
            transform: translateY(0) rotate(var(--r, 0deg)) scale(1);
            opacity: 0.12;
          }
          33% {
            transform: translateY(-18px) rotate(calc(var(--r, 0deg) + 8deg)) scale(1.08);
            opacity: 0.22;
          }
          66% {
            transform: translateY(8px) rotate(calc(var(--r, 0deg) - 5deg)) scale(0.95);
            opacity: 0.15;
          }
          100% {
            transform: translateY(-10px) rotate(calc(var(--r, 0deg) + 3deg)) scale(1.02);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}
