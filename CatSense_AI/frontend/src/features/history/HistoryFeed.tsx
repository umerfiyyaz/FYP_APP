import { memo, useCallback, useMemo, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { PressScale } from "@/components/animations/PressScale";
import { BrandHeader } from "@/components/ui/BrandHeader";
import { Icon } from "@/components/ui/Icon";
import { Tag, type TagTone } from "@/components/ui/Tag";
import { images } from "@/constants/images";
import {
  FilterBar,
  type KindCounts,
  type KindFilter,
} from "@/features/history/FilterBar";
import { useRemoveFlow } from "@/features/history/useRemoveFlow";
import { alertActions, openAlertsOf, useAlerts } from "@/store/alertStore";
import {
  formatDuration,
  formatWhen,
  inPeriod,
  type HistoryItem,
  type Period,
} from "@/store/historyStore";
import { colors, radius, shadows, spacing, type, withAlpha } from "@/theme";
import type { Cat, PetAlert } from "@/types/pets";
import { go } from "@/utils/nav";

// Screen 16 - History with results. Every analysis is saved here automatically; each one has a Remove button.

const behaviorTone = (i: HistoryItem): TagTone =>
  i.kind === "alert"
    ? "coral"
    : i.behavior === "Resting"
      ? "lavender"
      : "orange";
const moodTone = (m: string): TagTone =>
  m === "Happy" || m === "Calm" ? "mint" : "neutral";
const behaviorLabel = (i: HistoryItem) =>
  `${i.kind === "alert" ? "Alert" : i.behavior} ${i.confidence}%`;
const PERIOD_TITLE: Record<Period, string> = {
  week: "Weekly balance",
  month: "Monthly balance",
  all: "Overall balance",
};
const PERIOD_COUNT: Record<Period, string> = {
  week: "this week",
  month: "this month",
  all: "in total",
};

function Thumb({ item, w, h }: { item: HistoryItem; w: number; h: number }) {
  return (
    <View
      style={{
        width: w,
        height: h,
        borderRadius: radius.base,
        overflow: "hidden",
        backgroundColor: colors.surfaceContainerLowest,
      }}
    >
      <Image
        source={item.thumbUrl ? { uri: item.thumbUrl } : images.catEdit}
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
          <Icon name="play-arrow" size={20} color={colors.primaryContainer} />
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          left: 6,
          bottom: 6,
          flexDirection: "row",
          alignItems: "center",
          gap: 3,
          paddingHorizontal: 7,
          paddingVertical: 2,
          borderRadius: radius.full,
          backgroundColor: "rgba(13,7,47,0.7)",
        }}
      >
        <Icon name="timer" size={11} color={colors.onSurface} />
        <Text style={[type.labelSm, { color: colors.onSurface }]}>
          {formatDuration(item.durationSec)}
        </Text>
      </View>
    </View>
  );
}

function AlertBanner({ alert }: { alert: PetAlert }) {
  return (
    <View
      style={{
        borderRadius: radius.lg,
        padding: 18,
        gap: 12,
        backgroundColor: withAlpha(colors.errorContainer, 0.3),
        borderWidth: 1,
        borderColor: withAlpha(colors.error, 0.25),
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
            backgroundColor: colors.errorContainer,
          }}
        >
          <Icon
            name="priority-high"
            size={22}
            color={colors.onErrorContainer}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.labelMd, { color: colors.error }]}>
            {`${alert.level === "high" ? "Acoustic Anomaly" : "Alert"} • ${formatWhen(alert.createdAt)}`}
          </Text>
          <Text style={[type.headlineSm, { color: colors.onSurface }]}>
            {alert.title}
          </Text>
        </View>
      </View>
      <Text
        style={[type.bodyMd, { color: colors.onSurfaceVariant }]}
      >{`${alert.detail} Review recommended with your vet.`}</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <PressScale
          onPress={() => go(`/sound/${alert.itemId}`)}
          accessibilityRole="button"
          accessibilityLabel="Listen"
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: radius.full,
            backgroundColor: colors.error,
          }}
        >
          <Icon name="play-arrow" size={18} color="#690005" />
          <Text
            style={[type.labelLg, { color: "#690005" }]}
          >{`Listen ${formatDuration(alert.durationSec ?? 0)}`}</Text>
        </PressScale>
        <PressScale
          onPress={() => {
            alertActions.dismiss(alert.id);
            alertActions.clearUndo();
          }}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: radius.full,
            backgroundColor: colors.surfaceContainerHigh,
          }}
        >
          <Text style={[type.labelLg, { color: colors.onSurface }]}>
            Dismiss
          </Text>
        </PressScale>
      </View>
    </View>
  );
}

function Donut({
  restPct,
  label,
  sub,
}: {
  restPct: number;
  label: string;
  sub: string;
}) {
  const size = 96;
  const sw = 12;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.secondary}
          strokeWidth={sw}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.tertiaryContainer}
          strokeWidth={sw}
          fill="none"
          strokeDasharray={`${(c * restPct) / 100} ${c}`}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text style={[type.headlineSm, { color: colors.onSurface }]}>
          {label}
        </Text>
        <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
          {sub}
        </Text>
      </View>
    </View>
  );
}

const RecordRow = memo(function RecordRow({
  item,
  onRemove,
}: {
  item: HistoryItem;
  onRemove: (id: string) => void;
}) {
  return (
    <View
      style={{
        borderRadius: radius.md,
        padding: 16,
        gap: 12,
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor:
                item.kind === "alert" ? colors.error : colors.primaryContainer,
            }}
          />
          <Text style={[type.labelLg, { color: colors.onSurface }]}>
            {formatWhen(item.createdAt)}
          </Text>
        </View>
        <Text
          style={[type.bodySm, { color: colors.onSurfaceVariant }]}
        >{`${formatDuration(item.durationSec)} duration`}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View
          style={{ flex: 1, flexDirection: "row", gap: 6, flexWrap: "wrap" }}
        >
          <Tag label={behaviorLabel(item)} tone={behaviorTone(item)} />
          <Tag label={item.mood} tone={moodTone(item.mood)} />
        </View>
        <PressScale
          onPress={() => go(`/results/${item.id}`)}
          accessibilityRole="button"
          accessibilityLabel="View details"
          style={{
            paddingHorizontal: 14,
            paddingVertical: 9,
            borderRadius: radius.full,
            backgroundColor: colors.surfaceContainerHigh,
          }}
        >
          <Text style={[type.labelMd, { color: colors.onSurface }]}>
            View details
          </Text>
        </PressScale>
        <PressScale
          onPress={() => onRemove(item.id)}
          accessibilityRole="button"
          accessibilityLabel="Remove this result"
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: withAlpha(colors.errorContainer, 0.5),
          }}
        >
          <Icon name="delete-outline" size={20} color={colors.error} />
        </PressScale>
      </View>
    </View>
  );
});

type Props = { cat: Cat | undefined; items: HistoryItem[] };

export function HistoryFeed({ cat, items }: Props) {
  const name = cat?.name ?? "Milo";
  const { alerts } = useAlerts();
  const { ask, overlay } = useRemoveFlow(name);
  const [period, setPeriod] = useState<Period>("week");
  const [kind, setKind] = useState<KindFilter>("all");

  const openAlerts = useMemo(
    () => openAlertsOf(alerts, cat?.id),
    [alerts, cat?.id],
  );
  const inRange = useMemo(
    () => items.filter((i) => inPeriod(i.createdAt, period)),
    [items, period],
  );
  const counts = useMemo<KindCounts>(
    () => ({
      all: inRange.length,
      behavior: inRange.filter((i) => i.kind === "behavior").length,
      sound: inRange.filter((i) => i.kind === "sound").length,
      alert: inRange.filter((i) => i.kind === "alert").length,
    }),
    [inRange],
  );
  const filtered = useMemo(
    () => (kind === "all" ? inRange : inRange.filter((i) => i.kind === kind)),
    [inRange, kind],
  );
  const latest = filtered[0];
  const rest = useMemo(() => filtered.slice(1), [filtered]);

  // Rest vs. active, from the seconds that were analysed (not a 24h claim).
  const balance = useMemo(() => {
    const behav = inRange.filter((i) => i.kind !== "sound");
    const total = behav.reduce((a, i) => a + i.durationSec, 0);
    const restSec = behav
      .filter((i) => i.behavior === "Resting")
      .reduce((a, i) => a + i.durationSec, 0);
    return {
      total,
      restSec,
      restPct: total ? Math.round((restSec / total) * 100) : 0,
      clips: behav.length,
    };
  }, [inRange]);

  const banner =
    kind === "all" || kind === "alert"
      ? (openAlerts.find((a) => a.level === "high") ?? openAlerts[0])
      : undefined;
  const mins = (s: number) => (s / 60).toFixed(1);
  const renderItem = useCallback(
    ({ item }: { item: HistoryItem }) => (
      <RecordRow item={item} onRemove={ask} />
    ),
    [ask],
  );
  const keyOf = useCallback((i: HistoryItem) => i.id, []);

  const header = (
    <View style={{ gap: 16, marginBottom: 16 }}>
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
            Cat sound & video log
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: radius.full,
            backgroundColor: withAlpha(colors.secondaryContainer, 0.3),
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
          <Text style={[type.labelMd, { color: colors.secondary }]}>
            Synced
          </Text>
        </View>
      </View>

      <FilterBar
        period={period}
        onPeriod={setPeriod}
        kind={kind}
        onKind={setKind}
        counts={counts}
      />

      {banner ? <AlertBanner alert={banner} /> : null}

      {latest ? (
        <View
          style={{
            borderRadius: radius.lg,
            padding: 20,
            gap: 14,
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
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Icon name="verified" size={16} color={colors.secondary} />
              <Text style={[type.labelMd, { color: colors.secondary }]}>
                Latest result
              </Text>
            </View>
            <Text style={[type.bodyMd, { color: colors.onSurfaceVariant }]}>
              {formatWhen(latest.createdAt)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 14 }}>
            <Thumb item={latest} w={112} h={96} />
            <View style={{ flex: 1, gap: 6 }}>
              <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
                <Tag
                  label={behaviorLabel(latest)}
                  tone={behaviorTone(latest)}
                />
                <Tag label={latest.mood} tone={moodTone(latest.mood)} />
              </View>
              <Text
                style={[type.headlineSm, { color: colors.onSurface }]}
                numberOfLines={2}
              >
                {latest.title}
              </Text>
              <Text
                style={[type.bodySm, { color: colors.onSurfaceVariant }]}
                numberOfLines={2}
              >
                {latest.subtitle}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <PressScale
              onPress={() => go(`/results/${latest.id}`)}
              accessibilityRole="button"
              accessibilityLabel="View details"
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                paddingVertical: 14,
                borderRadius: radius.full,
                backgroundColor: colors.primary,
              }}
            >
              <Text style={[type.labelLg, { color: colors.onPrimary }]}>
                View details
              </Text>
              <Icon name="arrow-forward" size={18} color={colors.onPrimary} />
            </PressScale>
            <PressScale
              onPress={() => ask(latest.id)}
              accessibilityRole="button"
              accessibilityLabel="Remove this result"
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: 18,
                paddingVertical: 14,
                borderRadius: radius.full,
                backgroundColor: withAlpha(colors.errorContainer, 0.55),
              }}
            >
              <Icon name="delete-outline" size={18} color={colors.error} />
              <Text style={[type.labelLg, { color: colors.error }]}>
                Remove
              </Text>
            </PressScale>
          </View>
        </View>
      ) : (
        <View
          style={{
            alignItems: "center",
            paddingVertical: 28,
            borderRadius: radius.lg,
            backgroundColor: colors.surfaceContainer,
          }}
        >
          <Icon
            name="filter-list-off"
            size={28}
            color={colors.onSurfaceVariant}
          />
          <Text
            style={[
              type.bodyLg,
              { color: colors.onSurfaceVariant, marginTop: 8 },
            ]}
          >
            No results for this filter
          </Text>
        </View>
      )}

      {balance.clips > 0 ? (
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
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <Icon name="donut-small" size={20} color={colors.tertiary} />
            <Text
              style={[type.headlineSm, { color: colors.onSurface, flex: 1 }]}
            >
              {PERIOD_TITLE[period]}
            </Text>
            <Text
              style={[type.labelMd, { color: colors.onSurfaceVariant }]}
            >{`${mins(balance.total)} min analysed`}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
            <Donut
              restPct={balance.restPct}
              label={String(balance.clips)}
              sub="clips"
            />
            <View style={{ flex: 1, gap: 12 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: colors.tertiaryContainer,
                  }}
                />
                <View>
                  <Text
                    style={[type.labelLg, { color: colors.onSurface }]}
                  >{`Rest ${balance.restPct}%`}</Text>
                  <Text
                    style={[type.bodySm, { color: colors.onSurfaceVariant }]}
                  >{`${mins(balance.restSec)} min of clips`}</Text>
                </View>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: colors.secondary,
                  }}
                />
                <View>
                  <Text
                    style={[type.labelLg, { color: colors.onSurface }]}
                  >{`Active ${100 - balance.restPct}%`}</Text>
                  <Text
                    style={[type.bodySm, { color: colors.onSurfaceVariant }]}
                  >{`${mins(balance.total - balance.restSec)} min of clips`}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      ) : null}

      {rest.length > 0 ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text
            style={[type.headlineSm, { fontSize: 20, color: colors.onSurface }]}
          >
            Analysis records
          </Text>
          <Text
            style={[type.labelMd, { color: colors.onSurfaceVariant }]}
          >{`${filtered.length} ${PERIOD_COUNT[period]}`}</Text>
        </View>
      ) : null}
    </View>
  );

  const footer = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginTop: 20,
      }}
    >
      <Icon name="auto-awesome" size={16} color={colors.onSurfaceVariant} />
      <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
        Results are saved here automatically after each analysis.
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BrandHeader subtitle="History" hasAlert={openAlerts.length > 0} />
      <FlatList
        data={rest}
        renderItem={renderItem}
        keyExtractor={keyOf}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{
          paddingHorizontal: spacing.margin,
          paddingBottom: 130,
        }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        windowSize={7}
        removeClippedSubviews
      />
      {overlay}
    </View>
  );
}
