// SCREEN 6 - Analyze (prototype: 6_catsense_ai._analyze)
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import { PressScale } from "@/components/animations/PressScale";
import { Pulse } from "@/components/animations/Pulse";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/Button";
import { Glow } from "@/components/ui/Glow";
import { Icon } from "@/components/ui/Icon";
import { images } from "@/constants/images";
import { USE_MOCK } from "@/services/api";
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

export default function AnalyzeScreen() {
  const router = useRouter();
  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        allowsEditing: false, // our own Trim screen does the cutting
        quality: 1,
      });
      if (result.canceled || result.assets.length === 0) return;

      const asset = result.assets[0];
      router.push({
        pathname: "/trim",
        params: {
          uri: asset.uri,
          name: asset.fileName ?? "video.mp4",
          mime: asset.mimeType ?? "video/mp4",
          // picker gives milliseconds; the Trim screen wants seconds
          duration: asset.duration ? String(asset.duration / 1000) : "",
        },
      });
    } catch (err) {
      Alert.alert(
        "Notice",
        "Unable to open gallery. Please check permissions.",
      );
    }
  };

  const recordLive = () => {
    // The in-app camera is still a design preview, so with the real backend we do not open it.
    if (!USE_MOCK) {
      Alert.alert(
        "Coming soon",
        "Recording inside the app is not ready yet. Please choose a video from your gallery.",
      );
      return;
    }
    router.push("/camera");
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <AppHeader subtitle="Analyze" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title & AI Ready Badge */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={[type.headlineXlMobile, styles.screenTitle]}>
              Analyze
            </Text>
            <View style={styles.aiReadyBadge}>
              <Pulse duration={1600}>
                <View style={styles.greenPulseDot} />
              </Pulse>
              <Text style={[type.labelSm, styles.aiReadyText]}>AI READY</Text>
            </View>
          </View>
          <Text style={[type.bodyMd, styles.screenSubtitle]}>
            Upload videos or record one. We check behavior and sound together.
          </Text>
        </View>

        {/* Interactive Drop-Zone Well */}
        <PressScale
          onPress={pickVideo}
          scaleTo={0.99}
          accessibilityRole="button"
          accessibilityLabel="Choose videos from gallery"
          style={styles.dropZoneOuter}
        >
          {/* Ambient Glows */}
          <Glow
            size={192}
            color={colors.primaryContainer}
            opacity={0.1}
            style={{ top: -48, right: -48 }}
          />
          <Glow
            size={192}
            color={colors.tertiaryContainer}
            opacity={0.1}
            style={{ bottom: -48, left: -48 }}
          />

          {/* Inner Dashed Framing Card */}
          <View style={styles.dropZoneInner}>
            {/* Feature Badge */}
            <View style={styles.dualEngineBadge}>
              <Icon name="graphic-eq" size={16} color={colors.primary} />
              <Text style={[type.labelSm, { color: colors.primary }]}>
                Dual Audio &amp; Vision Engine
              </Text>
            </View>

            {/* Big Circular Plus Button */}
            <View style={styles.bigPlusButton}>
              <LinearGradient
                colors={["#ffc043", "#ffa70a"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.bigPlusGradient}
              >
                <Icon name="add" size={36} color={colors.onPrimary} />
              </LinearGradient>
            </View>

            <Text style={[type.headlineSm, styles.dropZoneTitle]}>
              Choose videos from gallery
            </Text>
            <Text style={[type.labelSm, styles.dropZoneOrText]}>
              OR DROP A CAT VIDEO HERE
            </Text>
            <Text style={[type.bodySm, styles.dropZoneDesc]}>
              MP4 or MOV. You can trim it next (up to 60 seconds).
            </Text>

            {/* Spec watermark */}
            <View style={styles.specsRow}>
              <Icon name="videocam" size={16} color={colors.onSurfaceVariant} />
              <Text style={[type.labelSm, styles.specsText]}>
                Up to 4K 60fps supported
              </Text>
            </View>
          </View>
        </PressScale>

        {/* Action CTAs */}
        <View style={styles.ctaButtonsGroup}>
          <Button
            label="Upload videos"
            icon="file-upload"
            iconPosition="left"
            onPress={pickVideo}
            gradient={gradients.ctaFade}
            paddingVertical={15}
            shadow={shadows.cta}
          />
          <Button
            label="Record live"
            icon="radio-button-checked"
            iconPosition="left"
            iconColor={colors.error}
            color={colors.onSurface}
            background={withAlpha(colors.surfaceContainerHigh, 0.8)}
            onPress={recordLive}
            paddingVertical={15}
            shadow={shadows.md}
          />
        </View>

        {/* Detection Preview Visual Cards */}
        <View style={styles.previewCardsGrid}>
          {/* Card 1: Pose Tracking */}
          <View style={styles.previewCard}>
            <Image
              source={images.poseTracking}
              style={styles.previewBgImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={[
                "transparent",
                withAlpha(colors.surfaceContainerLowest, 0.5),
                colors.surfaceContainerLowest,
              ]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.previewCardContent}>
              <View style={styles.previewTitleRow}>
                <Icon name="visibility" size={16} color={colors.secondary} />
                <Text style={[type.labelSm, { color: colors.onSurface }]}>
                  Pose Tracking
                </Text>
              </View>
              <Text
                numberOfLines={1}
                style={[type.bodySm, { color: colors.onSurfaceVariant }]}
              >
                Skeletal AI overlay
              </Text>
            </View>
          </View>

          {/* Card 2: Bio-Acoustics */}
          <View style={styles.previewCard}>
            <Image
              source={images.bioAcoustics}
              style={styles.previewBgImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={[
                "transparent",
                withAlpha(colors.surfaceContainerLowest, 0.5),
                colors.surfaceContainerLowest,
              ]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.previewCardContent}>
              <View style={styles.previewTitleRow}>
                <Icon name="waves" size={16} color={colors.primary} />
                <Text style={[type.labelSm, { color: colors.onSurface }]}>
                  Bio-Acoustics
                </Text>
              </View>
              <Text
                numberOfLines={1}
                style={[type.bodySm, { color: colors.onSurfaceVariant }]}
              >
                Vocal spectrogram
              </Text>
            </View>
          </View>
        </View>

        {/* Behaviors We Detect Section */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeadingRow}>
            <View style={styles.headingLeft}>
              <Icon name="smart-toy" size={18} color={colors.secondary} />
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                Behaviors we detect
              </Text>
            </View>
            <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
              5 patterns
            </Text>
          </View>

          <View style={styles.chipsWrap}>
            <View style={styles.behaviorChip}>
              <Icon name="restaurant" size={16} color={colors.primary} />
              <Text style={[type.labelMd, { color: colors.onSurface }]}>
                Eating
              </Text>
            </View>
            <View style={styles.behaviorChip}>
              <Icon name="auto-fix-high" size={16} color={colors.tertiary} />
              <Text style={[type.labelMd, { color: colors.onSurface }]}>
                Grooming
              </Text>
            </View>
            <View style={styles.behaviorChip}>
              <Icon name="hotel" size={16} color={colors.secondary} />
              <Text style={[type.labelMd, { color: colors.onSurface }]}>
                Resting
              </Text>
            </View>
            <View style={styles.behaviorChip}>
              <Icon
                name="directions-walk"
                size={16}
                color={colors.secondaryFixed}
              />
              <Text style={[type.labelMd, { color: colors.onSurface }]}>
                Moving
              </Text>
            </View>
            <View style={styles.behaviorChip}>
              <Icon name="accessibility-new" size={16} color={colors.primary} />
              <Text style={[type.labelMd, { color: colors.onSurface }]}>
                Standing
              </Text>
            </View>
          </View>
        </View>

        {/* Sound Moods Section */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeadingRow}>
            <View style={styles.headingLeft}>
              <Icon name="volume-up" size={18} color={colors.primary} />
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                Sound moods
              </Text>
            </View>
            <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
              Acoustic tone
            </Text>
          </View>

          <View style={styles.chipsWrap}>
            <View style={styles.moodChip}>
              <View
                style={[styles.moodDot, { backgroundColor: colors.secondary }]}
              />
              <Text style={[type.labelMd, { color: colors.onSurface }]}>
                Happy
              </Text>
            </View>
            <View style={styles.moodChip}>
              <View
                style={[styles.moodDot, { backgroundColor: colors.tertiary }]}
              />
              <Text style={[type.labelMd, { color: colors.onSurface }]}>
                Resting
              </Text>
            </View>
            <View style={styles.moodChip}>
              <View
                style={[
                  styles.moodDot,
                  { backgroundColor: colors.primaryContainer },
                ]}
              />
              <Text style={[type.labelMd, { color: colors.onSurface }]}>
                Hungry
              </Text>
            </View>
            <View style={styles.moodChip}>
              <View
                style={[styles.moodDot, { backgroundColor: colors.error }]}
              />
              <Text style={[type.labelMd, { color: colors.onSurface }]}>
                Defensive
              </Text>
            </View>
            <View style={styles.moodChip}>
              <View
                style={[
                  styles.moodDot,
                  { backgroundColor: colors.secondaryFixed },
                ]}
              />
              <Text style={[type.labelMd, { color: colors.onSurface }]}>
                Purring
              </Text>
            </View>
          </View>
        </View>

        {/* Tips for Best Results Section */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeadingRow}>
            <View style={styles.headingLeft}>
              <Icon name="lightbulb" size={18} color={colors.primary} />
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                Tips for best results
              </Text>
            </View>
          </View>

          <View style={styles.tipsStack}>
            {/* Tip 1 */}
            <View style={styles.tipCard}>
              <View style={styles.tipIconCircle}>
                <Icon
                  name="filter-center-focus"
                  size={16}
                  color={colors.primary}
                />
              </View>
              <View style={styles.tipTextCol}>
                <Text style={[type.labelLg, { color: colors.onSurface }]}>
                  Keep your cat centered
                </Text>
                <Text style={[type.bodySm, styles.tipDesc]}>
                  Frame full feline body clearly in view to map body postures
                  and tail motions.
                </Text>
              </View>
            </View>

            {/* Tip 2 */}
            <View style={styles.tipCard}>
              <View style={styles.tipIconCircle}>
                <Icon name="wb-sunny" size={16} color={colors.primary} />
              </View>
              <View style={styles.tipTextCol}>
                <Text style={[type.labelLg, { color: colors.onSurface }]}>
                  Use bright natural light
                </Text>
                <Text style={[type.bodySm, styles.tipDesc]}>
                  Daylight helps the neural network register micro-expressions
                  and ear twitches.
                </Text>
              </View>
            </View>

            {/* Tip 3 */}
            <View style={styles.tipCard}>
              <View style={styles.tipIconCircle}>
                <Icon
                  name="screen-lock-rotation"
                  size={16}
                  color={colors.primary}
                />
              </View>
              <View style={styles.tipTextCol}>
                <Text style={[type.labelLg, { color: colors.onSurface }]}>
                  Hold the phone steady
                </Text>
                <Text style={[type.bodySm, styles.tipDesc]}>
                  A stable shot preserves high temporal accuracy for frequency
                  spectrogram analysis.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.margin,
    paddingTop: spacing.sm,
    paddingBottom: 110, // clear floating tab dock
    gap: spacing.lg,
  },

  titleSection: {
    gap: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  screenTitle: {
    color: colors.onSurface,
    letterSpacing: letterSpacing(26, tracking.tight),
  },
  aiReadyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.secondaryContainer, 0.2),
  },
  greenPulseDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
  },
  aiReadyText: {
    color: colors.secondary,
    letterSpacing: letterSpacing(10, tracking.wider),
  },
  screenSubtitle: {
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },

  dropZoneOuter: {
    position: "relative",
    width: "100%",
    borderRadius: radius.lg,
    backgroundColor: withAlpha(colors.surfaceContainerHigh, 0.6),
    padding: spacing.md,
    boxShadow: shadows.xxl,
    overflow: "hidden",
  },
  dropZoneInner: {
    width: "100%",
    borderRadius: radius.base,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.8),
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadows.inner,
  },
  dualEngineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
    marginBottom: spacing.md,
    boxShadow: shadows.sm,
  },
  bigPlusButton: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    marginVertical: spacing.sm,
    boxShadow: shadows.cta,
    overflow: "hidden",
  },
  bigPlusGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  dropZoneTitle: {
    color: colors.onSurface,
    marginTop: spacing.sm,
    marginBottom: 4,
    letterSpacing: letterSpacing(18, tracking.tight),
  },
  dropZoneOrText: {
    color: withAlpha(colors.primary, 0.8),
    letterSpacing: letterSpacing(10, tracking.widest),
    marginBottom: 8,
  },
  dropZoneDesc: {
    color: colors.onSurfaceVariant,
    textAlign: "center",
    maxWidth: 240,
    lineHeight: 18,
  },
  specsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: spacing.md,
  },
  specsText: {
    color: withAlpha(colors.onSurfaceVariant, 0.7),
  },

  ctaButtonsGroup: {
    gap: spacing.sm,
  },

  previewCardsGrid: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  previewCard: {
    flex: 1,
    height: 112,
    borderRadius: radius.base,
    overflow: "hidden",
    backgroundColor: colors.surfaceContainer,
    padding: spacing.sm,
    justifyContent: "flex-end",
    boxShadow: shadows.md,
  },
  previewBgImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    opacity: 0.4,
  },
  previewCardContent: {
    zIndex: 10,
  },
  previewTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },

  sectionWrap: {
    gap: spacing.sm,
  },
  sectionHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  behaviorChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    boxShadow: shadows.sm,
  },
  moodChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    boxShadow: shadows.sm,
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },

  tipsStack: {
    gap: 8,
    marginBottom: 8,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: radius.base,
    backgroundColor: colors.surfaceContainerLow,
    boxShadow: shadows.sm,
  },
  tipIconCircle: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  tipTextCol: {
    flex: 1,
  },
  tipDesc: {
    color: colors.onSurfaceVariant,
    lineHeight: 18,
    marginTop: 2,
  },
});
