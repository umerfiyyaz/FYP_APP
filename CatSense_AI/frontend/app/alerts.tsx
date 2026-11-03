import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Image, Switch, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { PressScale } from "@/components/animations/PressScale";
import { BrandHeader } from "@/components/ui/BrandHeader";
import { Icon, IconName } from "@/components/ui/Icon";
import { UndoToast } from "@/components/ui/UndoToast";
import { catPhotos } from "@/constants/catImages";
import { SHOW_DEMO_CONTROLS } from "@/constants/demo";
import { alertActions, openAlertsOf, useAlerts } from "@/store/alertStore";
import { useActiveCat } from "@/store/catStore";
import { formatDuration, formatWhen } from "@/store/historyStore";
import {
  colors,
  fonts,
  gradients,
  radius,
  shadows,
  spacing,
  type,
  withAlpha,
} from "@/theme";
import type { PetAlert } from "@/types/pets";
import { go, goBack } from "@/utils/nav";

// ---------------------------------------------------------------------------------------------
// Screen 17 - Alerts (+ "All clear" state). Route: /alerts
// ---------------------------------------------------------------------------------------------

const WAVE = [14, 24, 36, 26, 12, 8, 22, 38, 30, 16, 10, 14, 28, 36, 22, 10];

function LevelBadge({ level }: { level: PetAlert["level"] }) {
  const cfg = {
    high: {
      label: "HIGH PRIORITY",
      icon: "warning" as IconName,
      bg: colors.errorContainer,
      fg: colors.onErrorContainer,
    },
    medium: {
      label: "MEDIUM",
      icon: "shield" as IconName,
      bg: withAlpha(colors.primaryContainer, 0.2),
      fg: colors.primaryFixedDim,
    },
    advisory: {
      label: "ADVISORY",
      icon: "info-outline" as IconName,
      bg: withAlpha(colors.tertiaryContainer, 0.22),
      fg: colors.tertiary,
    },
  }[level];
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radius.full,
        backgroundColor: cfg.bg,
      }}
    >
      <Icon name={cfg.icon} size={14} color={cfg.fg} />
      <Text style={[type.labelSm, { color: cfg.fg, letterSpacing: 0.8 }]}>
        {cfg.label}
      </Text>
    </View>
  );
}

function Detail({ text, emphasis }: { text: string; emphasis?: string }) {
  const base = [type.bodyLg, { color: colors.onSurfaceVariant }];
  if (!emphasis || !text.includes(emphasis))
    return <Text style={base}>{text}</Text>;
  const [a, b] = text.split(emphasis);
  return (
    <Text style={base}>
      {a}
      <Text style={{ fontFamily: fonts.bold, color: colors.onSurface }}>
        {emphasis}
      </Text>
      {b}
    </Text>
  );
}

const cardBase = {
  borderRadius: radius.lg,
  padding: 20,
  backgroundColor: colors.surfaceContainer,
  boxShadow: shadows.xlDeep,
} as const;

const AlertCard = memo(function AlertCard({ alert }: { alert: PetAlert }) {
  const top = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <LevelBadge level={alert.level} />
      <Text style={[type.bodyMd, { color: colors.onSurfaceVariant }]}>
        {formatWhen(alert.createdAt).replace(" ", " • ")}
      </Text>
    </View>
  );

  if (alert.level === "high") {
    return (
      <View
        style={[
          cardBase,
          {
            borderWidth: 1,
            borderColor: withAlpha(colors.error, 0.18),
            gap: 12,
          },
        ]}
      >
        {top}
        <Text
          style={{
            ...type.headlineXlMobile,
            fontSize: 24,
            lineHeight: 30,
            color: colors.error,
          }}
        >
          {alert.title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <Icon name="videocam" size={16} color={colors.onSurfaceVariant} />
          <Text style={[type.bodyMd, { color: colors.onSurfaceVariant }]}>
            {alert.source}
            {alert.confidence != null ? " • Acoustic confidence " : ""}
            {alert.confidence != null ? (
              <Text
                style={{ fontFamily: fonts.bold, color: colors.onSurface }}
              >{`${alert.confidence}%`}</Text>
            ) : null}
          </Text>
        </View>
        <View
          style={{
            borderRadius: 6,
            backgroundColor: colors.surfaceContainerLowest,
            padding: 14,
            gap: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Icon name="graphic-eq" size={16} color={colors.error} />
              <Text style={[type.labelMd, { color: colors.error }]}>
                Sound pattern
              </Text>
            </View>
            <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
              {formatDuration(alert.durationSec ?? 0)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              height: 44,
            }}
          >
            {WAVE.map((h, i) => (
              <View
                key={i}
                style={{
                  width: 5,
                  height: h,
                  borderRadius: 3,
                  backgroundColor:
                    i % 3 === 0 ? colors.error : withAlpha(colors.error, 0.55),
                }}
              />
            ))}
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
          <PressScale
            onPress={() => go(`/sound/${alert.itemId}`)}
            accessibilityRole="button"
            accessibilityLabel="Listen"
            style={{
              flex: 1.35,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingVertical: 15,
              borderRadius: radius.full,
              backgroundColor: colors.error,
              boxShadow: "0 6px 18px rgba(255,180,171,0.3)",
            }}
          >
            <Icon name="play-arrow" size={20} color="#690005" />
            <Text
              style={[type.labelLg, { color: "#690005" }]}
            >{`Listen ${formatDuration(alert.durationSec ?? 0)}`}</Text>
          </PressScale>
          <PressScale
            onPress={() => alertActions.resolve(alert.id)}
            accessibilityRole="button"
            accessibilityLabel="Mark resolved"
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              paddingVertical: 15,
              borderRadius: radius.full,
              backgroundColor: colors.surfaceContainerHigh,
            }}
          >
            <Icon
              name="check-circle-outline"
              size={18}
              color={colors.onSurface}
            />
            <Text style={[type.labelLg, { color: colors.onSurface }]}>
              Mark resolved
            </Text>
          </PressScale>
        </View>
      </View>
    );
  }

  if (alert.level === "medium") {
    return (
      <View style={[cardBase, { gap: 12 }]}>
        {top}
        <Text
          style={{
            ...type.headlineXlMobile,
            fontSize: 24,
            lineHeight: 30,
            color: colors.primaryFixedDim,
          }}
        >
          {alert.title}
        </Text>
        <Detail text={alert.detail} emphasis={alert.emphasis} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 4,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Icon name="analytics" size={18} color={colors.onSurfaceVariant} />
            <Text
              style={[
                type.bodyMd,
                { color: colors.onSurfaceVariant, flexShrink: 1 },
              ]}
              numberOfLines={1}
            >
              {alert.source}
            </Text>
          </View>
          <PressScale
            onPress={() => alertActions.dismiss(alert.id)}
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.surfaceContainerHigh,
            }}
          >
            <Icon name="close" size={20} color={colors.onSurface} />
          </PressScale>
          <PressScale
            onPress={() => go(`/results/${alert.itemId}`)}
            accessibilityRole="button"
            accessibilityLabel="Review clip"
            style={{ borderRadius: radius.full, boxShadow: shadows.ctaSoft }}
          >
            <LinearGradient
              {...gradients.ctaVertical}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingVertical: 13,
                paddingHorizontal: 18,
                borderRadius: radius.full,
              }}
            >
              <Icon
                name="play-circle-outline"
                size={20}
                color={colors.onPrimary}
              />
              <Text style={[type.labelLg, { color: colors.onPrimary }]}>
                Review clip
              </Text>
            </LinearGradient>
          </PressScale>
        </View>
      </View>
    );
  }

  return (
    <View style={[cardBase, { gap: 12 }]}>
      {top}
      <Text
        style={{
          ...type.headlineXlMobile,
          fontSize: 24,
          lineHeight: 30,
          color: colors.onSurface,
        }}
      >
        {alert.title}
      </Text>
      <Detail text={alert.detail} emphasis={alert.emphasis} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginTop: 4,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Icon name="insights" size={18} color={colors.tertiary} />
          <Text
            style={[type.labelMd, { color: colors.tertiary, flexShrink: 1 }]}
            numberOfLines={1}
          >
            {alert.source}
          </Text>
        </View>
        <PressScale
          onPress={() => alertActions.acknowledge(alert.id)}
          accessibilityRole="button"
          accessibilityLabel="Acknowledge"
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingVertical: 14,
            paddingHorizontal: 22,
            borderRadius: radius.full,
            backgroundColor: colors.surfaceContainerHigh,
          }}
        >
          <Icon name="done" size={18} color={colors.onSurface} />
          <Text style={[type.labelLg, { color: colors.onSurface }]}>
            Acknowledge
          </Text>
        </PressScale>
      </View>
    </View>
  );
});

function AllClear({ catName }: { catName: string }) {
  const stats = [
    { v: "98%", l: "Purr Index", c: colors.secondary },
    { v: "14.1h", l: "Rest Time", c: colors.tertiary },
    { v: "Normal", l: "Vocal Tone", c: colors.primaryFixedDim },
  ];
  return (
    <View style={[cardBase, { alignItems: "center", gap: 12 }]}>
      <Image
        source={catPhotos.allClear}
        style={{ width: 132, height: 132, borderRadius: 66 }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingHorizontal: 12,
          paddingVertical: 5,
          borderRadius: radius.full,
          backgroundColor: withAlpha(colors.secondaryContainer, 0.28),
        }}
      >
        <Icon name="spa" size={15} color={colors.secondary} />
        <Text style={[type.labelMd, { color: colors.secondary }]}>
          Calm Harmony • All clear!
        </Text>
      </View>
      <Text
        style={{
          ...type.headlineXlMobile,
          color: colors.onSurface,
          textAlign: "center",
        }}
      >
        Zero Active Concerns
      </Text>
      <Text
        style={[
          type.bodyMd,
          { color: colors.onSurfaceVariant, textAlign: "center" },
        ]}
      >
        {`No open alerts. Sound and video analysis show peaceful purring, regular active cycles and a stable baseline for ${catName}.`}
      </Text>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignSelf: "stretch",
          marginTop: 4,
        }}
      >
        {stats.map((s) => (
          <View
            key={s.l}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 12,
              borderRadius: radius.base,
              backgroundColor: colors.surfaceContainerLowest,
            }}
          >
            <Text style={[type.labelLg, { color: s.c, fontSize: 16 }]}>
              {s.v}
            </Text>
            <Text
              style={[
                type.labelSm,
                { color: colors.onSurfaceVariant, marginTop: 2 },
              ]}
            >
              {s.l}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function AlertsScreen() {
  const cat = useActiveCat();
  const { alerts, push, last } = useAlerts();
  const [preview, setPreview] = useState(false); // demo: "State B"
  const [highOnly, setHighOnly] = useState(false);

  useEffect(() => {
    if (cat) alertActions.hydrate(cat.id);
  }, [cat]);

  const open = useMemo(() => openAlertsOf(alerts, cat?.id), [alerts, cat?.id]);
  const data = useMemo(
    () =>
      preview ? [] : highOnly ? open.filter((a) => a.level === "high") : open,
    [open, preview, highOnly],
  );
  const renderItem = useCallback(
    ({ item }: { item: PetAlert }) => <AlertCard alert={item} />,
    [],
  );
  const keyOf = useCallback((a: PetAlert) => a.id, []);

  const empty =
    highOnly && open.length > 0 && !preview ? (
      <Text
        style={[
          type.bodyMd,
          {
            color: colors.onSurfaceVariant,
            textAlign: "center",
            paddingVertical: 24,
          },
        ]}
      >
        No high priority alerts.
      </Text>
    ) : (
      <AllClear catName={cat?.name ?? "your cat"} />
    );

  const count = preview ? 0 : open.length;

  const header = (
    <View style={{ gap: 16, marginBottom: 16 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          marginTop: 8,
        }}
      >
        <Text
          style={{
            ...type.headlineXlMobile,
            fontSize: 30,
            color: colors.onSurface,
          }}
        >
          Alerts
        </Text>
        {count > 0 ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: radius.full,
              backgroundColor: colors.error,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.errorContainer,
              }}
            />
            <Text
              style={[type.labelSm, { color: "#690005", fontSize: 11 }]}
            >{`${count} NEW`}</Text>
          </View>
        ) : null}
        <View style={{ flex: 1 }} />
        {SHOW_DEMO_CONTROLS ? (
          <PressScale
            onPress={() => setPreview((p) => !p)}
            accessibilityRole="button"
            accessibilityLabel="Preview all clear state"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 16,
              paddingVertical: 11,
              borderRadius: radius.full,
              backgroundColor: preview
                ? withAlpha(colors.secondaryContainer, 0.35)
                : colors.surfaceContainer,
            }}
          >
            <Icon name="sync-alt" size={18} color={colors.onSurface} />
            <Text style={[type.labelLg, { color: colors.onSurface }]}>
              {preview ? "Back to alerts" : "Preview State B"}
            </Text>
          </PressScale>
        ) : null}
        <PressScale
          onPress={() => setHighOnly((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel="Filter high priority"
          accessibilityState={{ selected: highOnly }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: highOnly
              ? colors.primaryContainer
              : colors.surfaceContainer,
          }}
        >
          <Icon
            name="filter-list"
            size={22}
            color={highOnly ? colors.onPrimary : colors.onSurface}
          />
        </PressScale>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          padding: 14,
          borderRadius: radius.md,
          backgroundColor: colors.surfaceContainer,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: withAlpha(colors.secondaryContainer, 0.28),
          }}
        >
          <Icon
            name="notifications-active"
            size={22}
            color={colors.secondary}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.labelLg, { color: colors.onSurface }]}>
            Push notifications
          </Text>
          <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
            Instant message for HIGH events
          </Text>
        </View>
        <Switch
          value={push}
          onValueChange={alertActions.setPush}
          trackColor={{
            false: colors.surfaceContainerHighest,
            true: colors.secondary,
          }}
          thumbColor={colors.white}
          accessibilityLabel="Push notifications"
        />
      </View>
    </View>
  );

  const footer = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: 16,
        padding: 14,
        borderRadius: radius.md,
        backgroundColor: colors.surfaceContainerLowest,
      }}
    >
      <Icon name="medical-services" size={22} color={colors.onSurfaceVariant} />
      <Text style={[type.bodyMd, { color: colors.onSurfaceVariant, flex: 1 }]}>
        CatSense AI detection is supportive.{" "}
        <Text style={{ fontFamily: fonts.bold, color: colors.onSurface }}>
          Always consult your vet
        </Text>{" "}
        for health concerns.
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BrandHeader subtitle="Alerts" onBack={goBack} onBell={() => {}} />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyOf}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        ListFooterComponent={footer}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={{
          paddingHorizontal: spacing.margin,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        windowSize={5}
      />
      <UndoToast
        visible={last !== null}
        message={last?.label}
        onUndo={alertActions.undo}
        onDone={alertActions.clearUndo}
        bottomOffset={24}
      />
    </View>
  );
}
