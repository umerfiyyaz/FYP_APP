import { Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { colors, type, withAlpha } from "@/theme";

const START = 150; // degrees, lower-left (y axis points down)
const SWEEP = 240; // degrees, clockwise over the top

function point(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const s = point(cx, cy, r, from);
  const e = point(cx, cy, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export function riskTone(score: number) {
  if (score < 40) return { label: "LOW RISK", color: colors.secondary };
  if (score < 70)
    return { label: "MEDIUM RISK", color: colors.primaryContainer };
  return { label: "HIGH RISK", color: colors.error };
}

/** Round gauge for the 0-100 AI health risk index. Static SVG = very cheap to render. */
export function RiskGauge({
  score,
  size = 230,
}: {
  score: number;
  size?: number;
}) {
  const stroke = 22;
  const c = size / 2;
  const r = c - stroke / 2 - 4;
  const v = Math.max(0, Math.min(100, score)) / 100;
  const tone = riskTone(score);
  const end = START + SWEEP * Math.max(v, 0.02);
  const knob = point(c, c, r, end);
  const h = size * 0.82;

  return (
    <View style={{ width: size, height: h, alignItems: "center" }}>
      <Svg width={size} height={h} viewBox={`0 0 ${size} ${h}`}>
        <Path
          d={arc(c, c, r, START, START + SWEEP)}
          stroke={colors.surfaceContainerLowest}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d={arc(c, c, r, START, end)}
          stroke={tone.color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx={knob.x} cy={knob.y} r={5} fill={colors.white} />
      </Svg>
      <View
        style={{ position: "absolute", top: size * 0.3, alignItems: "center" }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <Text
            style={{
              ...type.headlineXlMobile,
              fontSize: 46,
              lineHeight: 50,
              color: colors.white,
            }}
          >
            {score}
          </Text>
          <Text
            style={[
              type.bodyLg,
              {
                color: colors.onSurfaceVariant,
                marginBottom: 6,
                marginLeft: 2,
              },
            ]}
          >
            /100
          </Text>
        </View>
        <View
          style={{
            marginTop: 6,
            paddingHorizontal: 12,
            paddingVertical: 3,
            borderRadius: 999,
            backgroundColor: withAlpha(tone.color, 0.16),
          }}
        >
          <Text style={[type.labelSm, { color: tone.color, letterSpacing: 1 }]}>
            {tone.label}
          </Text>
        </View>
      </View>
    </View>
  );
}
