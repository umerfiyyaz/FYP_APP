import { memo, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressScale } from "@/components/animations/PressScale";
import { Button } from "@/components/ui/Button";
import { Icon, IconName } from "@/components/ui/Icon";
import { ageShort, catActions, useCats } from "@/store/catStore";
import { formatAgo } from "@/store/historyStore";
import { colors, gradients, radius, shadows, type, withAlpha } from "@/theme";
import type { Cat } from "@/types/pets";
import { go, goBack } from "@/utils/nav";

// ---------------------------------------------------------------------------------------------
// Screen 19 - Cat switcher (bottom sheet over the app). Route: /cats  (opened from Home and Profile)
// ---------------------------------------------------------------------------------------------

function lastText(ts: number | null) {
  if (ts === null) return "No analyses yet";
  const days = Math.floor((Date.now() - ts) / 86_400_000);
  return days === 1
    ? "Last analysis yesterday"
    : `Last analysis ${formatAgo(ts)}`;
}

function Chip({
  label,
  tone,
  icon,
  dot,
}: {
  label: string;
  tone: "mint" | "lavender" | "coral";
  icon?: IconName;
  dot?: boolean;
}) {
  const c = {
    mint: {
      bg: withAlpha(colors.secondaryContainer, 0.3),
      fg: colors.secondary,
    },
    lavender: {
      bg: withAlpha(colors.tertiaryContainer, 0.28),
      fg: colors.tertiary,
    },
    coral: { bg: withAlpha(colors.errorContainer, 0.7), fg: colors.error },
  }[tone];
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radius.full,
        backgroundColor: c.bg,
      }}
    >
      {dot ? (
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: c.fg,
          }}
        />
      ) : null}
      {icon ? <Icon name={icon} size={14} color={c.fg} /> : null}
      <Text style={[type.labelMd, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

const CatCard = memo(function CatCard({
  cat,
  active,
}: {
  cat: Cat;
  active: boolean;
}) {
  const dotColor = cat.attention
    ? colors.error
    : active
      ? colors.secondary
      : colors.tertiaryContainer;
  return (
    <PressScale
      onPress={() => go(`/cat/${cat.id}`)}
      scaleTo={0.99}
      accessibilityRole="button"
      accessibilityLabel={`Open ${cat.name}'s profile`}
      style={{
        borderRadius: radius.lg,
        padding: 16,
        gap: 12,
        backgroundColor: active
          ? colors.surfaceContainerHigh
          : withAlpha(colors.surfaceContainerHigh, 0.55),
        borderWidth: 1,
        borderColor: active ? withAlpha(colors.secondary, 0.35) : "transparent",
        boxShadow: active ? shadows.mintGlow : undefined,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        <View style={{ width: 88, height: 88 }}>
          <Image
            source={cat.photo}
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: colors.surfaceContainer,
            }}
          />
          <View
            style={{
              position: "absolute",
              right: -2,
              bottom: -2,
              width: 26,
              height: 26,
              borderRadius: 13,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: dotColor,
              borderWidth: 3,
              borderColor: colors.surfaceContainerHigh,
            }}
          >
            {active ? (
              <Icon name="check" size={13} color={colors.onSecondary} />
            ) : null}
          </View>
        </View>
        <View style={{ flex: 1, gap: 6 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <Text
              style={{
                ...type.headlineXlMobile,
                fontSize: 24,
                lineHeight: 30,
                color: colors.onSurface,
              }}
              numberOfLines={1}
            >
              {cat.name}
            </Text>
            {active ? (
              <Chip label="Active" tone="mint" />
            ) : cat.attention ? (
              <Chip label="1 alert" tone="coral" dot />
            ) : (
              <Chip label={cat.mood} tone="lavender" />
            )}
          </View>
          {active && cat.mood ? (
            <Chip label={cat.mood} tone="mint" icon="sentiment-satisfied-alt" />
          ) : null}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <Text
              style={[
                type.bodyMd,
                { color: colors.onSurfaceVariant, flexShrink: 1 },
              ]}
              numberOfLines={1}
            >
              {active ? cat.breed : `${cat.breed} • ${ageShort(cat.ageYears)}`}
            </Text>
            {active ? (
              <Text style={[type.labelMd, { color: colors.onSurfaceVariant }]}>
                {cat.lastAnalysisAt ? formatAgo(cat.lastAnalysisAt) : ""}
              </Text>
            ) : (
              <PressScale
                onPress={() => catActions.setActive(cat.id)}
                accessibilityRole="button"
                accessibilityLabel={`Switch to ${cat.name}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 2,
                  paddingLeft: 16,
                  paddingRight: 10,
                  paddingVertical: 9,
                  borderRadius: radius.full,
                  backgroundColor: colors.surfaceContainerHighest,
                }}
              >
                <Text style={[type.labelLg, { color: colors.onSurface }]}>
                  Switch
                </Text>
                <Icon name="chevron-right" size={18} color={colors.onSurface} />
              </PressScale>
            )}
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
          }}
        >
          {active ? (
            <>
              <Icon
                name="radio-button-checked"
                size={17}
                color={colors.secondary}
              />
              <Text style={[type.labelLg, { color: colors.secondary }]}>
                Current view
              </Text>
            </>
          ) : cat.attention ? (
            <>
              <Icon
                name="notifications-active"
                size={17}
                color={colors.error}
              />
              <Text
                style={[type.bodyMd, { color: colors.error, flexShrink: 1 }]}
                numberOfLines={1}
              >
                {cat.attention}
              </Text>
            </>
          ) : (
            <>
              <Icon name="self-improvement" size={17} color={colors.tertiary} />
              <Text style={[type.bodyMd, { color: colors.onSurfaceVariant }]}>
                {cat.note || "Quiet day"}
              </Text>
            </>
          )}
        </View>
        <Text style={[type.labelMd, { color: colors.onSurfaceVariant }]}>
          {active ? "Synced" : lastText(cat.lastAnalysisAt)}
        </Text>
      </View>
    </PressScale>
  );
});

export default function CatSwitcher() {
  const insets = useSafeAreaInsets();
  const { cats, activeId } = useCats();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [anim]);

  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <Stack.Screen
        options={{
          presentation: "transparentModal",
          animation: "fade",
          headerShown: false,
        }}
      />
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(13,7,47,0.8)",
          opacity: anim,
        }}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={goBack}
          accessibilityLabel="Close"
        />
      </Animated.View>
      <Animated.View
        style={{
          maxHeight: "92%",
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          backgroundColor: colors.surfaceContainer,
          paddingTop: 12,
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [80, 0],
              }),
            },
          ],
        }}
      >
        <View
          style={{
            alignSelf: "center",
            width: 48,
            height: 5,
            borderRadius: 3,
            backgroundColor: withAlpha(colors.onSurface, 0.2),
          }}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 18,
            paddingBottom: insets.bottom + 20,
            gap: 14,
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
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                flexShrink: 1,
              }}
            >
              <Text
                style={{
                  ...type.headlineXlMobile,
                  fontSize: 28,
                  color: colors.onSurface,
                }}
              >
                Switch Cat
              </Text>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: radius.full,
                  backgroundColor: colors.surfaceContainerHigh,
                }}
              >
                <Text
                  style={[type.labelMd, { color: colors.tertiary }]}
                >{`Your cats (${cats.length})`}</Text>
              </View>
            </View>
            <PressScale
              onPress={goBack}
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.surfaceContainerHigh,
              }}
            >
              <Icon name="close" size={22} color={colors.onSurface} />
            </PressScale>
          </View>
          <Text style={[type.bodyLg, { color: colors.onSurfaceVariant }]}>
            Select which feline companion CatSense AI should tune its daily
            emotional analysis to.
          </Text>

          {cats.map((c) => (
            <CatCard key={c.id} cat={c} active={c.id === activeId} />
          ))}

          <PressScale
            onPress={() => go("/add-cat")}
            accessibilityRole="button"
            accessibilityLabel="Add new cat"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              padding: 16,
              borderRadius: radius.lg,
              backgroundColor: colors.surfaceContainerLowest,
            }}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.surfaceContainerHigh,
              }}
            >
              <Icon name="add" size={26} color={colors.onSurface} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                Add new cat
              </Text>
              <Text style={[type.bodyMd, { color: colors.onSurfaceVariant }]}>
                Create profile & build baseline
              </Text>
            </View>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.surfaceContainerHigh,
              }}
            >
              <Icon name="arrow-forward" size={20} color={colors.onSurface} />
            </View>
          </PressScale>

          <View
            style={{
              flexDirection: "row",
              gap: 12,
              padding: 16,
              borderRadius: radius.md,
              backgroundColor: colors.surfaceContainerLowest,
            }}
          >
            <Icon
              name="verified-user"
              size={22}
              color={colors.primaryFixedDim}
            />
            <Text
              style={[type.bodyLg, { color: colors.onSurfaceVariant, flex: 1 }]}
            >
              Profiles keep each cat's sound history and habits separate for
              more precise mood tracking.
            </Text>
          </View>

          <Button
            label="Done"
            icon="check-circle-outline"
            iconPosition="left"
            gradient={gradients.ctaVertical}
            paddingVertical={18}
            onPress={goBack}
          />
        </ScrollView>
      </Animated.View>
    </View>
  );
}
