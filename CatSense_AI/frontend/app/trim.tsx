// SCREEN - Trim video: user keeps only the part of the video they want analysed.
import { useEffect, useRef, useState } from "react";
import { PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { setPendingUpload } from "@/services/pendingUpload";
import {
  colors,
  gradients,
  radius,
  shadows,
  spacing,
  type,
  withAlpha,
} from "@/theme";

const MIN_CLIP = 1; // seconds (same as the server)
const MAX_CLIP = 60; // seconds (same as max_clip_seconds on the server)
const HANDLE = 18;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);
const round1 = (v: number) => Math.round(v * 10) / 10;
const fmt = (s: number) => {
  const t = Math.max(0, s);
  const m = Math.floor(t / 60);
  const sec = Math.floor(t % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

export default function TrimScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    uri: string;
    name?: string;
    mime?: string;
    duration?: string;
  }>();

  const uri = String(params.uri ?? "");
  const fromPicker = Number(params.duration);
  const [duration, setDuration] = useState<number>(
    Number.isFinite(fromPicker) && fromPicker > 0 ? fromPicker : 0,
  );
  const [range, setRange] = useState({
    start: 0,
    end: Math.min(duration, MAX_CLIP),
  });
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);

  // latest values for the gesture handlers (they are created once)
  const rangeRef = useRef(range);
  rangeRef.current = range;
  const durationRef = useRef(duration);
  durationRef.current = duration;
  const trackW = useRef(0);
  const dragBase = useRef(0);

  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    p.timeUpdateEventInterval = 0.1;
  });

  // duration comes from the picker; if it was missing, read it from the video itself
  useEffect(() => {
    const subs = [
      player.addListener("sourceLoad", ({ duration: d }) => {
        if (durationRef.current <= 0 && d > 0) {
          setDuration(d);
          setRange({ start: 0, end: Math.min(d, MAX_CLIP) });
        }
      }),
      player.addListener("timeUpdate", ({ currentTime }) => {
        setPos(currentTime);
        const r = rangeRef.current;
        if (currentTime >= r.end) {
          player.pause();
          player.currentTime = r.start;
        }
      }),
      player.addListener("playingChange", ({ isPlaying }) =>
        setPlaying(isPlaying),
      ),
    ];
    return () => subs.forEach((s) => s.remove());
  }, [player]);

  useEffect(() => {
    if (duration > 0) setRange({ start: 0, end: Math.min(duration, MAX_CLIP) });
  }, [duration]);

  const makeResponder = (kind: "start" | "end") =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        player.pause();
        dragBase.current =
          kind === "start" ? rangeRef.current.start : rangeRef.current.end;
      },
      onPanResponderMove: (_, g) => {
        const w = trackW.current;
        const d = durationRef.current;
        if (!w || d <= 0) return;
        const delta = (g.dx / w) * d;
        const r = rangeRef.current;
        if (kind === "start") {
          const v = clamp(
            dragBase.current + delta,
            Math.max(0, r.end - MAX_CLIP),
            r.end - MIN_CLIP,
          );
          setRange({ start: v, end: r.end });
          player.currentTime = v;
        } else {
          const v = clamp(
            dragBase.current + delta,
            r.start + MIN_CLIP,
            Math.min(d, r.start + MAX_CLIP),
          );
          setRange({ start: r.start, end: v });
          player.currentTime = v;
        }
      },
      onPanResponderRelease: () => {
        player.currentTime = rangeRef.current.start;
      },
    });
  const startResponder = useRef(makeResponder("start")).current;
  const endResponder = useRef(makeResponder("end")).current;

  const togglePlay = () => {
    if (playing) {
      player.pause();
      return;
    }
    if (pos < range.start - 0.05 || pos >= range.end - 0.05)
      player.currentTime = range.start;
    player.play();
  };

  const reset = () => {
    player.pause();
    setRange({ start: 0, end: Math.min(duration, MAX_CLIP) });
    player.currentTime = 0;
  };

  const length = range.end - range.start;
  const tooShortVideo = duration > 0 && duration < MIN_CLIP;
  const isTrimmed = range.start > 0.05 || range.end < duration - 0.05;
  const leftPct = duration > 0 ? (range.start / duration) * 100 : 0;
  const rightPct = duration > 0 ? (range.end / duration) * 100 : 100;
  const playheadPct = duration > 0 ? clamp(pos / duration, 0, 1) * 100 : 0;

  const onContinue = () => {
    player.pause();
    setPendingUpload({
      uri,
      name: String(params.name ?? "video.mp4"),
      mimeType: String(params.mime ?? "video/mp4"),
      durationSec: duration,
      trimStart: isTrimmed ? round1(range.start) : null,
      trimEnd: isTrimmed ? round1(range.end) : null,
    });
    router.push("/processing");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityLabel="Back"
        >
          <Icon name="arrow-back" size={24} color={colors.onSurface} />
        </Pressable>
        <Text style={[type.headlineSm, { color: colors.onSurface }]}>
          Trim video
        </Text>
        <Pressable onPress={reset} hitSlop={12} accessibilityLabel="Reset trim">
          <Text style={[type.labelMd, { color: colors.primary }]}>Reset</Text>
        </Pressable>
      </View>

      {/* Preview */}
      <View style={styles.previewWrap}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="contain"
          nativeControls={false}
        />
        <Pressable
          onPress={togglePlay}
          style={styles.playBtn}
          accessibilityLabel={playing ? "Pause" : "Play"}
        >
          <Icon
            name={playing ? "pause" : "play-arrow"}
            size={32}
            color={colors.onPrimary}
          />
        </Pressable>
      </View>

      {/* Numbers */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={[type.labelSm, styles.statLabel]}>START</Text>
          <Text style={[type.headlineSm, styles.statValue]}>
            {fmt(range.start)}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[type.labelSm, styles.statLabel]}>LENGTH</Text>
          <Text style={[type.headlineSm, styles.statValue]}>
            {length.toFixed(1)} s
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[type.labelSm, styles.statLabel]}>END</Text>
          <Text style={[type.headlineSm, styles.statValue]}>
            {fmt(range.end)}
          </Text>
        </View>
      </View>

      {/* Trim bar */}
      <View
        style={styles.trackOuter}
        onLayout={(e) => {
          trackW.current = e.nativeEvent.layout.width;
        }}
      >
        <View style={styles.track} />
        {/* kept part */}
        <View
          pointerEvents="none"
          style={[
            styles.kept,
            {
              left: `${leftPct}%`,
              width: `${Math.max(rightPct - leftPct, 0)}%`,
            },
          ]}
        />
        {/* playhead */}
        <View
          pointerEvents="none"
          style={[styles.playhead, { left: `${playheadPct}%` }]}
        />
        {/* handles */}
        <View
          {...startResponder.panHandlers}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          style={[styles.handle, { left: `${leftPct}%` }]}
        />
        <View
          {...endResponder.panHandlers}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          style={[styles.handle, { left: `${rightPct}%` }]}
        />
      </View>

      <View style={styles.scaleRow}>
        <Text style={[type.labelSm, styles.statLabel]}>0:00</Text>
        <Text style={[type.labelSm, styles.statLabel]}>{fmt(duration)}</Text>
      </View>

      <Text style={[type.bodySm, styles.hint]}>
        {tooShortVideo
          ? "This video is too short. Please choose another one."
          : duration > MAX_CLIP
            ? `Drag the yellow handles. You can keep up to ${MAX_CLIP} seconds.`
            : "Drag the yellow handles to keep only the part you want analysed."}
      </Text>

      {/* Actions */}
      <View
        style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}
      >
        <Button
          label={isTrimmed ? "Continue with trimmed clip" : "Continue"}
          icon="check"
          iconPosition="left"
          onPress={onContinue}
          gradient={gradients.ctaFade}
          paddingVertical={15}
          shadow={shadows.cta}
          disabled={duration <= 0 || tooShortVideo}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.margin,
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  previewWrap: {
    height: 300,
    borderRadius: radius.base,
    overflow: "hidden",
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: "center",
    justifyContent: "center",
  },
  video: { width: "100%", height: "100%" },
  playBtn: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.primary, 0.9),
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: { flexDirection: "row", gap: spacing.sm },
  stat: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: radius.base,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
  },
  statLabel: { color: colors.onSurfaceVariant },
  statValue: { color: colors.onSurface },
  trackOuter: {
    height: 52,
    marginHorizontal: HANDLE,
    justifyContent: "center",
  },
  track: {
    height: 40,
    borderRadius: radius.base,
    backgroundColor: colors.surfaceContainerHighest,
  },
  kept: {
    position: "absolute",
    top: 6,
    height: 40,
    backgroundColor: withAlpha(colors.primary, 0.35),
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.primary,
  },
  playhead: {
    position: "absolute",
    top: 4,
    width: 2,
    height: 44,
    backgroundColor: colors.onSurface,
  },
  handle: {
    position: "absolute",
    top: 2,
    width: HANDLE,
    height: 48,
    marginLeft: -HANDLE / 2,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  scaleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: HANDLE,
    marginTop: -spacing.sm,
  },
  hint: { color: colors.onSurfaceVariant, textAlign: "center" },
  footer: { marginTop: "auto" },
});
