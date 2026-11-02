import { StyleSheet, Text, View } from "react-native";

import { PressScale } from "@/components/animations/PressScale";
import {
  colors,
  radius,
  shadows,
  spacing,
  tracking,
  letterSpacing,
  type,
} from "@/theme";
import { Icon } from "./Icon";

type Props = {
  step: number;
  total?: number;
  onBack?: () => void;
  onSkip?: () => void;
};

/** Onboarding top bar: round back button, "ONBOARDING / Step 1 of 3", "Skip". */
export function OnboardingTopBar({ step, total = 3, onBack, onSkip }: Props) {
  return (
    <View style={styles.row}>
      <PressScale
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={styles.back}
      >
        <Icon name="arrow-back" size={16} color={colors.onSurface} />
      </PressScale>

      <View style={styles.center}>
        <Text
          style={[
            type.labelSm,
            {
              color: colors.surfaceTint,
              textTransform: "uppercase",
              letterSpacing: letterSpacing(10, tracking.wider),
            },
          ]}
        >
          Onboarding
        </Text>
        <Text style={[type.labelMd, { color: colors.onSurfaceVariant }]}>
          Step {step} of {total}
        </Text>
      </View>

      <View style={styles.skipBox}>
        <Text
          onPress={onSkip}
          accessibilityRole="button"
          style={[type.labelMd, { color: colors.surfaceTint }]}
        >
          Skip
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadows.sm,
  },
  center: {
    alignItems: "center",
  },
  skipBox: {
    width: 40,
    alignItems: "flex-end",
  },
});
