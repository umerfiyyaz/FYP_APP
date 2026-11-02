import { useId } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

type Props = {
  size: number;
  color: string;
  /** Opacity in the centre (like Tailwind "bg-primary-container/20" -> 0.2). */
  opacity?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Soft round glow. React Native has no CSS "blur-3xl", so the blurred circles of the prototype
 * are drawn as a radial gradient that fades to transparent.
 * Position it with `style` (e.g. { top: -96, left: 40 }).
 */
export function Glow({ size, color, opacity = 0.2, style }: Props) {
  const id = "glow" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <View
      pointerEvents="none"
      style={[{ position: "absolute", width: size, height: size }, style]}
    >
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={color} stopOpacity={opacity} />
            <Stop
              offset="0.55"
              stopColor={color}
              stopOpacity={opacity * 0.55}
            />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
