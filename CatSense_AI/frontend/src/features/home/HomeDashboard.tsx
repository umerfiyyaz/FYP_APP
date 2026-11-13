import { useEffect, useMemo } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { PressScale } from "@/components/animations/PressScale";
import { WeeklyBars } from "@/components/charts/WeeklyBars";
import { BrandHeader } from "@/components/ui/BrandHeader";
import { Button } from "@/components/ui/Button";
import { CommunityIcon, Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Tag";
import { images } from "@/constants/images";
import { riskTone } from "@/components/charts/RiskGauge";
import { useRemoveFlow } from "@/features/history/useRemoveFlow";
import { useCurrentUser } from "@/services/auth";
import { useActiveCat } from "@/store/catStore";
import {
  formatAgo,
  formatClock,
  historyActions,
  itemsOf,
  useHistory,
} from "@/store/historyStore";
import {
  colors,
  gradients,
  radius,
  shadows,
  spacing,
  type,
  withAlpha,
} from "@/theme";
import { go } from "@/utils/nav";

const DAY = 24 * 60 * 60 * 1000;

/** Number of analyses on each of the last 7 days (Monday = index 0 of the current week), scaled 0..1. */
function weekBars(items: { createdAt: string | number | Date }[]) {
  const now = new Date();
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  monday.setDate(monday.getDate() - ((now.getDay() + 6) % 7));
  const counts = [0, 0, 0, 0, 0, 0, 0];
  for (const it of items) {
    const d = new Date(it.createdAt).getTime();
    const idx = Math.floor((d - monday.getTime()) / DAY);
    if (idx >= 0 && idx < 7) counts[idx] += 1;
  }
  const max = Math.max(1, ...counts);
  return {
    values: counts.map((c) => Math.max(c / max, 0.04)),
    total: counts.reduce((a, b) => a + b, 0),
  };
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

/**
 * Home for a user who already has analyses (screen 14).
 * home.tsx shows this when `items.length > 0`, and the "first scan" screen otherwise.
 */
export function HomeDashboard() {
  const { items: all } = useHistory();
  const cat = useActiveCat();
  const CAT_NAME = cat?.name ?? "Milo";
  const user = useCurrentUser();
  const USER_NAME =
    user?.full_name?.trim().split(" ")[0] ||
    user?.email.split("@")[0] ||
    "there";
  const items = useMemo(() => itemsOf(all, cat?.id), [all, cat?.id]);
  const latest = items[0];

  useEffect(() => {
    if (cat) historyActions.hydrate(cat.id); // backend: loads this cat's results (mock: nothing)
  }, [cat?.id]);
  const { ask, overlay } = useRemoveFlow(CAT_NAME);
  const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0
  const hasAlert = items.some((i) => i.kind === "alert");
  const week = useMemo(() => weekBars(items), [items]);

  if (!latest) return null;
  const isToday =
    new Date(latest.createdAt).toDateString() === new Date().toDateString();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BrandHeader subtitle="Home" hasAlert={hasAlert} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.margin,
          paddingBottom: 130,
          gap: 16,
        }}
      >
        {/* welcome */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text
              style={[
                type.labelMd,
                { color: colors.onSurfaceVariant, letterSpacing: 1 },
              ]}
            >
              WELCOME BACK
            </Text>
            <Text
              style={{ ...type.headlineXlMobile, color: colors.onSurface }}
            >{`${greeting()}, ${USER_NAME}`}</Text>
          </View>
          <PressScale
            onPress={() => go("/cats")}
            accessibilityLabel="Switch cat"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingLeft: 6,
              paddingRight: 14,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: colors.surfaceContainer,
              marginBottom: 6,
            }}
          >
            <Image
              source={cat?.photo ?? images.catPortrait}
              style={{ width: 30, height: 30, borderRadius: 15 }}
            />
            <View>
              <Text
                style={[
                  type.labelLg,
                  { color: colors.onSurface, lineHeight: 15 },
                ]}
              >
                {CAT_NAME}
              </Text>
              <Text style={[type.labelSm, { color: colors.secondary }]}>
                Active
              </Text>
            </View>
          </PressScale>
        </View>

        {/* hero */}
        <LinearGradient
          colors={[
            colors.surfaceContainerHigh,
            colors.surfaceContainer,
            colors.surfaceContainerLow,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: radius.lg,
            padding: 22,
            boxShadow: shadows.xlDeep,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 1, paddingRight: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  alignSelf: "flex-start",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: withAlpha(
                    colors.surfaceContainerLowest,
                    0.6,
                  ),
                }}
              >
                <Icon name="pets" size={14} color={colors.secondary} />
                <Text style={[type.labelMd, { color: colors.secondary }]}>
                  AI Mood Assessment
                </Text>
              </View>
              <Text
                style={{
                  ...type.headlineXlMobile,
                  color: colors.onSurface,
                  marginTop: 14,
                }}
              >
                {latest.risk >= 70
                  ? `${CAT_NAME} needs a closer look`
                  : latest.mood === "Defensive" || latest.risk >= 40
                    ? `${CAT_NAME} is on guard`
                    : `${CAT_NAME} looks calm`}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 8,
                }}
              >
                <Icon
                  name="schedule"
                  size={15}
                  color={colors.onSurfaceVariant}
                />
                <Text
                  style={[type.bodyMd, { color: colors.onSurfaceVariant }]}
                >{`Last analysis: ${formatAgo(latest.createdAt)}`}</Text>
              </View>
            </View>
            <Image
              source={cat?.photo ?? images.catPortrait}
              style={{ width: 104, height: 104, borderRadius: 52 }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginTop: 16,
              flexWrap: "wrap",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: 999,
                backgroundColor: withAlpha(colors.tertiaryContainer, 0.25),
              }}
            >
              <Icon name="pets" size={16} color={colors.tertiary} />
              <Text style={[type.labelLg, { color: colors.tertiary }]}>
                {latest.behavior}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: 999,
                backgroundColor: withAlpha(colors.secondaryContainer, 0.28),
              }}
            >
              <Icon name="graphic-eq" size={16} color={colors.secondary} />
              <Text
                style={[type.labelLg, { color: colors.secondary }]}
              >{`${latest.mood} ${latest.confidence}%`}</Text>
            </View>
          </View>
          <Button
            label="Analyze new video"
            icon="videocam"
            iconPosition="left"
            gradient={gradients.ctaVertical}
            onPress={() => go("/(tabs)/analyze")}
            style={{ marginTop: 18 }}
          />
        </LinearGradient>

        {/* stat cards */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <PressScale
            onPress={() => go(`/health/${latest.id}`)}
            accessibilityLabel="Open risk score"
            style={{
              flex: 1,
              borderRadius: radius.lg,
              padding: 16,
              backgroundColor: colors.surfaceContainer,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={[type.bodySm, { color: colors.onSurface }]}>
                Stress Index
              </Text>
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: withAlpha(colors.secondaryContainer, 0.35),
                }}
              >
                <Icon
                  name="check-circle-outline"
                  size={20}
                  color={colors.secondary}
                />
              </View>
            </View>
            <Text
              style={{
                ...type.headlineXlMobile,
                fontSize: 24,
                color: riskTone(latest.risk).color,
                marginTop: 6,
              }}
            >
              {`Risk: ${latest.risk < 40 ? "Low" : latest.risk < 70 ? "Medium" : "High"}`}
            </Text>
            <Text
              style={[
                type.bodySm,
                { color: colors.onSurfaceVariant, marginTop: 4 },
              ]}
            >
              {`Score ${latest.risk}/100`}
            </Text>
          </PressScale>
          <View
            style={{
              flex: 1,
              borderRadius: radius.lg,
              padding: 16,
              backgroundColor: colors.surfaceContainer,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={[type.bodySm, { color: colors.onSurface }]}>
                Acoustic Tone
              </Text>
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: withAlpha(colors.primaryContainer, 0.22),
                }}
              >
                <Icon
                  name="sentiment-satisfied-alt"
                  size={20}
                  color={colors.primaryContainer}
                />
              </View>
            </View>
            <Text
              style={{
                ...type.headlineXlMobile,
                fontSize: 24,
                color: colors.primaryContainer,
                marginTop: 6,
              }}
            >
              {latest.mood}
            </Text>
            <Text
              style={[
                type.bodySm,
                { color: colors.onSurfaceVariant, marginTop: 4 },
              ]}
            >
              Latest sound mood
            </Text>
          </View>
        </View>

        {/* weekly activity */}
        <View
          style={{
            borderRadius: radius.lg,
            padding: 20,
            backgroundColor: colors.surfaceContainer,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  type.headlineSm,
                  { fontSize: 22, color: colors.onSurface },
                ]}
              >
                Weekly Activity
              </Text>
              <Text
                style={[
                  type.bodyMd,
                  { color: colors.onSurfaceVariant, marginTop: 2 },
                ]}
              >
                Analyses per day this week
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                alignSelf: "flex-start",
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: radius.md,
                backgroundColor: withAlpha(colors.secondaryContainer, 0.28),
                maxWidth: 140,
              }}
            >
              <Icon name="videocam" size={18} color={colors.secondary} />
              <Text
                style={[
                  type.labelMd,
                  { color: colors.secondary, flexShrink: 1 },
                ]}
              >
                {`${week.total} ${week.total === 1 ? "scan" : "scans"} this week`}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 18 }}>
            <WeeklyBars values={week.values} active={todayIdx} />
          </View>
        </View>

        {/* latest scan */}
        <View
          style={{
            borderRadius: radius.lg,
            padding: 20,
            backgroundColor: colors.surfaceContainer,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={[
                type.labelMd,
                { color: colors.onSurfaceVariant, letterSpacing: 1 },
              ]}
            >
              LATEST SCAN
            </Text>
            <Text style={[type.bodyMd, { color: colors.onSurfaceVariant }]}>
              {`${isToday ? "Today" : "On"} ${formatClock(latest.createdAt)}`}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              marginTop: 14,
            }}
          >
            <View
              style={{
                width: 112,
                height: 80,
                borderRadius: radius.base,
                overflow: "hidden",
                backgroundColor: colors.surfaceContainerLowest,
              }}
            >
              <Image
                source={
                  latest.thumbUrl ? { uri: latest.thumbUrl } : images.catEdit
                }
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(13,7,47,0.6)",
                  }}
                >
                  <Icon
                    name="play-arrow"
                    size={20}
                    color={colors.primaryContainer}
                  />
                </View>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.secondary,
                  }}
                />
                <Text
                  style={[
                    type.headlineSm,
                    { fontSize: 20, color: colors.onSurface },
                  ]}
                  numberOfLines={1}
                >
                  {`${latest.behavior} · ${latest.confidence}%`}
                </Text>
              </View>
              <Text
                style={[
                  type.bodyMd,
                  { color: colors.onSurfaceVariant, marginTop: 4 },
                ]}
              >{`${latest.durationSec} sec scan`}</Text>
              <Text
                style={[type.bodySm, { color: colors.secondary, marginTop: 4 }]}
                numberOfLines={1}
              >
                {latest.subtitle}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginTop: 16,
            }}
          >
            <PressScale
              onPress={() => go(`/results/${latest.id}`)}
              accessibilityRole="button"
              accessibilityLabel="View result"
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 999,
                alignItems: "center",
                backgroundColor: colors.primary,
              }}
            >
              <Text
                style={[
                  type.labelLg,
                  { color: colors.onPrimary, fontSize: 15 },
                ]}
              >
                View
              </Text>
            </PressScale>
            <PressScale
              onPress={() => ask(latest.id)}
              accessibilityRole="button"
              accessibilityLabel="Remove this result"
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: withAlpha(colors.errorContainer, 0.55),
              }}
            >
              <Icon name="delete-outline" size={22} color={colors.error} />
            </PressScale>
          </View>
        </View>
      </ScrollView>
      {overlay}
    </View>
  );
}
