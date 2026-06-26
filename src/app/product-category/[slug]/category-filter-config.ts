export interface FilterOption {
  label: string;
  value: string;
  color?: string;
  description?: string;
}

export interface FilterGroup {
  key: string;
  label: string;
  type: "single" | "multi";
  options: FilterOption[];
}

export interface PriceRangeConfig {
  min: number;
  max: number;
  step: number;
}

export interface CategoryFilterConfig {
  filters: FilterGroup[];
  priceRange: PriceRangeConfig | null;
}

const CONFIGS: Record<string, CategoryFilterConfig> = {
  "smokable-hemp-flower": {
    filters: [
      {
        key: "productType", label: "Product Type", type: "single",
        options: [
          { label: "Loose flower", value: "loose flower" },
          { label: "Pre-rolls", value: "pre-rolls" },
          { label: "Infused pre-rolls", value: "infused pre-rolls" },
          { label: "Hemp cigarettes", value: "hemp cigarettes" },
        ],
      },
      {
        key: "strain", label: "Strain Type", type: "single",
        options: [
          { label: "Indica", value: "indica", color: "#8b5cf6" },
          { label: "Sativa", value: "sativa", color: "#f97316" },
          { label: "Hybrid", value: "hybrid", color: "#1A9248" },
        ],
      },
      {
        key: "potency", label: "Potency", type: "single",
        options: [
          { label: "Mild — CBD", value: "cbd" },
          { label: "Medium — 20-27% THCA", value: "thca" },
          { label: "High — 27%+ THCA", value: "high thca" },
        ],
      },
    ],
    priceRange: { min: 10, max: 65, step: 5 },
  },

  "edibles-gummies": {
    filters: [
      {
        key: "productType", label: "Product Type", type: "single",
        options: [
          { label: "Gummies", value: "gummies" },
          { label: "Chocolates", value: "chocolates" },
          { label: "Functional / energy", value: "functional energy" },
        ],
      },
      {
        key: "cannabinoidType", label: "Cannabinoid Type", type: "single",
        options: [
          { label: "CBD only", value: "cbd", color: "#3b82f6" },
          { label: "Delta-8 THC", value: "delta-8", color: "#d97706" },
          { label: "Delta-9 THC", value: "delta-9", color: "#7c3aed" },
          { label: "Multi-cannabinoid blend", value: "multi-cannabinoid", color: "#059669" },
        ],
      },
      {
        key: "potency", label: "Potency (mg per piece)", type: "single",
        options: [
          { label: "Low — up to 10mg", value: "10mg" },
          { label: "Medium — 12-20mg", value: "20mg" },
          { label: "High — 30mg+", value: "30mg" },
          { label: "Extra high — 50mg+", value: "50mg" },
        ],
      },
      {
        key: "wellnessGoal", label: "Wellness Goal", type: "multi",
        options: [
          { label: "Sleep", value: "sleep" },
          { label: "Relaxation", value: "relaxation" },
          { label: "Energy & focus", value: "energy focus" },
          { label: "Stress relief", value: "stress relief" },
          { label: "Euphoria", value: "euphoria" },
        ],
      },
    ],
    priceRange: { min: 15, max: 65, step: 5 },
  },

  "cbd-pouches": {
    filters: [
      {
        key: "cannabinoidType", label: "Cannabinoid Type", type: "single",
        options: [
          { label: "CBD", value: "cbd", color: "#3b82f6" },
          { label: "Delta-8 THC", value: "delta-8", color: "#d97706" },
          { label: "HHCP", value: "hhcp", color: "#7c3aed" },
          { label: "THCP", value: "thcp", color: "#059669" },
        ],
      },
      {
        key: "flavorProfile", label: "Flavor Profile", type: "single",
        options: [
          { label: "Mint / Wintergreen", value: "mint wintergreen" },
          { label: "Fruit", value: "fruit" },
          { label: "Sweet / Candy", value: "sweet candy" },
          { label: "Spice / Earthy", value: "spice earthy" },
          { label: "Tea / Refreshing", value: "tea refreshing" },
        ],
      },
    ],
    priceRange: { min: 5, max: 30, step: 5 },
  },

  "infused-beverages": {
    filters: [
      {
        key: "beverageType", label: "Beverage Type", type: "single",
        options: [
          { label: "Seltzer", value: "seltzer" },
          { label: "Flavored can", value: "flavored can" },
          { label: "Mocktail / mixer", value: "mocktail mixer" },
          { label: "Sparkling wine", value: "sparkling wine" },
        ],
      },
      {
        key: "potency", label: "Potency (THC per serving)", type: "single",
        options: [
          { label: "Microdose — up to 6mg", value: "microdose" },
          { label: "Low — 10mg", value: "10mg" },
          { label: "Medium — 20-25mg", value: "20mg 25mg" },
          { label: "High — 75mg+", value: "75mg" },
        ],
      },
    ],
    priceRange: { min: 4, max: 150, step: 5 },
  },

  "tinctures": {
    filters: [
      {
        key: "spectrumType", label: "Spectrum Type", type: "single",
        options: [
          { label: "Full spectrum", value: "full spectrum", description: "Contains trace THC (<0.3%)" },
          { label: "Broad spectrum", value: "broad spectrum", description: "Multiple cannabinoids, no THC" },
          { label: "Isolate", value: "isolate", description: "CBD only, 0% THC" },
        ],
      },
      {
        key: "cannabinoid", label: "Cannabinoid", type: "single",
        options: [
          { label: "CBD only", value: "cbd" },
          { label: "CBD + CBG", value: "cbg" },
          { label: "CBD + THC", value: "thc" },
        ],
      },
      {
        key: "potency", label: "Potency (mg)", type: "single",
        options: [
          { label: "300mg", value: "300mg" },
          { label: "750mg", value: "750mg" },
          { label: "1000mg", value: "1000mg" },
          { label: "1500mg", value: "1500mg" },
          { label: "3000mg", value: "3000mg" },
        ],
      },
    ],
    priceRange: { min: 25, max: 160, step: 5 },
  },

  "topicals": {
    filters: [
      {
        key: "productType", label: "Product Type", type: "single",
        options: [
          { label: "Cream", value: "cream" },
          { label: "Balm", value: "balm" },
          { label: "Salve", value: "salve" },
          { label: "Roll-on", value: "roll-on" },
          { label: "Patch", value: "patch" },
          { label: "Face & skin care", value: "face skin care" },
          { label: "Body lotion", value: "body lotion" },
        ],
      },
      {
        key: "intendedUse", label: "Intended Use", type: "multi",
        options: [
          { label: "Pain & muscle relief", value: "pain muscle relief" },
          { label: "Pre-workout / activate", value: "pre-workout activate" },
          { label: "Recovery / post-recovery", value: "recovery post-recovery" },
          { label: "Skin care & hydration", value: "skin care hydration" },
          { label: "Stress & calm", value: "stress calm" },
          { label: "Sleep support", value: "sleep support" },
        ],
      },
      {
        key: "cannabinoid", label: "Cannabinoid", type: "single",
        options: [
          { label: "CBD — broad spectrum", value: "broad spectrum" },
          { label: "CBD — full spectrum", value: "full spectrum" },
          { label: "CBD + CBG", value: "cbg" },
          { label: "CBG — face mist", value: "cbg face mist" },
        ],
      },
      {
        key: "potency", label: "Potency (mg)", type: "single",
        options: [
          { label: "Under 300mg", value: "300mg" },
          { label: "300-750mg", value: "750mg" },
          { label: "750-1500mg", value: "1500mg" },
          { label: "1500mg+", value: "1500" },
        ],
      },
    ],
    priceRange: null,
  },

  "pets": {
    filters: [
      {
        key: "productType", label: "Product Type", type: "single",
        options: [
          { label: "CBD oil / tincture", value: "oil tincture" },
          { label: "Soft chews", value: "soft chews" },
          { label: "Biscuits / treats", value: "biscuits treats" },
        ],
      },
      {
        key: "petType", label: "Pet Type", type: "single",
        options: [
          { label: "Dogs", value: "dogs" },
          { label: "Cats", value: "cats" },
          { label: "Dogs & cats", value: "dogs cats" },
        ],
      },
    ],
    priceRange: { min: 25, max: 70, step: 5 },
  },

  "vapes": {
    filters: [
      {
        key: "productType", label: "Product Type", type: "single",
        options: [
          { label: "Disposable vape pen", value: "disposable vape pen" },
          { label: "510 cartridge", value: "510 cartridge" },
        ],
      },
      {
        key: "capacity", label: "Capacity", type: "single",
        options: [
          { label: "0.5ml", value: "0.5ml" },
          { label: "1ml", value: "1ml" },
          { label: "2ml", value: "2ml" },
        ],
      },
      {
        key: "cannabinoidType", label: "Cannabinoid Type", type: "single",
        options: [
          { label: "THCA blend", value: "thca", color: "#059669" },
          { label: "Delta-8 THC", value: "delta-8", color: "#d97706" },
          { label: "CBD", value: "cbd", color: "#3b82f6" },
        ],
      },
      {
        key: "strain", label: "Strain Type", type: "single",
        options: [
          { label: "Indica", value: "indica", color: "#8b5cf6" },
          { label: "Sativa", value: "sativa", color: "#f97316" },
          { label: "Hybrid", value: "hybrid", color: "#1A9248" },
        ],
      },
      {
        key: "availability", label: "Availability", type: "single",
        options: [
          { label: "Online", value: "online" },
          { label: "In-store only", value: "in-store" },
        ],
      },
    ],
    priceRange: { min: 10, max: 60, step: 5 },
  },
};

const DEFAULT_CONFIG: CategoryFilterConfig = { filters: [], priceRange: null };

export function getCategoryFilterConfig(slug: string): CategoryFilterConfig {
  return CONFIGS[slug] ?? DEFAULT_CONFIG;
}
