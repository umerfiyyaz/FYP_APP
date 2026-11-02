import { StyleSheet, Text, View } from "react-native";

import { PressScale } from "@/components/animations/PressScale";
import { colors, radius, shadows, type } from "@/theme";
import { Icon, IconName } from "./Icon";

type ChoiceChipProps = {
  label: string;
  icon: IconName;
  active: boolean;
  onPress: () => void;
};

/** Selectable pill (e.g. Indoor / Outdoor / Both). Active = mint, inactive = frosted indigo. */
export function ChoiceChip({ label, icon, active, onPress }: ChoiceChipProps) {
  const color = active ? colors.onSecondary : colors.onSurfaceVariant;
  return (
    <PressScale
      onPress={onPress}
      scaleTo={0.97}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[
        styles.chip,
        active
          ? { backgroundColor: colors.secondary, boxShadow: shadows.mintGlow }
          : { backgroundColor: colors.surfaceContainerHigh },
      ]}
    >
      <Icon name={icon} size={12} color={color} />
      <Text style={[type.labelMd, { color }]}>{label}</Text>
    </PressScale>
  );
}

type BadgeProps = {
  label: string;
  background: string;
  color: string;
  uppercase?: boolean;
  /** Tailwind tracking-wider = 0.05em. */
  letterSpacing?: number;
};

/** Small pill label ("Priority", "10 Moods", "QUICK UPDATE" ...). */
export function Badge({
  label,
  background,
  color,
  uppercase,
  letterSpacing = 0.5,
}: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      <Text
        style={[
          type.labelSm,
          {
            color,
            letterSpacing,
            textTransform: uppercase ? "uppercase" : "none",
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: radius.full,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
});
