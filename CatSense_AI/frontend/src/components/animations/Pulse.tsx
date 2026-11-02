import { ReactNode, useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, ViewStyle } from "react-native";

type Props = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** One full cycle in ms (Tailwind "animate-pulse" = 2000). */
  duration?: number;
  minOpacity?: number;
  /** Start delay in ms (CSS animation-delay). */
  delay?: number;
};

/** Fades its children between 1 and `minOpacity` forever (Tailwind "animate-pulse"). */
export function Pulse({
  children,
  style,
  duration = 2000,
  minOpacity = 0.5,
  delay = 0,
}: Props) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const half = duration / 2;
    const anim = Animated.sequence([
      Animated.delay(delay),
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: minOpacity,
            duration: half,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: half,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ),
    ]);
    anim.start();
    return () => anim.stop();
  }, [delay, duration, minOpacity, opacity]);

  return <Animated.View style={[style, { opacity }]}>{children}</Animated.View>;
}
