// SCREEN 12 - Sound Mood Acoustic Analysis (prototype: 12_catsense_ai._sound_mood)
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressScale } from "@/components/animations/PressScale";
import { Pulse } from "@/components/animations/Pulse";
import { Icon, IconName } from "@/components/ui/Icon";
import { images } from "@/constants/images";
import {
  deleteAnalysisResult,
  fetchSoundMoodDetails,
} from "@/services/analysis";
import { alertActions } from "@/store/alertStore";
import { catActions, useActiveCat } from "@/store/catStore";
import { historyActions } from "@/store/historyStore";
import { SoundMoodDetails } from "@/types";
import {
  colors,
  letterSpacing,
  radius,
  shadows,
  spacing,
  tracking,
  type,
  withAlpha,
} from "@/theme";

export default function SoundMoodScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const [data, setData] = useState<SoundMoodDetails | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [failed, setFailed] = useState(false);
  const cat = useActiveCat();

  useEffect(() => {
    fetchSoundMoodDetails(id || "084")
      .then((res) => setData(res))
      .catch(() => setFailed(true));
  }, [id]);

  if (!data) {
    return (
      <View style={[styles.container, styles.loadingCenter]}>
        {failed ? (
          <Pressable onPress={() => router.back()}>
            <Text style={[type.labelLg, { color: colors.error }]}>
              Could not load the sound result. Tap to go back.
            </Text>
          </Pressable>
        ) : (
          <Pulse>
            <Text style={[type.labelLg, { color: colors.primary }]}>
              Loading acoustic mood data...
            </Text>
          </Pulse>
        )}
      </View>
    );
  }

  const onConfirmDelete = async () => {
    await deleteAnalysisResult(data.clipId);
    // refresh the lists from the backend; demo mode: nothing happens
    if (cat) {
      await Promise.all([
        historyActions.hydrate(cat.id),
        catActions.hydrate(),
        alertActions.hydrate(cat.id),
      ]);
    }
    setShowDeleteModal(false);
    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerLeft}>
          <PressScale
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Back"
            style={styles.headerIconBtn}
          >
            <Icon name="arrow-back" size={22} color={colors.onSurface} />
          </PressScale>
          <Image
            source={images.logoSmall}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={[type.headlineMd, styles.headerTitle]}>Results</Text>
        </View>

        <View style={styles.headerRight}>
          <PressScale
            accessibilityRole="button"
            accessibilityLabel="Share"
            style={styles.headerIconBtn}
          >
            <Icon name="share" size={20} color={colors.onSurface} />
          </PressScale>
          <LinearGradient
            colors={[colors.primaryContainer, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarBorder}
          >
            <Image source={images.userProfile} style={styles.avatar} />
          </LinearGradient>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Sub-header Meta Bar */}
        <View style={styles.subHeaderBar}>
          <View style={styles.clipIdentityGroup}>
            <Icon name="graphic-eq" size={18} color={colors.secondary} />
            <Text style={[type.headlineSm, { color: colors.onSurface }]}>
              {data.catName} • Clip #{data.clipId.slice(0, 4)}
            </Text>
          </View>
          <View style={styles.acousticModelPill}>
            <View style={styles.pulseDot} />
            <Text style={[type.labelSm, styles.acousticModelText]}>
              {data.acousticModel}
            </Text>
          </View>
        </View>

        {/* Hero Card: Mint Tones / Top Match */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlowMint} />
          <View style={styles.heroGlowAmber} />

          <View style={styles.heroMainRow}>
            <View style={styles.heroInfoCol}>
              <View style={styles.matchBadge}>
                <Icon name="pets" size={14} color={colors.secondary} />
                <Text style={[type.labelSm, styles.matchBadgeText]}>
                  Acoustic Match
                </Text>
              </View>

              <Text style={[type.headlineXlMobile, styles.heroMoodTitle]}>
                {data.match.mood}, {data.match.percentage}%
              </Text>

              <Text
                numberOfLines={2}
                style={[type.bodyMd, { color: colors.onSurfaceVariant }]}
              >
                {data.match.description}
              </Text>
            </View>

            {/* Tactile 3D Mascot Thumbnail */}
            <View style={styles.mascotThumbWrapper}>
              <LinearGradient
                colors={["transparent", withAlpha(colors.secondary, 0.2)]}
                style={StyleSheet.absoluteFillObject}
              />
              <Image
                source={images.mascotSoundHappy}
                style={styles.mascotImg}
                resizeMode="cover"
              />
              <View style={styles.mascotHeartBadge}>
                <Icon name="favorite" size={14} color={colors.onSecondary} />
              </View>
            </View>
          </View>

          {/* Tags Row of Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {data.chips.map((chip, idx) => {
              const isFirst = idx === 0;

              return (
                <View
                  key={idx}
                  style={[
                    styles.chipItem,
                    isFirst ? styles.chipItemActive : styles.chipItemNeutral,
                  ]}
                >
                  <View
                    style={[styles.chipDot, { backgroundColor: chip.color }]}
                  />
                  <Text
                    style={[
                      type.labelMd,
                      {
                        color: isFirst
                          ? colors.secondaryFixed
                          : chip.label === "Hungry"
                            ? colors.primary
                            : colors.tertiaryFixed,
                        fontWeight: isFirst ? "700" : "500",
                      },
                    ]}
                  >
                    {chip.label} ({chip.percentage}%)
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Waveform Card: Sound Timeline */}
        <View style={styles.waveformCard}>
          <View style={styles.waveformHeader}>
            <View style={styles.waveformHeaderLeft}>
              <View style={styles.wavesIconBox}>
                <Icon name="waves" size={18} color={colors.primaryContainer} />
              </View>
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                Sound Timeline
              </Text>
            </View>
            <Text style={[type.labelSm, styles.waveformTimecode]}>
              {data.soundTimeline.timecode}
            </Text>
          </View>

          {/* Peak Acoustic Annotation Callout */}
          <View style={styles.peakCalloutRow}>
            <View style={styles.peakCalloutBadge}>
              <Icon name="graphic-eq" size={14} color={colors.primary} />
              <Text style={[type.labelSm, styles.peakCalloutText]}>
                {data.soundTimeline.peakCallout}
              </Text>
            </View>
          </View>

          {/* Spectrogram / Glowing Waveform Interactive Mock */}
          <Pressable
            onPress={() => setIsPlaying(!isPlaying)}
            style={styles.waveformStage}
          >
            {/* Center Peak Ambient Glow */}
            <View style={styles.stagePeakGlow} />

            {/* Audio Spectrogram Bars */}
            <View style={styles.spectrogramBarsContainer}>
              {data.soundTimeline.waveformBars.map((bar, bIdx) => (
                <View
                  key={bIdx}
                  style={[
                    styles.audioBar,
                    {
                      height: isPlaying
                        ? Math.min(bar.height * 1.15, 76)
                        : bar.height,
                      backgroundColor: bar.color,
                    },
                    bar.isPeak && styles.peakBarGlow,
                  ]}
                />
              ))}
            </View>

            {/* Yellow Playhead Cursor at Peak */}
            <View style={styles.playheadCursor}>
              <View style={styles.playheadThumb} />
            </View>
          </Pressable>

          {/* Playback Control Row */}
          <View style={styles.playbackControlRow}>
            <View style={styles.playbackLeft}>
              <PressScale
                onPress={() => setIsPlaying(!isPlaying)}
                accessibilityRole="button"
                accessibilityLabel="Play acoustic clip"
                style={styles.playButton}
              >
                <Icon
                  name={isPlaying ? "pause" : "play-arrow"}
                  size={20}
                  color={colors.onPrimaryContainer}
                />
              </PressScale>
              <Text style={[type.labelMd, { color: colors.onSurface }]}>
                {data.soundTimeline.sequenceName}
              </Text>
            </View>

            <View style={styles.speedIndicator}>
              <Icon name="speed" size={16} color={colors.onSurfaceVariant} />
              <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
                {data.soundTimeline.speed}
              </Text>
            </View>
          </View>
        </View>

        {/* Mood Breakdown Card (Top 6 of 10 Moods) */}
        <View style={styles.moodBreakdownCard}>
          <View style={styles.breakdownHeader}>
            <View style={styles.breakdownHeaderTitleGroup}>
              <View style={styles.barChartIconBox}>
                <Icon name="bar-chart" size={18} color={colors.tertiary} />
              </View>
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                Mood Breakdown
              </Text>
            </View>
            <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
              Top 6 of 10
            </Text>
          </View>

          {/* 6 Mood Rows */}
          <View style={styles.moodsList}>
            {data.moodBreakdown.map((item, index) => {
              const isTop = item.percentage >= 80;
              const isZero = item.percentage === 0;

              return (
                <View key={index} style={styles.moodRow}>
                  <View style={styles.moodLabelRow}>
                    <View style={styles.moodNameGroup}>
                      <Icon
                        name={(item.icon as IconName) || "pets"}
                        size={16}
                        color={
                          isTop
                            ? colors.secondary
                            : item.name.includes("Resting")
                              ? colors.tertiaryContainer
                              : item.name.includes("Hungry")
                                ? colors.primary
                                : isZero
                                  ? withAlpha(colors.error, 0.6)
                                  : colors.outline
                        }
                      />
                      <Text
                        style={[
                          type.labelMd,
                          {
                            color: isZero
                              ? colors.onSurfaceVariant
                              : colors.onSurface,
                          },
                        ]}
                      >
                        {item.name}
                      </Text>
                    </View>
                    <Text
                      style={[
                        type.labelMd,
                        {
                          color: isTop
                            ? colors.secondary
                            : item.name.includes("Resting")
                              ? colors.tertiaryFixed
                              : item.name.includes("Hungry")
                                ? colors.primary
                                : colors.onSurfaceVariant,
                          fontWeight: item.percentage > 0 ? "700" : "400",
                        },
                      ]}
                    >
                      {item.percentage}%
                    </Text>
                  </View>

                  <View style={styles.moodTrack}>
                    <View
                      style={[
                        styles.moodFill,
                        {
                          width: `${Math.max(item.percentage, 0)}%`,
                          backgroundColor: item.color,
                        },
                        isTop && styles.moodTopGlow,
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* What This Means Card */}
        <View style={styles.whatThisMeansCard}>
          <View style={styles.lightbulbBox}>
            <Icon name="lightbulb" size={22} color={colors.secondary} />
          </View>
          <View style={styles.whatThisMeansContent}>
            <Text
              style={[
                type.headlineSm,
                { color: colors.onSurface, marginBottom: 4 },
              ]}
            >
              What this means
            </Text>
            <Text style={[type.bodyMd, styles.whatThisMeansText]}>
              {data.explanation}
            </Text>
          </View>
        </View>

        {/* Supporting Notes & AI Diagnostic Footnote */}
        <View style={styles.notesContainer}>
          <View style={styles.noteLine}>
            <Icon name="info" size={16} color={colors.outline} />
            <Text
              style={[type.bodySm, { color: colors.onSurfaceVariant, flex: 1 }]}
            >
              If no usable cat sound is heard, we show 'No usable sound' instead
              of guessing.
            </Text>
          </View>
          <View style={styles.noteLine}>
            <Icon name="verified-user" size={16} color={colors.primary} />
            <Text
              style={[
                type.labelSm,
                {
                  color: colors.onSurfaceVariant,
                  fontStyle: "italic",
                  flex: 1,
                },
              ]}
            >
              An indication, not a medical diagnosis.
            </Text>
          </View>
        </View>

        {/* Action CTAs */}
        <View style={styles.actionsContainer}>
          {/* Primary CTA 3D Pill: Re-listen Sound Clip */}
          <PressScale
            onPress={() => setIsPlaying(true)}
            accessibilityRole="button"
            accessibilityLabel="Re-listen Sound Clip"
          >
            <LinearGradient
              colors={[
                colors.primaryFixedDim,
                colors.primaryContainer,
                colors.surfaceTint,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryCta}
            >
              <Icon name="replay" size={20} color={colors.onPrimaryContainer} />
              <Text style={[type.labelLg, styles.primaryCtaText]}>
                Re-listen Sound Clip
              </Text>
            </LinearGradient>
          </PressScale>

          {/* Secondary Coral Action: Remove from history */}
          <PressScale
            onPress={() => setShowDeleteModal(true)}
            accessibilityRole="button"
            accessibilityLabel="Remove from history"
            style={styles.secondaryCta}
          >
            <Icon name="delete-outline" size={18} color={colors.error} />
            <Text
              style={[type.labelLg, { color: colors.error, fontWeight: "700" }]}
            >
              Remove from history
            </Text>
          </PressScale>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal (Bottom Sheet Style) */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={styles.modalWarningIconBox}>
                <Icon name="delete" size={24} color={colors.error} />
              </View>
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                Remove sound clip?
              </Text>
              <Text style={[type.bodyMd, styles.modalDescription]}>
                This clip #{data.clipId.slice(0, 4)} will be removed from{" "}
                {data.catName}'s acoustic history. This action cannot be undone.
              </Text>
            </View>

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setShowDeleteModal(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={[type.labelLg, { color: colors.onSurface }]}>
                  Keep Clip
                </Text>
              </Pressable>

              <Pressable
                onPress={onConfirmDelete}
                style={styles.modalDeleteBtn}
              >
                <Text
                  style={[
                    type.labelLg,
                    { color: colors.onError, fontWeight: "700" },
                  ]}
                >
                  Yes, Remove
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  loadingCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.sm,
    backgroundColor: withAlpha(colors.surface, 0.9),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: withAlpha(colors.surfaceContainerLowest, 0.5),
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainer, 0.7),
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogo: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    color: colors.onSurface,
    fontWeight: "700",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatarBorder: {
    padding: 2,
    borderRadius: radius.full,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
  },
  scrollContent: {
    paddingHorizontal: spacing.margin,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  subHeaderBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  clipIdentityGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  acousticModelPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
  },
  acousticModelText: {
    color: colors.secondaryFixed,
    textTransform: "uppercase",
    letterSpacing: letterSpacing(10, tracking.wider),
  },
  heroCard: {
    borderRadius: radius.default,
    backgroundColor: colors.surfaceContainer,
    padding: spacing.lg,
    position: "relative",
    overflow: "hidden",
    boxShadow: shadows.elevationHigh,
  },
  heroGlowMint: {
    position: "absolute",
    right: -32,
    top: -32,
    width: 160,
    height: 160,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.secondaryContainer, 0.2),
  },
  heroGlowAmber: {
    position: "absolute",
    left: -40,
    bottom: -40,
    width: 140,
    height: 140,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.primaryContainer, 0.1),
  },
  heroMainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  heroInfoCol: {
    flex: 1,
  },
  matchBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.secondary, 0.15),
    marginBottom: 8,
  },
  matchBadgeText: {
    color: colors.secondary,
    textTransform: "uppercase",
    letterSpacing: letterSpacing(10, tracking.wider),
    fontWeight: "700",
  },
  heroMoodTitle: {
    color: colors.secondary,
    fontWeight: "800",
    marginBottom: 4,
  },
  mascotThumbWrapper: {
    width: 96,
    height: 96,
    borderRadius: radius.default,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.7),
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    boxShadow: shadows.elevationLow,
  },
  mascotImg: {
    width: "100%",
    height: "100%",
    borderRadius: radius.default,
  },
  mascotHeartBadge: {
    position: "absolute",
    right: -6,
    bottom: -6,
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadows.glowMint,
  },
  chipsRow: {
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
  },
  chipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  chipItemActive: {
    backgroundColor: withAlpha(colors.secondary, 0.2),
    boxShadow: shadows.elevationLow,
  },
  chipItemNeutral: {
    backgroundColor: colors.surfaceContainerHighest,
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  waveformCard: {
    borderRadius: radius.default,
    backgroundColor: colors.surfaceContainer,
    padding: spacing.md,
    gap: spacing.sm,
    boxShadow: shadows.elevationHigh,
  },
  waveformHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  waveformHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  wavesIconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  waveformTimecode: {
    color: colors.onSurfaceVariant,
    fontFamily: "monospace",
  },
  peakCalloutRow: {
    paddingTop: 8,
  },
  peakCalloutBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.primaryContainer, 0.2),
  },
  peakCalloutText: {
    color: colors.primary,
    fontWeight: "600",
  },
  waveformStage: {
    height: 96,
    width: "100%",
    borderRadius: radius.default,
    backgroundColor: colors.surfaceContainerLowest,
    padding: 8,
    position: "relative",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  stagePeakGlow: {
    position: "absolute",
    left: "35%",
    bottom: 0,
    width: 120,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.primaryContainer, 0.2),
  },
  spectrogramBarsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
    gap: 3,
  },
  audioBar: {
    flex: 1,
    minWidth: 4,
    borderRadius: radius.full,
  },
  peakBarGlow: {
    boxShadow: shadows.glowAmber,
  },
  playheadCursor: {
    position: "absolute",
    left: "54%",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.primaryFixed,
    alignItems: "center",
    boxShadow: shadows.glowAmber,
  },
  playheadThumb: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    marginTop: -4,
  },
  playbackControlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  playbackLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadows.glowAmber,
  },
  speedIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  moodBreakdownCard: {
    borderRadius: radius.default,
    backgroundColor: colors.surfaceContainer,
    padding: spacing.lg,
    gap: spacing.md,
    boxShadow: shadows.elevationHigh,
  },
  breakdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  breakdownHeaderTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  barChartIconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  moodsList: {
    gap: spacing.sm,
  },
  moodRow: {
    gap: 4,
  },
  moodLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  moodNameGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  moodTrack: {
    height: 10,
    width: "100%",
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLowest,
    overflow: "hidden",
    padding: 2,
  },
  moodFill: {
    height: "100%",
    borderRadius: radius.full,
  },
  moodTopGlow: {
    boxShadow: shadows.glowMint,
  },
  whatThisMeansCard: {
    borderRadius: radius.default,
    backgroundColor: colors.surfaceContainerHigh,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    boxShadow: shadows.elevationLow,
  },
  lightbulbBox: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.secondaryContainer, 0.2),
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  whatThisMeansContent: {
    flex: 1,
  },
  whatThisMeansText: {
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  notesContainer: {
    borderRadius: radius.default,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.6),
    padding: spacing.md,
    gap: spacing.sm,
  },
  noteLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  actionsContainer: {
    gap: spacing.sm,
    paddingTop: 8,
  },
  primaryCta: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radius.full,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    boxShadow: shadows.glowAmber,
  },
  primaryCtaText: {
    color: colors.onPrimaryContainer,
    fontWeight: "700",
  },
  secondaryCta: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.errorContainer, 0.25),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(13, 7, 47, 0.75)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: colors.surfaceContainer,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  modalHeader: {
    alignItems: "center",
    gap: spacing.sm,
  },
  modalWarningIconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.error, 0.2),
    alignItems: "center",
    justifyContent: "center",
  },
  modalDescription: {
    color: colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  modalDeleteBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.full,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
});
