export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  gutter: 16,
  gutterSm: 12,
  margin: 20,
  marginSm: 16,
} as const;

export const radius = {
  sm: 8,
  base: 16, // Tailwind "rounded-2xl" in the prototype = inset fields
  md: 24,
  lg: 32, // cards
  xl: 48, // feature cards
  full: 9999,
} as const;

// CSS box-shadow strings (React Native 0.76+ supports `boxShadow`, including `inset`).
export const shadows = {
  cta: "0 10px 24px rgba(255,176,32,0.45)",
  ctaSoft: "0 6px 18px rgba(255,176,32,0.35)",
  badgeGlow: "0 4px 12px rgba(255,186,75,0.4)",
  mintGlow: "0 0 16px rgba(86,221,171,0.35)",
  stepGlow: "0 0 8px rgba(255,176,32,0.4)",
  dotGlow: "0 0 6px rgba(86,221,171,0.6)",
  sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
  md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
  lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
  xl: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
  xlDeep:
    "0 20px 25px -5px rgba(13,7,47,0.6), 0 8px 10px -6px rgba(13,7,47,0.6)",
  xxl: "0 25px 50px -12px rgba(0,0,0,0.25)",
  cancel: "0 4px 12px rgba(0,0,0,0.25)",
  inner: "inset 0 2px 4px 0 rgba(0,0,0,0.05)",
  insetField: "inset 0 2px 6px rgba(0,0,0,0.6)",
  insetFieldDeep: "inset 0 3px 6px rgba(0,0,0,0.6)",
} as const;
