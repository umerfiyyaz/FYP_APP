// Colors copied from the prototype (Tailwind config of the Stitch export).
export const colors = {
  background: "#130d34",
  surface: "#130d34",
  surfaceContainerLowest: "#0d072f",
  surfaceContainerLow: "#1b163c",
  surfaceContainer: "#1f1a41",
  surfaceContainerHigh: "#2a254c",
  surfaceContainerHighest: "#353057",
  surfaceBright: "#39345c",
  surfaceVariant: "#353057",

  onSurface: "#e5deff",
  onSurfaceVariant: "#d7c4ad",
  outline: "#9f8e79",
  outlineVariant: "#524533",

  primary: "#ffd59b",
  primaryContainer: "#ffb020", // Cat Orange
  primaryFixed: "#ffddb1",
  primaryFixedDim: "#ffba4b",
  surfaceTint: "#ffba4b",
  onPrimary: "#442b00",
  onPrimaryContainer: "#6b4600",

  secondary: "#56ddab", // Mint
  secondaryContainer: "#00aa7c",
  secondaryFixed: "#75fac6",
  secondaryFixedDim: "#56ddab",
  onSecondary: "#003827",
  onSecondaryContainer: "#003625",

  tertiary: "#ddd7ff", // Lavender
  tertiaryContainer: "#bfb8ff",
  tertiaryFixed: "#e4dfff",
  tertiaryFixedDim: "#c6bfff",
  onTertiaryContainer: "#493ab2",

  error: "#ffb4ab",
  errorContainer: "#93000a",
  onError: "#690005",
  onErrorContainer: "#ffdad6",

  white: "#ffffff",
  transparent: "transparent",
} as const;

/** withAlpha('#ffb020', 0.15) -> 'rgba(255,176,32,0.15)'  (same as Tailwind "bg-primary-container/15") */
export function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
