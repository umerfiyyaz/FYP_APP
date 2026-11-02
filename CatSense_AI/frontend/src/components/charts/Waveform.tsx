import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

import { Pulse } from "@/components/animations/Pulse";

export type WaveBar = {
  width: number;
  height: number;
  color: string;
  /** Start delay in ms. */
  delay?: number;
};

function BounceBar({ bar }: { bar: WaveBar }) {
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.sequence([
      Animated.delay(bar.delay ?? 0),
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 0,
            duration: 500,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ),
    ]);
    anim.start();
    return () => anim.stop();
  }, [bar.delay, v]);

  const translateY = v.interpolate({
    inputRange: [0, 1],
    outputRange: [-bar.height * 0.25, 0],
  });

  return (
    <Animated.View
      style={{
        width: bar.width,
        height: bar.height,
        borderRadius: 9999,
        backgroundColor: bar.color,
        transform: [{ translateY }],
      }}
    />
  );
}

/** Row of bouncing bars (Tailwind "animate-bounce") - the sound waves under the mascot. */
export function SoundBars({
  bars,
  height = 32,
}: {
  bars: WaveBar[];
  height?: number;
}) {
  return (
    <View style={[styles.row, { height }]}>
      {bars.map((bar, i) => (
        <BounceBar key={i} bar={bar} />
      ))}
    </View>
  );
}

/** Small equalizer whose bars pulse (Tailwind "animate-pulse") - used in the sample player. */
export function MiniEqualizer({
  bars,
  height = 24,
}: {
  bars: WaveBar[];
  height?: number;
}) {
  return (
    <View style={[styles.eq, { height }]}>
      {bars.map((bar, i) => (
        <Pulse key={i} delay={bar.delay ?? 0}>
          <View
            style={{
              width: bar.width,
              height: bar.height,
              borderRadius: 9999,
              backgroundColor: bar.color,
            }}
          />
        </Pulse>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 24,
  },
  eq: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    paddingRight: 4,
  },
});
