import { ScrollView, Text, View } from "react-native";

import { PressScale } from "@/components/animations/PressScale";
import type { Period } from "@/store/historyStore";
import { colors, radius, type, withAlpha } from "@/theme";

export type KindFilter = "all" | "behavior" | "sound" | "alert";
export type KindCounts = Record<KindFilter, number>;

const PERIODS: { key: Period; label: string }[] = [
  { key: "week", label: "This week" },
  { key: "month", label: "Month" },
  { key: "all", label: "All" },
];

const KINDS: { key: KindFilter; label: string; plural: string }[] = [
  { key: "all", label: "All", plural: "All types" },
  { key: "behavior", label: "Behavior", plural: "Behavior" },
  { key: "sound", label: "Sound", plural: "Sound" },
  { key: "alert", label: "Alerts", plural: "Alerts" },
];

type Props = {
  period: Period;
  onPeriod: (p: Period) => void;
  kind: KindFilter;
  onKind: (k: KindFilter) => void;
  /** With counts the chips read "All 14", "Behavior (8)" ... without: "All types", "Behavior" ... */
  counts?: KindCounts;
};

/** Period chips (This week / Month / All) + type chips (All / Behavior / Sound / Alerts). */
export function FilterBar({ period, onPeriod, kind, onKind, counts }: Props) {
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {PERIODS.map((p) => {
          const on = p.key === period;
          return (
            <PressScale
              key={p.key}
              onPress={() => onPeriod(p.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: radius.full,
                backgroundColor: on
                  ? colors.primary
                  : colors.surfaceContainerHigh,
              }}
            >
              <Text
                style={[
                  type.labelLg,
                  { color: on ? colors.onPrimary : colors.onSurfaceVariant },
                ]}
              >
                {p.label}
              </Text>
            </PressScale>
          );
        })}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 8 }}
      >
        {KINDS.map((k) => {
          const on = k.key === kind;
          const isAlert = k.key === "alert";
          const label = counts
            ? k.key === "all"
              ? `All ${counts.all}`
              : `${k.label} (${counts[k.key]})`
            : k.plural;
          return (
            <PressScale
              key={k.key}
              onPress={() => onKind(k.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: radius.full,
                backgroundColor: on
                  ? isAlert
                    ? withAlpha(colors.errorContainer, 0.8)
                    : colors.surfaceContainerHighest
                  : withAlpha(colors.surfaceContainerHigh, 0.7),
              }}
            >
              <Text
                style={[
                  type.labelMd,
                  {
                    color: isAlert
                      ? colors.error
                      : on
                        ? colors.onSurface
                        : colors.onSurfaceVariant,
                  },
                ]}
              >
                {label}
              </Text>
            </PressScale>
          );
        })}
      </ScrollView>
    </View>
  );
}
