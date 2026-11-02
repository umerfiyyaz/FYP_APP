import { LinearGradient } from "expo-linear-gradient";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { PressScale } from "@/components/animations/PressScale";
import { colors, radius, shadows, type } from "@/theme";
import { Icon, IconName } from "./Icon";

type Gradient = {
  colors: readonly [string, string, ...string[]];
  start: { x: number; y: number };
  end: { x: number; y: number };
};

type Props = {
  label: string;
  onPress?: () => void;
  /** Gradient fill (primary buttons). */
  gradient?: Gradient;
  /** Flat fill (glass / secondary buttons). Ignored when `gradient` is set. */
  background?: string;
  icon?: IconName;
  iconSize?: number;
  iconPosition?: "left" | "right";
  /** Text colour (and icon colour unless `iconColor` is set). Default = dark text on orange. */
  color?: string;
  iconColor?: string;
  labelStyle?: TextStyle;
  /** Vertical padding in px (the prototype uses 10 / 12 / 14 / 16 depending on the button). */
  paddingVertical?: number;
  paddingHorizontal?: number;
  gap?: number;
  /** CSS box-shadow string, or null for no shadow. */
  shadow?: string | null;
  disabled?: boolean;
  /** Scale while pressed. */
  pressScale?: number;
  style?: StyleProp<ViewStyle>;
};

/** Pill button: gradient or flat, optional icon, optional glow shadow. */
export function Button({
  label,
  onPress,
  gradient,
  background,
  icon,
  iconSize = 20,
  iconPosition = "right",
  color = colors.onPrimary,
  iconColor,
  labelStyle,
  paddingVertical = 14,
  paddingHorizontal = 24,
  gap = 8,
  shadow = shadows.cta,
  disabled,
  pressScale = 0.98,
  style,
}: Props) {
  const content = (
    <View
      style={[
        styles.row,
        { paddingVertical, paddingHorizontal, gap },
        !gradient && { backgroundColor: background },
      ]}
    >
      {icon && iconPosition === "left" && (
        <Icon name={icon} size={iconSize} color={iconColor ?? color} />
      )}
      <Text style={[type.headlineSm, { color }, labelStyle]}>{label}</Text>
      {icon && iconPosition === "right" && (
        <Icon name={icon} size={iconSize} color={iconColor ?? color} />
      )}
    </View>
  );

  return (
    <PressScale
      onPress={onPress}
      disabled={disabled}
      scaleTo={pressScale}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.outer,
        shadow ? { boxShadow: shadow } : null,
        { opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      {gradient ? (
        <LinearGradient
          colors={gradient.colors}
          start={gradient.start}
          end={gradient.end}
          style={styles.clip}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={styles.clip}>{content}</View>
      )}
    </PressScale>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: radius.full,
  },
  clip: {
    borderRadius: radius.full,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
