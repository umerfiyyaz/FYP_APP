import { useMemo, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressScale } from "@/components/animations/PressScale";
import { RiskGauge } from "@/components/charts/RiskGauge";
import { CommunityIcon, Icon } from "@/components/ui/Icon";
import { images } from "@/constants/images";
import {
  useRiskReport,
  type BaselineRow,
  type Factor,
} from "@/services/riskReport";
import { useActiveCat } from "@/store/catStore";
import { formatAgo, getItem, itemsOf, useHistory } from "@/store/historyStore";
import {
  colors,
  gradients,
  radius,
  shadows,
  spacing,
  type,
  withAlpha,
} from "@/theme";
import { goBack } from "@/utils/nav";

const FACTOR_ICON = {
  sleep: {
    name: "bedtime",
    bg: withAlpha(colors.tertiaryContainer, 0.18),
    fg: colors.tertiary,
  },
  food: {
    name: "restaurant",
    bg: withAlpha(colors.primaryContainer, 0.18),
    fg: colors.primaryContainer,
  },
  sound: {
    name: "hearing",
    bg: withAlpha(colors.secondaryContainer, 0.25),
    fg: colors.secondary,
  },
} as const;

function FactorRow({ f }: { f: Factor }) {
  const ic = FACTOR_ICON[f.icon];
  const tone = f.ok ? colors.secondary : colors.error;
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        padding: 14,
        borderRadius: radius.md,
        backgroundColor: withAlpha(colors.surfaceContainerHigh, 0.7),
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: ic.bg,
        }}
      >
        <Icon name={ic.name} size={22} color={ic.fg} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={[type.headlineSm, { fontSize: 16, color: colors.onSurface }]}
        >
          {f.title}
        </Text>
        <Text
          style={[
            type.bodyMd,
            { color: colors.onSurfaceVariant, marginTop: 2 },
          ]}
        >
          {f.text}
        </Text>
      </View>
      <Icon
        name={f.ok ? "check-circle-outline" : "error-outline"}
        size={20}
        color={tone}
      />
    </View>
  );
}

function BaselineLine({ r }: { r: BaselineRow }) {
  const ic =
    r.icon === "sleep" ? "bedtime" : r.icon === "food" ? "restaurant" : "pets";
  const up = (r.delta ?? 0) >= 0;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: radius.md,
        backgroundColor: withAlpha(colors.surfaceContainerHigh, 0.7),
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: withAlpha(colors.primaryContainer, 0.16),
          }}
        >
          <Icon name={ic} size={18} color={colors.primaryContainer} />
        </View>
        <Text style={[type.bodyLg, { color: colors.onSurface }]}>
          {r.label}
        </Text>
      </View>
      {r.delta === null ? (
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: colors.onSurface,
          }}
        >
          <Text
            style={[type.labelMd, { color: colors.surfaceContainerLowest }]}
          >
            Normal
          </Text>
        </View>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Icon
            name={up ? "trending-up" : "trending-down"}
            size={18}
            color={up ? colors.secondary : colors.error}
          />
          <Text
            style={[
              type.headlineSm,
              { color: up ? colors.secondary : colors.error },
            ]}
          >
            {`${up ? "+" : "−"}${Math.abs(r.delta)}%`}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function RiskScoreScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items } = useHistory();
  const cat = useActiveCat();
  const CAT_NAME = cat?.name ?? "Milo";
  const item = useMemo(
    () => getItem(id) ?? itemsOf(items, cat?.id)[0],
    [id, items, cat?.id],
  );
  const report = useRiskReport(item, CAT_NAME);
  const [water, setWater] = useState(120);

  if (!item || !report) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={[type.bodyLg, { color: colors.onSurfaceVariant }]}>
          No result found
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* top bar */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: 8,
          paddingHorizontal: spacing.margin,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <PressScale
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Back"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.surfaceContainer,
            }}
          >
            <Icon name="arrow-back" size={22} />
          </PressScale>
          <Image
            source={images.mascot}
            style={{ width: 32, height: 32 }}
            resizeMode="contain"
          />
          <Text style={[type.headlineSm, { color: colors.onSurface }]}>
            Results
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.surfaceContainer,
            }}
          >
            <Icon name="share" size={20} />
          </View>
          <LinearGradient
            colors={[colors.primaryContainer, colors.secondary]}
            style={{ padding: 2, borderRadius: 22 }}
          >
            <Image
              source={images.catEdit}
              style={{ width: 36, height: 36, borderRadius: 18 }}
            />
          </LinearGradient>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.margin,
          paddingBottom: insets.bottom + 32,
          gap: 16,
        }}
      >
        {/* cat row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              flex: 1,
            }}
          >
            <Image
              source={images.catPortrait}
              style={{ width: 48, height: 48, borderRadius: 24 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                {CAT_NAME}
              </Text>
              <Text
                style={[type.bodySm, { color: colors.onSurfaceVariant }]}
                numberOfLines={1}
              >
                3.5 yrs {"•"} Domestic Shorthair
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: withAlpha(colors.secondaryContainer, 0.22),
            }}
          >
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: colors.secondary,
              }}
            />
            <Text
              style={[type.labelMd, { color: colors.secondary }]}
            >{`Updated ${formatAgo(item.createdAt)}`}</Text>
          </View>
        </View>

        {/* gauge card */}
        <View
          style={{
            borderRadius: radius.lg,
            padding: 20,
            backgroundColor: colors.surfaceContainer,
            boxShadow: shadows.xlDeep,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.surfaceContainerLowest,
                }}
              >
                <CommunityIcon
                  name="heart-pulse"
                  size={18}
                  color={colors.primaryContainer}
                />
              </View>
              <Text
                style={[
                  type.headlineSm,
                  { fontSize: 20, color: colors.onSurface },
                ]}
              >
                AI Health Risk Index
              </Text>
            </View>
            <Icon
              name="info-outline"
              size={20}
              color={colors.onSurfaceVariant}
            />
          </View>
          <View style={{ alignItems: "center", marginTop: 8 }}>
            <RiskGauge score={report.score} />
          </View>
          <Text
            style={[
              type.bodyMd,
              {
                color: colors.onSurfaceVariant,
                textAlign: "center",
                marginTop: 4,
              },
            ]}
          >
            {report.summary}
          </Text>
          {/* scale */}
          <View style={{ flexDirection: "row", gap: 4, marginTop: 20 }}>
            <View
              style={{
                flex: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.secondary,
              }}
            />
            <View
              style={{
                flex: 30,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#8f7f6a",
              }}
            />
            <View
              style={{
                flex: 30,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#7d5b6b",
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
              0
            </Text>
            <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
              100
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            {[
              ["Low (0–39)", colors.secondary],
              ["Medium (40–69)", "#c9b79d"],
              ["High (70–100)", "#b88a9d"],
            ].map(([t, c]) => (
              <View
                key={t}
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: c,
                  }}
                />
                <Text
                  style={[
                    type.labelMd,
                    { fontSize: 11, color: colors.onSurfaceVariant },
                  ]}
                >
                  {t}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* why this score */}
        <View
          style={{
            borderRadius: radius.lg,
            padding: 20,
            backgroundColor: colors.surfaceContainer,
            gap: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.surfaceContainerHigh,
                }}
              >
                <Icon
                  name="lightbulb-outline"
                  size={18}
                  color={colors.primaryContainer}
                />
              </View>
              <Text
                style={[
                  type.headlineSm,
                  { fontSize: 20, color: colors.onSurface },
                ]}
              >
                Why this score
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
                backgroundColor: colors.surfaceContainerHigh,
              }}
            >
              <Text
                style={[type.labelMd, { color: colors.onSurfaceVariant }]}
              >{`${report.factors.length} factors`}</Text>
            </View>
          </View>
          {report.factors.map((f) => (
            <FactorRow key={f.id} f={f} />
          ))}
        </View>

        {/* baseline */}
        <View
          style={{
            borderRadius: radius.lg,
            padding: 20,
            backgroundColor: colors.surfaceContainer,
            gap: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={[
                type.headlineSm,
                { fontSize: 20, color: colors.onSurface, flex: 1 },
              ]}
            >{`Compared with ${CAT_NAME}'s baseline`}</Text>
            <Icon
              name="insert-chart-outlined"
              size={22}
              color={colors.onSurfaceVariant}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 999,
              backgroundColor: colors.surfaceContainerLowest,
            }}
          >
            <Icon
              name="info-outline"
              size={16}
              color={colors.primaryContainer}
            />
            <Text style={[type.labelMd, { color: colors.onSurface, flex: 1 }]}>
              {report.baselineNote}
            </Text>
          </View>
          {report.baseline.map((r) => (
            <BaselineLine key={r.id} r={r} />
          ))}
        </View>

        {/* hydration */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
            borderRadius: radius.lg,
            backgroundColor: colors.surfaceContainer,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.surfaceContainerLowest,
              }}
            >
              <Icon name="water-drop" size={22} color={colors.secondary} />
            </View>
            <View>
              <Text
                style={[
                  type.labelSm,
                  { color: colors.onSurfaceVariant, letterSpacing: 1 },
                ]}
              >
                HYDRATION TRACK
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "flex-end", gap: 4 }}
              >
                <Text
                  style={[
                    type.headlineSm,
                    { fontSize: 22, color: colors.onSurface },
                  ]}
                >
                  {water}
                </Text>
                <Text
                  style={[
                    type.bodyMd,
                    { color: colors.onSurfaceVariant, marginBottom: 2 },
                  ]}
                >
                  ml water today
                </Text>
              </View>
            </View>
          </View>
          <PressScale
            onPress={() => setWater((w) => w + 30)}
            accessibilityRole="button"
            accessibilityLabel="Add 30 ml water"
            style={{ borderRadius: 999, boxShadow: shadows.ctaSoft }}
          >
            <LinearGradient
              colors={gradients.ctaWarmShort.colors}
              start={gradients.ctaWarmShort.start}
              end={gradients.ctaWarmShort.end}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 10,
                borderRadius: 999,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Icon name="add" size={18} color={colors.onPrimary} />
              <Text style={[type.labelLg, { color: colors.onPrimary }]}>
                Add
              </Text>
            </LinearGradient>
          </PressScale>
        </View>

        {/* disclaimer */}
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            padding: 16,
            borderRadius: radius.lg,
            backgroundColor: colors.surfaceContainerLowest,
          }}
        >
          <Icon
            name="verified-user"
            size={18}
            color={colors.onSurfaceVariant}
          />
          <Text
            style={[type.bodyMd, { color: colors.onSurfaceVariant, flex: 1 }]}
          >
            An indication, not a medical diagnosis. Talk to your vet about
            health worries.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
