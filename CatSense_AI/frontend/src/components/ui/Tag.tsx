import { Text, View } from "react-native";

import { colors, radius, type, withAlpha } from "@/theme";

export type TagTone = "lavender" | "mint" | "coral" | "neutral" | "orange";

const tones: Record<TagTone, { bg: string; fg: string }> = {
  lavender: {
    bg: withAlpha(colors.tertiaryContainer, 0.3),
    fg: colors.tertiary,
  },
  mint: {
    bg: withAlpha(colors.secondaryContainer, 0.25),
    fg: colors.secondary,
  },
  coral: { bg: withAlpha(colors.errorContainer, 0.45), fg: colors.error },
  neutral: { bg: colors.surfaceContainerHigh, fg: colors.onSurface },
  orange: {
    bg: withAlpha(colors.primaryContainer, 0.18),
    fg: colors.primaryContainer,
  },
};

/** Small rounded label (e.g. "Resting 92%", "Happy"). */
export function Tag({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: TagTone;
}) {
  const t = tones[tone];
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: radius.full,
        backgroundColor: t.bg,
        alignSelf: "flex-start",
      }}
    >
      <Text style={[type.labelMd, { color: t.fg }]}>{label}</Text>
    </View>
  );
}
