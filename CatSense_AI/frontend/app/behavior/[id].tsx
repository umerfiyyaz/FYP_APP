// SCREEN 11 - Behavior Timeline Analysis (prototype: 11_catsense_ai._behavior_timeline)
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
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
import { fetchBehaviorTimeline } from "@/services/analysis";
import { BehaviorTimelineData } from "@/types";
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

export default function BehaviorTimelineScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const [data, setData] = useState<BehaviorTimelineData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedEpochId, setSelectedEpochId] = useState<string>("ep_2");

  useEffect(() => {
    fetchBehaviorTimeline(id || "1409").then((res) => {
      setData(res);
      if (res.focusedEpochId) {
        setSelectedEpochId(res.focusedEpochId);
      }
    });
  }, [id]);

  if (!data) {
    return (
      <View style={[styles.container, styles.loadingCenter]}>
        <Pulse>
          <Text style={[type.labelLg, { color: colors.primary }]}>
            Loading behavioral timeline...
          </Text>
        </Pulse>
      </View>
    );
  }

  const selectedEpoch =
    data.epochs.find((ep) => ep.id === selectedEpochId) || data.epochs[1];

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
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Session Header Strip */}
        <View style={styles.sessionStrip}>
          <View style={styles.sessionLeft}>
            <View style={styles.liveGreenDot} />
            <View style={styles.sessionInfoCol}>
              <Text style={[type.headlineSm, styles.sessionTitle]}>
                {data.catName} • {data.timestamp}
              </Text>
              <Text style={[type.labelMd, styles.sessionSubtitle]}>
                Session #{data.sessionId} • AI Behavioral Scan
              </Text>
            </View>
          </View>

          <View style={styles.clipBadge}>
            <Icon name="videocam" size={14} color={colors.primary} />
            <Text style={[type.labelMd, { color: colors.primary }]}>
              {data.clipDurationSeconds}s Clip
            </Text>
          </View>
        </View>

        {/* Video Player Preview Container */}
        <View style={styles.videoCard}>
          <ImageBackground
            source={images.videoStillGrooming}
            style={styles.videoFrame}
            imageStyle={{ borderRadius: radius.default }}
          >
            <LinearGradient
              colors={[
                "transparent",
                withAlpha(colors.surfaceContainerLowest, 0.4),
                colors.surfaceContainerLowest,
              ]}
              locations={[0, 0.6, 1]}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Live AI Detection Bounding Box Marker */}
            <View style={styles.detectionBox}>
              <View style={styles.detectionBadge}>
                <Icon
                  name="pets"
                  size={11}
                  color={colors.onPrimaryContainer}
                />
                <Text
                  style={[
                    type.labelSm,
                    { color: colors.onPrimaryContainer, fontWeight: "700" },
                  ]}
                >
                  {data.catName} • 88% Grooming
                </Text>
              </View>
            </View>

            {/* Play / Pause Interaction Badge */}
            <PressScale
              onPress={() => setIsPlaying(!isPlaying)}
              accessibilityRole="button"
              accessibilityLabel="Toggle video playback"
              style={styles.playButton}
            >
              <Icon
                name={isPlaying ? "pause" : "play-arrow"}
                size={30}
                color={colors.onPrimaryContainer}
              />
            </PressScale>

            {/* Video Meta Badges */}
            <View style={styles.hdBadge}>
              <View style={styles.redDot} />
              <Text style={[type.labelSm, { color: colors.onSurface }]}>
                HD 1080p
              </Text>
            </View>

            <View style={styles.poseTrackBadge}>
              <Icon name="adjust" size={13} color={colors.secondary} />
              <Text style={[type.labelSm, { color: colors.onSurface }]}>
                PoseTrack v4.2
              </Text>
            </View>
          </ImageBackground>

          {/* Scrubber & Current Timestamp Control Panel */}
          <View style={styles.scrubberPanel}>
            <View style={styles.timecodeRow}>
              <View style={styles.timerGroup}>
                <Icon name="timer" size={14} color={colors.primary} />
                <Text style={[type.labelMd, styles.timecodeNow]}>
                  {data.currentTimecode}
                </Text>
                <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
                  / 01:00
                </Text>
              </View>
              <Text style={[type.labelSm, styles.epochLabel]}>
                {data.activeEpochRange}
              </Text>
            </View>

            {/* Scrubber Track */}
            <View style={styles.scrubberTrack}>
              <View style={styles.scrubberBg}>
                <View style={[styles.scrubberFill, { width: "53.3%" }]} />
              </View>
              {/* Scrubber Thumb */}
              <View style={[styles.scrubberThumb, { left: "53.3%" }]}>
                <View style={styles.thumbDot} />
              </View>
            </View>
          </View>
        </View>

        {/* Color-Coded Multi-Segment Behavioral Timeline */}
        <View style={styles.timelineCard}>
          <View style={styles.timelineHeader}>
            <Text style={[type.labelMd, styles.timelineHeaderTitle]}>
              Acoustic & Vision Timeline
            </Text>
            <View style={styles.syncedBadge}>
              <Icon name="auto-awesome" size={12} color={colors.secondary} />
              <Text style={[type.labelSm, { color: colors.secondary }]}>
                Synced
              </Text>
            </View>
          </View>

          {/* Multi-segment Strip with Proportional Widths */}
          <View style={styles.multiSegmentStrip}>
            {data.timelineSegments.map((segment, index) => {
              const isFirst = index === 0;
              const isLast = index === data.timelineSegments.length - 1;
              const isActive = segment.label === "Grooming";

              return (
                <View
                  key={index}
                  style={[
                    styles.segmentBar,
                    {
                      width: `${segment.percentage}%`,
                      backgroundColor: segment.color,
                      borderTopLeftRadius: isFirst ? radius.full : 0,
                      borderBottomLeftRadius: isFirst ? radius.full : 0,
                      borderTopRightRadius: isLast ? radius.full : 0,
                      borderBottomRightRadius: isLast ? radius.full : 0,
                    },
                    isActive && styles.activeGroomingSegment,
                  ]}
                >
                  {isActive && (
                    <Pulse>
                      <View style={styles.activeSegmentOverlay} />
                    </Pulse>
                  )}
                </View>
              );
            })}
          </View>

          {/* Timeline Legend */}
          <View style={styles.legendRow}>
            {data.timelineSegments.map((segment, index) => {
              const isGrooming = segment.label === "Grooming";
              return (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: segment.color },
                    ]}
                  />
                  <Text
                    numberOfLines={1}
                    style={[
                      type.labelSm,
                      styles.legendText,
                      isGrooming && styles.legendTextActive,
                    ]}
                  >
                    {segment.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Selectable Epochs / Windows List */}
        <View style={styles.epochsSection}>
          <View style={styles.epochsSectionHeader}>
            <Text style={[type.labelLg, { color: colors.onSurface }]}>
              Timeline Windows (Epochs)
            </Text>
            <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
              Tap segment to inspect
            </Text>
          </View>

          <View style={styles.epochsList}>
            {data.epochs.map((epoch) => {
              const isSelected = epoch.id === selectedEpochId;

              return (
                <Pressable
                  key={epoch.id}
                  onPress={() => setSelectedEpochId(epoch.id)}
                  style={[
                    styles.epochItem,
                    isSelected ? styles.epochItemActive : styles.epochItemInactive,
                  ]}
                >
                  <View style={styles.epochLeft}>
                    <View
                      style={[
                        styles.epochDot,
                        { backgroundColor: epoch.color },
                        isSelected && styles.epochDotActiveGlow,
                      ]}
                    />
                    <View style={styles.epochTextCol}>
                      <View style={styles.epochTitleRow}>
                        <Text
                          numberOfLines={1}
                          style={[
                            type.bodyMd,
                            styles.epochTitle,
                            isSelected && {
                              color: colors.primary,
                              fontWeight: "700",
                            },
                          ]}
                        >
                          {epoch.timeRange} • {epoch.behavior} (
                          {epoch.confidenceLevel === "Absent"
                            ? "Absent"
                            : `${epoch.confidence}%`}
                          )
                        </Text>
                        {isSelected && (
                          <View style={styles.activePill}>
                            <Text
                              style={[
                                type.labelSm,
                                { color: colors.primary, fontWeight: "700" },
                              ]}
                            >
                              Active
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        numberOfLines={1}
                        style={[type.labelSm, { color: colors.onSurfaceVariant }]}
                      >
                        {epoch.description}
                      </Text>
                    </View>
                  </View>

                  {isSelected ? (
                    <Icon
                      name="check-circle"
                      size={20}
                      color={colors.primary}
                    />
                  ) : (
                    <Icon
                      name="chevron-right"
                      size={18}
                      color={colors.onSurfaceVariant}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Selected Segment Detail Card */}
        <View style={styles.detailCard}>
          <View style={styles.detailGlowBlob} />
          <View style={styles.detailContent}>
            <View style={styles.detailMainRow}>
              <View style={styles.detailLeft}>
                <View
                  style={[
                    styles.detailIconBox,
                    {
                      backgroundColor:
                        selectedEpoch.color === colors.surfaceContainerLowest
                          ? colors.surfaceContainerHighest
                          : selectedEpoch.color,
                    },
                  ]}
                >
                  <Icon
                    name={(selectedEpoch.icon as IconName) || "clean-hands"}
                    size={26}
                    color={
                      selectedEpoch.id === "ep_2"
                        ? colors.onPrimaryContainer
                        : colors.onSurface
                    }
                  />
                </View>
                <View>
                  <Text style={[type.labelSm, styles.detailCategory]}>
                    Focused Behavior
                  </Text>
                  <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                    {selectedEpoch.behavior}
                  </Text>
                  <Text style={[type.labelMd, { color: colors.onSurfaceVariant }]}>
                    Duration: {selectedEpoch.durationText}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRight}>
                <View style={styles.confidenceBadge}>
                  <Icon name="verified" size={13} color={colors.onSecondaryContainer} />
                  <Text
                    style={[
                      type.labelMd,
                      { color: colors.onSecondaryContainer, fontWeight: "700" },
                    ]}
                  >
                    Confidence {selectedEpoch.confidence}%{" "}
                    {selectedEpoch.confidenceLevel}
                  </Text>
                </View>
                <Text style={[type.labelSm, styles.agreementText]}>
                  {selectedEpoch.modelAgreement}
                </Text>
              </View>
            </View>

            {/* Contextual Tag Cloud */}
            <View style={styles.tagCloud}>
              {selectedEpoch.tags.map((tag, idx) => (
                <View key={idx} style={styles.tagItem}>
                  <Icon
                    name={
                      idx === 0
                        ? "spa"
                        : idx === 1
                        ? "favorite"
                        : "graphic-eq"
                    }
                    size={12}
                    color={
                      idx === 0
                        ? colors.primary
                        : idx === 1
                        ? colors.secondary
                        : colors.tertiary
                    }
                  />
                  <Text style={[type.labelSm, { color: colors.onSurface }]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Time Breakdown Card */}
        <View style={styles.timeBreakdownCard}>
          <View style={styles.timeBreakdownHeader}>
            <View style={styles.breakdownHeaderLeft}>
              <Icon name="pie-chart" size={20} color={colors.primary} />
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                Time breakdown
              </Text>
            </View>
            <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
              Valid track: {data.totalValidSeconds}s total
            </Text>
          </View>

          {/* Progress Bars List: Grooming, Resting, Moving, Standing, Eating */}
          <View style={styles.progressBarsList}>
            {data.timeBreakdown.map((item, index) => {
              const isZero = item.seconds === 0;

              return (
                <View
                  key={index}
                  style={[styles.breakdownRow, isZero && { opacity: 0.6 }]}
                >
                  <View style={styles.breakdownLabelRow}>
                    <View style={styles.breakdownNameGroup}>
                      <View
                        style={[
                          styles.breakdownDot,
                          { backgroundColor: item.color },
                        ]}
                      />
                      <Text style={[type.labelMd, { color: colors.onSurface }]}>
                        {item.name}
                      </Text>
                    </View>
                    <Text
                      style={[
                        type.labelMd,
                        {
                          color:
                            item.name === "Grooming"
                              ? colors.primary
                              : item.name === "Resting"
                              ? colors.tertiary
                              : item.name === "Moving"
                              ? colors.secondary
                              : colors.onSurfaceVariant,
                          fontWeight: item.seconds > 0 ? "700" : "400",
                        },
                      ]}
                    >
                      {item.seconds}s ({item.percentage}%)
                    </Text>
                  </View>

                  <View style={styles.breakdownTrack}>
                    <View
                      style={[
                        styles.breakdownFill,
                        {
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Note Card */}
        <View style={styles.noteCard}>
          <Icon name="info" size={20} color={colors.tertiary} />
          <Text style={[type.bodySm, styles.noteText]}>
            <Text style={{ fontWeight: "700", color: colors.onSurface }}>
              Note:{" "}
            </Text>
            'No cat' windows are excluded from calculated behavior percentages.
          </Text>
        </View>

        {/* Medical / Veterinary Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Icon name="health-and-safety" size={14} color={colors.secondary} />
          <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
            An indication, not a medical diagnosis.
          </Text>
        </View>
      </ScrollView>

      {/* Floating Ergonomic Bottom Dock Navigation (Timeline Tab Active) */}
      <View
        style={[
          styles.floatingDockWrap,
          { bottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <View style={styles.floatingDock}>
          {/* Live View */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Live view"
            onPress={() => router.push("/camera")}
            style={styles.dockItem}
          >
            <Icon name="videocam" size={22} color={colors.onSurfaceVariant} />
            <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
              Live
            </Text>
          </Pressable>

          {/* Timeline (ACTIVE) */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Timeline Behavior Analysis"
            style={styles.dockItemActive}
          >
            <Icon
              name="analytics"
              size={20}
              color={colors.onPrimaryContainer}
            />
            <Text
              style={[
                type.labelMd,
                { color: colors.onPrimaryContainer, fontWeight: "700" },
              ]}
            >
              Timeline
            </Text>
          </Pressable>

          {/* Insights Log */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Insights"
            onPress={() => router.push("/(tabs)/home")}
            style={styles.dockItem}
          >
            <Icon name="insights" size={22} color={colors.onSurfaceVariant} />
            <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
              Insights
            </Text>
          </Pressable>

          {/* Milo Profile */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Pet Profile"
            onPress={() => router.push("/(tabs)/profile")}
            style={styles.dockItem}
          >
            <Icon name="pets" size={22} color={colors.onSurfaceVariant} />
            <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
              {data.catName}
            </Text>
          </Pressable>
        </View>
      </View>
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
    gap: spacing.lg,
  },
  sessionStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  sessionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  liveGreenDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
    boxShadow: shadows.glowMint,
  },
  sessionInfoCol: {
    flex: 1,
  },
  sessionTitle: {
    color: colors.onSurface,
    fontWeight: "600",
  },
  sessionSubtitle: {
    color: colors.onSurfaceVariant,
  },
  clipBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
  },
  videoCard: {
    borderRadius: radius.default,
    backgroundColor: colors.surfaceContainerLowest,
    overflow: "hidden",
    boxShadow: shadows.elevationHigh,
  },
  videoFrame: {
    width: "100%",
    aspectRatio: 16 / 9,
    justifyContent: "center",
    alignItems: "center",
  },
  detectionBox: {
    position: "absolute",
    top: "25%",
    left: "30%",
    width: 140,
    height: 100,
    borderWidth: 1.5,
    borderColor: withAlpha(colors.primaryContainer, 0.8),
    borderRadius: radius.default,
  },
  detectionBadge: {
    position: "absolute",
    top: -12,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.primaryContainer, 0.9),
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadows.glowAmber,
  },
  hdBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.7),
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.error,
  },
  poseTrackBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.7),
  },
  scrubberPanel: {
    padding: spacing.md,
    backgroundColor: colors.surfaceContainerLow,
    gap: spacing.sm,
  },
  timecodeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timerGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timecodeNow: {
    color: colors.onSurface,
    fontWeight: "700",
  },
  epochLabel: {
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: letterSpacing(10, tracking.wider),
  },
  scrubberTrack: {
    height: 16,
    justifyContent: "center",
    position: "relative",
  },
  scrubberBg: {
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
    overflow: "hidden",
  },
  scrubberFill: {
    height: "100%",
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.full,
  },
  scrubberThumb: {
    position: "absolute",
    marginLeft: -8,
    width: 16,
    height: 16,
    borderRadius: radius.full,
    backgroundColor: colors.primaryFixed,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadows.glowAmber,
  },
  thumbDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.onPrimaryContainer,
  },
  timelineCard: {
    padding: spacing.md,
    borderRadius: radius.default,
    backgroundColor: colors.surfaceContainer,
    gap: spacing.sm,
    boxShadow: shadows.elevationLow,
  },
  timelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timelineHeaderTitle: {
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: letterSpacing(12, tracking.wider),
  },
  syncedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  multiSegmentStrip: {
    height: 20,
    width: "100%",
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLowest,
    flexDirection: "row",
    overflow: "hidden",
    padding: 2,
    gap: 2,
  },
  segmentBar: {
    height: "100%",
    position: "relative",
  },
  activeGroomingSegment: {
    boxShadow: shadows.glowAmber,
  },
  activeSegmentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    justifyContent: "center",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  legendText: {
    color: colors.onSurfaceVariant,
  },
  legendTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  epochsSection: {
    gap: spacing.sm,
  },
  epochsSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  epochsList: {
    gap: spacing.sm,
  },
  epochItem: {
    padding: spacing.md,
    borderRadius: radius.default,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  epochItemInactive: {
    backgroundColor: colors.surfaceContainerLow,
  },
  epochItemActive: {
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: withAlpha(colors.primaryContainer, 0.4),
    boxShadow: shadows.elevationLow,
  },
  epochLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
    marginRight: spacing.sm,
  },
  epochDot: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
  },
  epochDotActiveGlow: {
    boxShadow: shadows.glowAmber,
  },
  epochTextCol: {
    flex: 1,
    gap: 2,
  },
  epochTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  epochTitle: {
    color: colors.onSurface,
    fontWeight: "600",
  },
  activePill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.primary, 0.2),
  },
  detailCard: {
    padding: spacing.md,
    borderRadius: radius.default,
    backgroundColor: colors.surfaceContainer,
    position: "relative",
    overflow: "hidden",
    boxShadow: shadows.elevationHigh,
  },
  detailGlowBlob: {
    position: "absolute",
    right: -24,
    bottom: -24,
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.primaryContainer, 0.1),
  },
  detailContent: {
    gap: spacing.md,
  },
  detailMainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  detailIconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.default,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadows.elevationLow,
  },
  detailCategory: {
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: letterSpacing(10, tracking.wider),
  },
  detailRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  confidenceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.secondaryContainer,
  },
  agreementText: {
    color: colors.onSurfaceVariant,
  },
  tagCloud: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: withAlpha(colors.surfaceContainerHighest, 0.4),
  },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
  },
  timeBreakdownCard: {
    padding: spacing.md,
    borderRadius: radius.default,
    backgroundColor: colors.surfaceContainer,
    gap: spacing.md,
    boxShadow: shadows.elevationLow,
  },
  timeBreakdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  breakdownHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  progressBarsList: {
    gap: spacing.md,
  },
  breakdownRow: {
    gap: 4,
  },
  breakdownLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  breakdownNameGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  breakdownTrack: {
    height: 10,
    width: "100%",
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
    overflow: "hidden",
  },
  breakdownFill: {
    height: "100%",
    borderRadius: radius.full,
  },
  noteCard: {
    padding: spacing.md,
    borderRadius: radius.default,
    backgroundColor: colors.surfaceContainerLow,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  noteText: {
    flex: 1,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  disclaimerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 4,
  },
  floatingDockWrap: {
    position: "absolute",
    left: spacing.margin,
    right: spacing.margin,
    alignItems: "center",
  },
  floatingDock: {
    width: "100%",
    maxWidth: 400,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainer, 0.92),
    borderWidth: 1,
    borderColor: withAlpha(colors.surfaceContainerHighest, 0.4),
    boxShadow: shadows.elevationHigh,
  },
  dockItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    gap: 2,
  },
  dockItemActive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    boxShadow: shadows.glowAmber,
  },
});
