// SCREEN 10 - Analysis Complete Results (prototype: 10_catsense_ai._results)
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
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
import { Button } from "@/components/ui/Button";
import { Glow } from "@/components/ui/Glow";
import { Icon } from "@/components/ui/Icon";
import { images } from "@/constants/images";
import {
  deleteAnalysisResult,
  fetchAnalysisResult,
} from "@/services/analysis";
import { AnalysisSummary } from "@/types";
import {
  colors,
  gradients,
  letterSpacing,
  radius,
  shadows,
  spacing,
  tracking,
  type,
  withAlpha,
} from "@/theme";

export default function ResultsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const [data, setData] = useState<AnalysisSummary | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPlayingClip, setIsPlayingClip] = useState(false);

  useEffect(() => {
    fetchAnalysisResult(id || "8492").then((res) => setData(res));
  }, [id]);

  if (!data) {
    return (
      <View style={[styles.container, styles.loadingCenter]}>
        <Pulse>
          <Text style={[type.labelLg, { color: colors.primary }]}>
            Loading results...
          </Text>
        </Pulse>
      </View>
    );
  }

  const onViewTimeline = () => {
    router.push("/behavior/1409");
  };

  const onConfirmDelete = async () => {
    await deleteAnalysisResult(data.id);
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
            style={styles.avatarBorder}
          >
            <Image
              source={images.userProfile}
              style={styles.profileAvatar}
              resizeMode="cover"
            />
          </LinearGradient>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status & Header Meta Strip */}
        <View style={styles.metaStrip}>
          <View style={styles.metaRow}>
            <View>
              <Text style={[type.headlineMd, styles.completeTitle]}>
                Analysis complete
              </Text>
              <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
                {data.dateFormatted}
              </Text>
            </View>
            <View style={styles.analysedTag}>
              <Icon name="timelapse" size={16} color={colors.primary} />
              <Text style={[type.labelMd, { color: colors.primary }]}>
                {data.durationSeconds}s analysed
              </Text>
            </View>
          </View>

          {/* Prominent Mint Automatic Save Notification Banner */}
          <View style={styles.saveBanner}>
            <View style={styles.saveBannerLeft}>
              <View style={styles.checkCircle}>
                <Icon name="check" size={16} color={colors.onSecondary} />
              </View>
              <Text style={[type.labelMd, { color: colors.secondaryFixed }]}>
                Saved to history automatically
              </Text>
            </View>
            <Text style={[type.labelSm, styles.syncedText]}>Synced</Text>
          </View>
        </View>

        {/* Hero Emotion & Mascot Card */}
        <View style={styles.heroEmotionCard}>
          <LinearGradient
            colors={[
              colors.surfaceContainerHigh,
              colors.surfaceContainer,
              colors.surfaceContainerLow,
            ]}
            style={StyleSheet.absoluteFill}
          />
          <Glow
            size={176}
            color={colors.primaryContainer}
            opacity={0.15}
            style={{ bottom: -40, right: -40 }}
          />

          <View style={styles.heroEmotionContent}>
            <View style={styles.heroEmotionLeft}>
              <View style={styles.riskPill}>
                <Pulse duration={1200}>
                  <View style={styles.riskDot} />
                </Pulse>
                <Text style={[type.labelSm, { color: colors.secondary }]}>
                  Risk: {data.riskLevel}
                </Text>
              </View>
              <Text style={[type.headlineLg, { color: colors.primary }]}>
                {data.sentimentTitle}
              </Text>
              <Text style={[type.bodyMd, styles.sentimentDesc]}>
                {data.sentimentDescription}
              </Text>
            </View>

            <View style={styles.mascotAuraWrap}>
              <View style={styles.mascotAura} />
              <Image
                source={images.mascotPurring}
                style={styles.mascotPurringImg}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* Synchronized Audio-Visual Clip Preview Card */}
        <View style={styles.clipCard}>
          <ImageBackground
            source={images.videoStillMilo}
            style={styles.videoBackground}
            resizeMode="cover"
          >
            <LinearGradient
              colors={[
                "transparent",
                withAlpha(colors.surfaceContainerLowest, 0.4),
                withAlpha(colors.surfaceContainerLowest, 0.95),
              ]}
              style={StyleSheet.absoluteFill}
            />

            {/* Top row badges */}
            <View style={styles.clipTopRow}>
              <View style={styles.syncedBadge}>
                <Icon name="graphic-eq" size={13} color={colors.secondary} />
                <Text style={[type.labelSm, { color: colors.primary }]}>
                  Audio &amp; Vision Synced
                </Text>
              </View>
              <View style={styles.clipNumBadge}>
                <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
                  {data.clipNumber}
                </Text>
              </View>
            </View>

            {/* Bottom row info & Play button */}
            <View style={styles.clipBottomRow}>
              <View>
                <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                  {data.catName}
                </Text>
                <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
                  {data.location}
                </Text>
              </View>

              <PressScale
                onPress={() => setIsPlayingClip((p) => !p)}
                accessibilityRole="button"
                accessibilityLabel="Play clip"
                style={styles.playClipBtn}
              >
                <Icon
                  name={isPlayingClip ? "pause" : "play-arrow"}
                  size={26}
                  color={colors.onPrimaryContainer}
                />
              </PressScale>
            </View>
          </ImageBackground>
        </View>

        {/* Behavior Breakdown Card (5 Allowed Categories) */}
        <View style={styles.cardSection}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.headerIconTitle}>
              <Icon name="pets" size={20} color={colors.tertiary} />
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                Behavior
              </Text>
            </View>
            <Text style={[type.labelSm, styles.metaVectors]}>5 Vectors</Text>
          </View>

          {/* Multi-Segmented Percentage Bar */}
          <View style={styles.multiSegmentBar}>
            <View
              style={[
                styles.segmentPart,
                {
                  width: `${data.behaviors.resting}%`,
                  backgroundColor: colors.tertiaryContainer,
                  borderTopLeftRadius: radius.full,
                  borderBottomLeftRadius: radius.full,
                },
              ]}
            />
            <View
              style={[
                styles.segmentPart,
                {
                  width: `${data.behaviors.grooming}%`,
                  backgroundColor: colors.primaryContainer,
                },
              ]}
            />
            <View
              style={[
                styles.segmentPart,
                {
                  width: `${data.behaviors.moving}%`,
                  backgroundColor: colors.secondary,
                  borderTopRightRadius: radius.full,
                  borderBottomRightRadius: radius.full,
                },
              ]}
            />
          </View>

          {/* Behavior Metric Rows */}
          <View style={styles.metricsStack}>
            <View style={styles.metricRow}>
              <View style={styles.metricLeft}>
                <View
                  style={[
                    styles.metricDot,
                    { backgroundColor: colors.tertiaryContainer },
                  ]}
                />
                <Text style={[type.bodyMd, { color: colors.onSurface }]}>
                  Resting
                </Text>
              </View>
              <Text style={[type.labelLg, { color: colors.tertiary }]}>
                {data.behaviors.resting}%
              </Text>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricLeft}>
                <View
                  style={[
                    styles.metricDot,
                    { backgroundColor: colors.primaryContainer },
                  ]}
                />
                <Text style={[type.bodyMd, { color: colors.onSurface }]}>
                  Grooming
                </Text>
              </View>
              <Text style={[type.labelLg, { color: colors.primary }]}>
                {data.behaviors.grooming}%
              </Text>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricLeft}>
                <View
                  style={[
                    styles.metricDot,
                    { backgroundColor: colors.secondary },
                  ]}
                />
                <Text style={[type.bodyMd, { color: colors.onSurface }]}>
                  Moving
                </Text>
              </View>
              <Text style={[type.labelLg, { color: colors.secondaryFixed }]}>
                {data.behaviors.moving}%
              </Text>
            </View>

            <View style={[styles.metricRow, { opacity: 0.5 }]}>
              <View style={styles.metricLeft}>
                <View
                  style={[styles.metricDot, { backgroundColor: colors.outline }]}
                />
                <Text style={[type.bodyMd, { color: colors.onSurfaceVariant }]}>
                  Eating
                </Text>
              </View>
              <Text style={[type.labelLg, { color: colors.onSurfaceVariant }]}>
                {data.behaviors.eating}%
              </Text>
            </View>

            <View style={[styles.metricRow, { opacity: 0.5 }]}>
              <View style={styles.metricLeft}>
                <View
                  style={[styles.metricDot, { backgroundColor: colors.outline }]}
                />
                <Text style={[type.bodyMd, { color: colors.onSurfaceVariant }]}>
                  Standing
                </Text>
              </View>
              <Text style={[type.labelLg, { color: colors.onSurfaceVariant }]}>
                {data.behaviors.standing}%
              </Text>
            </View>
          </View>
        </View>

        {/* Sound Mood Card */}
        <Pressable
          onPress={() => router.push("/sound/084")}
          accessibilityRole="button"
          accessibilityLabel="Inspect sound mood details"
          style={styles.cardSection}
        >
          <View style={styles.cardHeaderRow}>
            <View style={styles.headerIconTitle}>
              <Icon name="volume-up" size={20} color={colors.secondary} />
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                Sound mood
              </Text>
            </View>
            <View style={styles.acousticPill}>
              <Text style={[type.labelSm, { color: colors.secondary }]}>
                Acoustic AI
              </Text>
            </View>
          </View>

          {/* Dominant Mood Box */}
          <View style={styles.dominantMoodBox}>
            <View style={styles.dominantLeft}>
              <View style={styles.moodIconWrap}>
                <Icon
                  name="sentiment-very-satisfied"
                  size={22}
                  color={colors.secondary}
                />
              </View>
              <View>
                <Text style={[type.labelLg, { color: colors.secondaryFixed }]}>
                  {data.dominantMood.name}
                </Text>
                <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
                  {data.dominantMood.description}
                </Text>
              </View>
            </View>
            <Text style={[type.headlineLg, { color: colors.secondary }]}>
              {data.dominantMood.percentage}%
            </Text>
          </View>

          {/* Secondary Acoustic Clusters */}
          <View style={styles.clustersGrid}>
            {data.secondaryMoods.map((m) => (
              <View key={m.name} style={styles.clusterCard}>
                <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
                  {m.name}
                </Text>
                <Text style={[type.labelLg, { color: colors.primary, marginTop: 4 }]}>
                  {m.percentage}%
                </Text>
              </View>
            ))}
          </View>
        </Pressable>

        {/* "What this means" Card */}
        <View style={styles.cardSection}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.headerIconTitle}>
              <Icon name="lightbulb" size={20} color={colors.primary} />
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                What this means
              </Text>
            </View>
          </View>

          <Text style={[type.bodyLg, styles.interpretationText]}>
            {data.interpretation}
          </Text>

          <View style={styles.vetNoteBox}>
            <Icon name="info" size={18} color={colors.outline} />
            <Text style={[type.bodySm, { color: colors.outline, flex: 1 }]}>
              An indication, not a medical diagnosis. Consult a licensed veterinarian for medical guidance.
            </Text>
          </View>
        </View>

        {/* Screen Actions */}
        <View style={styles.actionsWrap}>
          <Button
            label="View behavior timeline"
            icon="schedule"
            iconPosition="right"
            onPress={onViewTimeline}
            gradient={gradients.ctaFade}
            paddingVertical={15}
            shadow={shadows.cta}
          />

          <PressScale
            onPress={() => setShowDeleteModal(true)}
            accessibilityRole="button"
            accessibilityLabel="Remove from history"
            style={styles.deleteHistoryBtn}
          >
            <Icon name="delete" size={20} color={colors.error} />
            <Text style={[type.labelLg, { color: colors.error }]}>
              Remove from history
            </Text>
          </PressScale>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowDeleteModal(false)}
        >
          <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalIconCircle}>
                <Icon name="delete-forever" size={22} color={colors.error} />
              </View>
              <View>
                <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                  Remove this result?
                </Text>
                <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
                  Permanent record change
                </Text>
              </View>
            </View>

            <Text style={[type.bodyMd, styles.modalDesc]}>
              It will be deleted from Milo's history. This cannot be undone.
            </Text>

            <View style={styles.modalButtonsRow}>
              <PressScale
                onPress={() => setShowDeleteModal(false)}
                style={styles.keepBtn}
              >
                <Text style={[type.labelLg, { color: colors.onSurface }]}>
                  Keep
                </Text>
              </PressScale>
              <PressScale
                onPress={onConfirmDelete}
                style={styles.removeConfirmBtn}
              >
                <Text style={[type.labelLg, { color: colors.onErrorContainer }]}>
                  Remove
                </Text>
              </PressScale>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: withAlpha(colors.background, 0.85),
    paddingBottom: 10,
    paddingHorizontal: spacing.margin,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 4px 24px rgba(13,7,47,0.45)",
    zIndex: 50,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerIconBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainer, 0.7),
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogo: {
    width: 30,
    height: 30,
  },
  headerTitle: {
    color: colors.onSurface,
    fontWeight: "700",
    letterSpacing: letterSpacing(18, tracking.tight),
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
  profileAvatar: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.margin,
    paddingTop: spacing.xs,
    paddingBottom: 110,
    gap: spacing.md,
  },

  metaStrip: {
    gap: 10,
    paddingTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  completeTitle: {
    color: colors.onSurface,
    letterSpacing: letterSpacing(20, tracking.tight),
  },
  analysedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    boxShadow: shadows.inner,
  },
  saveBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.base,
    backgroundColor: withAlpha(colors.secondaryContainer, 0.2),
    boxShadow: "0 4px 16px rgba(0,170,124,0.18)",
  },
  saveBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  syncedText: {
    color: withAlpha(colors.secondary, 0.8),
    textTransform: "uppercase",
    letterSpacing: letterSpacing(10, tracking.wider),
  },

  heroEmotionCard: {
    position: "relative",
    borderRadius: radius.lg,
    padding: 20,
    overflow: "hidden",
    boxShadow: "0 12px 32px rgba(13,7,47,0.6)",
  },
  heroEmotionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  heroEmotionLeft: {
    flex: 1,
    paddingRight: 12,
  },
  riskPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.secondary, 0.15),
    marginBottom: 8,
  },
  riskDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
  },
  sentimentDesc: {
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  mascotAuraWrap: {
    position: "relative",
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
  },
  mascotAura: {
    position: "absolute",
    inset: 0,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.primaryContainer, 0.3),
  },
  mascotPurringImg: {
    width: 80,
    height: 80,
    zIndex: 10,
  },

  clipCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainer,
    padding: 14,
    boxShadow: shadows.md,
  },
  videoBackground: {
    width: "100%",
    height: 176,
    borderRadius: radius.base,
    overflow: "hidden",
    justifyContent: "space-between",
    padding: 14,
  },
  clipTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  syncedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.8),
  },
  clipNumBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerHigh, 0.9),
  },
  clipBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  playClipBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadows.cta,
  },

  cardSection: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainer,
    padding: 20,
    boxShadow: shadows.md,
    gap: spacing.sm,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerIconTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaVectors: {
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: letterSpacing(10, tracking.wider),
  },
  multiSegmentBar: {
    width: "100%",
    height: 14,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLowest,
    flexDirection: "row",
    overflow: "hidden",
    padding: 2,
    gap: 2,
  },
  segmentPart: {
    height: "100%",
  },
  metricsStack: {
    gap: 10,
    paddingTop: 4,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: withAlpha(colors.surfaceContainerHigh, 0.6),
  },
  metricLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  metricDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
  },

  acousticPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.secondaryContainer, 0.2),
  },
  dominantMoodBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: radius.base,
    backgroundColor: colors.surfaceContainerHigh,
  },
  dominantLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  moodIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.secondary, 0.15),
    alignItems: "center",
    justifyContent: "center",
  },
  clustersGrid: {
    flexDirection: "row",
    gap: 10,
  },
  clusterCard: {
    flex: 1,
    padding: 12,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceContainerLow,
  },

  interpretationText: {
    color: colors.onSurface,
    lineHeight: 24,
  },
  vetNoteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: radius.sm,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.8),
  },

  actionsWrap: {
    gap: spacing.sm,
    paddingTop: 4,
  },
  deleteHistoryBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerHigh, 0.4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.error,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.8),
    justifyContent: "flex-end",
    padding: spacing.margin,
  },
  modalSheet: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerHigh,
    padding: 20,
    gap: 16,
    boxShadow: "0 -8px 32px rgba(0,0,0,0.7)",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.outlineVariant, 0.6),
    alignSelf: "center",
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalIconCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.errorContainer, 0.3),
    alignItems: "center",
    justifyContent: "center",
  },
  modalDesc: {
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  modalButtonsRow: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 8,
  },
  keepBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  removeConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.full,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 20px rgba(255,180,171,0.35)",
  },
});

