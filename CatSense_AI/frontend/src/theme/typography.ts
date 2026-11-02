import type { TextStyle } from "react-native";

// Font family names come from @expo-google-fonts/plus-jakarta-sans (loaded in app/_layout.tsx).
export const fonts = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extrabold: "PlusJakartaSans_800ExtraBold",
} as const;

// Same names and sizes as the prototype's Tailwind "fontSize" tokens.
export const type = {
  headlineXlMobile: {
    fontFamily: fonts.extrabold,
    fontSize: 26,
    lineHeight: 34,
  },
  headlineSm: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 24 },
  bodyLg: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 24 },
  bodyMd: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 },
  bodySm: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16 },
  labelLg: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 18 },
  labelMd: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16 },
  labelSm: { fontFamily: fonts.bold, fontSize: 10, lineHeight: 14 },
} satisfies Record<string, TextStyle>;

/** Tailwind tracking-* in em -> React Native letterSpacing in px. */
export const tracking = {
  tight: -0.025,
  wide: 0.025,
  wider: 0.05,
  widest: 0.1,
} as const;

export const letterSpacing = (fontSize: number, em: number) => fontSize * em;
