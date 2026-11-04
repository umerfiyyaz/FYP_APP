import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { PressScale } from "@/components/animations/PressScale";
import { BrandHeader } from "@/components/ui/BrandHeader";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { catPhotos } from "@/constants/catImages";
import { SHOW_DEMO_CONTROLS } from "@/constants/demo";
import { FilterBar, type KindFilter } from "@/features/history/FilterBar";
import { openAlertsOf, useAlerts } from "@/store/alertStore";
import { historyActions, type Period } from "@/store/historyStore";
import {
  colors,
  gradients,
  radius,
  shadows,
  spacing,
  type,
  withAlpha,
} from "@/theme";
import type { Cat } from "@/types/pets";
import { go } from "@/utils/nav";

// Screen 15 - History, no analyses yet.

function Segment({ flex, color }: { flex: number; color: string }) {
  return (
    <View
      style={{ flex, height: 10, borderRadius: 5, backgroundColor: color }}
    />
  );
}

export function HistoryEmpty({ cat }: { cat: Cat | undefined }) {
  const { alerts } = useAlerts();
  const [period, setPeriod] = useState<Period>("week");
  const [kind, setKind] = useState<KindFilter>("all");
  const name = cat?.name ?? "Milo";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BrandHeader
        subtitle="History"
        hasAlert={openAlertsOf(alerts, cat?.id).length > 0}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.margin,
          paddingBottom: 130,
          gap: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text
              style={{
                ...type.headlineXlMobile,
                fontSize: 30,
                color: colors.onSurface,
              }}
              numberOfLines={1}
            >
              {`${name}'s journal`}
            </Text>
            <Text style={[type.bodyMd, { color: colors.onSurfaceVariant }]}>
              0 logs recorded
            </Text>
          </View>
          <PressScale
            onPress={() => go("/cats")}
            accessibilityRole="button"
            accessibilityLabel="Switch cat"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingLeft: 6,
              paddingRight: 12,
              paddingVertical: 6,
              borderRadius: radius.full,
              backgroundColor: colors.surfaceContainer,
            }}
          >
            {cat ? (
              <Image
                source={cat.photo}
                style={{ width: 30, height: 30, borderRadius: 15 }}
              />
            ) : null}
            <Text style={[type.labelLg, { color: colors.onSurface }]}>
              {name}
            </Text>
            <Icon name="expand-more" size={20} color={colors.onSurface} />
          </PressScale>
        </View>

        <FilterBar
          period={period}
          onPeriod={setPeriod}
          kind={kind}
          onKind={setKind}
        />

        {/* empty hero */}
        <LinearGradient
          colors={[
            colors.surfaceContainerHigh,
            colors.surfaceContainer,
            colors.surfaceContainerLow,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: radius.xl,
            padding: 24,
            alignItems: "center",
            boxShadow: shadows.xlDeep,
          }}
        >
          <View
            style={{
              alignSelf: "flex-end",
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: radius.full,
              backgroundColor: colors.surfaceContainerLowest,
            }}
          >
            <Text style={[type.labelMd, { color: colors.onSurface }]}>
              Zzz...
            </Text>
          </View>
          <Image
            source={catPhotos.sleepingKitten}
            style={{
              width: "88%",
              aspectRatio: 1.9,
              borderRadius: radius.base,
              marginTop: 6,
              backgroundColor: colors.surfaceContainerLowest,
            }}
            resizeMode="cover"
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginTop: 22,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: radius.full,
              backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.7),
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.primaryContainer,
              }}
            />
            <Text
              style={[
                type.labelSm,
                { color: colors.onSurface, letterSpacing: 0.8, fontSize: 11 },
              ]}
            >
              {`WAITING FOR ${name.toUpperCase()}'S FIRST ADVENTURE`}
            </Text>
          </View>
          <Text
            style={{
              ...type.headlineXlMobile,
              fontSize: 30,
              color: colors.onSurface,
              marginTop: 14,
            }}
          >
            No analyses yet
          </Text>
          <Text
            style={[
              type.bodyLg,
              {
                color: colors.onSurfaceVariant,
                textAlign: "center",
                marginTop: 8,
              },
            ]}
          >
            Upload your first video to see daily charts, rest vs. active balance
            and sound moods.
          </Text>
          <Button
            label="Upload first video"
            icon="cloud-upload"
            iconPosition="left"
            gradient={gradients.ctaVertical}
            paddingVertical={18}
            onPress={() => go("/(tabs)/analyze")}
            style={{ alignSelf: "stretch", marginTop: 22 }}
          />
        </LinearGradient>

        {/* what you'll unlock */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 6,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Icon
              name="auto-awesome"
              size={22}
              color={colors.primaryContainer}
            />
            <Text
              style={[
                type.headlineSm,
                { fontSize: 20, color: colors.onSurface },
              ]}
            >
              What you'll unlock
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: radius.full,
              backgroundColor: colors.surfaceContainerHigh,
            }}
          >
            <Text
              style={[
                type.labelSm,
                { color: colors.onSurfaceVariant, letterSpacing: 0.8 },
              ]}
            >
              PREVIEW MODE
            </Text>
          </View>
        </View>

        <View
          style={{
            borderRadius: radius.lg,
            padding: 20,
            gap: 14,
            backgroundColor: colors.surfaceContainer,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: withAlpha(colors.secondaryContainer, 0.3),
              }}
            >
              <Icon name="graphic-eq" size={24} color={colors.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                Mood timeline preview
              </Text>
              <Text style={[type.bodyMd, { color: colors.onSurfaceVariant }]}>
                Sound mood through the day
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: radius.full,
                backgroundColor: withAlpha(colors.secondaryContainer, 0.3),
              }}
            >
              <Text style={[type.labelMd, { color: colors.secondary }]}>
                Sample
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 4 }}>
            <Segment flex={3.2} color={colors.secondary} />
            <Segment flex={1.6} color={colors.primaryContainer} />
            <Segment flex={2.6} color={colors.tertiaryContainer} />
            <Segment flex={0.8} color={colors.surfaceContainerHighest} />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={[type.labelMd, { color: colors.onSurfaceVariant }]}>
              08:00 AM
            </Text>
            <Text style={[type.labelMd, { color: colors.secondary }]}>
              Affectionate meows
            </Text>
            <Text style={[type.labelMd, { color: colors.onSurfaceVariant }]}>
              08:00 PM
            </Text>
          </View>
        </View>

        <View
          style={{
            borderRadius: radius.lg,
            padding: 20,
            gap: 14,
            backgroundColor: colors.surfaceContainer,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: withAlpha(colors.primaryContainer, 0.2),
              }}
            >
              <Icon
                name="motion-photos-on"
                size={24}
                color={colors.primaryContainer}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                Rest vs. active balance preview
              </Text>
              <Text style={[type.bodyMd, { color: colors.onSurfaceVariant }]}>
                Posture & movement tracking
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: radius.full,
                backgroundColor: withAlpha(colors.primaryContainer, 0.18),
              }}
            >
              <Text style={[type.labelMd, { color: colors.primaryContainer }]}>
                Sample
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 4 }}>
            <Segment flex={14} color={colors.tertiaryContainer} />
            <Segment flex={6.5} color={colors.secondary} />
            <Segment flex={3.5} color={colors.primaryContainer} />
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {[
              { l: "Rest", v: "14h", c: colors.onSurface },
              { l: "Moving", v: "6.5h", c: colors.secondary },
              { l: "Groom", v: "3.5h", c: colors.onSurface },
            ].map((s) => (
              <View
                key={s.l}
                style={{
                  flex: 1,
                  alignItems: "center",
                  paddingVertical: 12,
                  borderRadius: radius.sm,
                  backgroundColor: colors.surfaceContainerLowest,
                }}
              >
                <Text style={[type.labelMd, { color: s.c }]}>{s.l}</Text>
                <Text
                  style={{
                    ...type.headlineSm,
                    fontSize: 22,
                    color: colors.onSurface,
                  }}
                >
                  {s.v}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {SHOW_DEMO_CONTROLS ? (
          <PressScale
            onPress={historyActions.resetDemo}
            accessibilityRole="button"
            style={{ alignSelf: "center", padding: 10 }}
          >
            <Text style={[type.labelMd, { color: colors.onSurfaceVariant }]}>
              Restore demo data
            </Text>
          </PressScale>
        ) : null}
      </ScrollView>
    </View>
  );
}
