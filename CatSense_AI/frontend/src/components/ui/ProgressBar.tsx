import { StyleSheet, View } from "react-native";

import { colors, radius, shadows, spacing } from "@/theme";

type Props = {
  /** Current step, starting at 1. */
  step: number;
  total?: number;
};

/** Segmented onboarding progress ("Step 1 of 3"): the finished segments glow orange. */
export function StepProgress({ step, total = 3 }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            i < step
              ? {
                  backgroundColor: colors.primaryContainer,
                  boxShadow: shadows.stepGlow,
                }
              : { backgroundColor: colors.surfaceContainerHighest },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: radius.full,
  },
});
