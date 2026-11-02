export * from "./colors";
export * from "./spacing";
export * from "./typography";

import { colors } from "./colors";

/** Gradient presets used by the buttons in the prototype. */
export const gradients = {
  // Welcome screen: "Sign in" (top -> bottom)
  ctaVertical: {
    colors: ["#FFC148", "#FFA70A"] as const,
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  // Add cat: "Continue" (left -> right)
  ctaWarm: {
    colors: [
      colors.primaryFixedDim,
      colors.primaryContainer,
      colors.surfaceTint,
    ] as const,
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
  // Small "Save changes" pill
  ctaWarmShort: {
    colors: [colors.primaryFixedDim, colors.primaryContainer] as const,
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
  // Onboarding sound: "Continue" (orange -> light peach)
  ctaFade: {
    colors: [
      colors.primaryContainer,
      colors.primaryFixedDim,
      colors.primary,
    ] as const,
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
};
