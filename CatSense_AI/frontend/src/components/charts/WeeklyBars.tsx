import { memo } from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors, type, withAlpha } from "@/theme";

type Props = {
  /** 7 values, Monday first, each 0..1 */
  values: number[];
  /** Index of the highlighted day (today). */
  active: number;
  height?: number;
};

const LABELS = ["M", "T", "W", "T", "F", "S", "S"];

/** 7 rounded bars. Plain Views = no chart library, no extra bundle size. */
function WeeklyBarsBase({ values, active, height = 120 }: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        height: height + 40,
      }}
    >
      {values.map((v, i) => {
        const h = Math.max(20, v * height);
        const on = i === active;
        return (
          <View key={i} style={{ flex: 1, alignItems: "center" }}>
            {on ? (
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.primaryContainer,
                  marginBottom: 6,
                }}
              />
            ) : null}
            {on ? (
              <LinearGradient
                colors={[colors.primaryFixedDim, colors.primaryContainer]}
                style={{
                  width: 22,
                  height: h,
                  borderRadius: 11,
                  boxShadow: "0 0 14px rgba(255,176,32,0.5)",
                }}
              />
            ) : (
              <View
                style={{
                  width: 22,
                  height: h,
                  borderRadius: 11,
                  backgroundColor: withAlpha(colors.onSurface, 0.1),
                }}
              />
            )}
            <Text
              style={[
                type.labelMd,
                {
                  marginTop: 10,
                  color: on ? colors.onSurface : colors.onSurfaceVariant,
                },
              ]}
            >
              {LABELS[i]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export const WeeklyBars = memo(WeeklyBarsBase);
