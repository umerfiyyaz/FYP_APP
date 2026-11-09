// SCREEN 9 - No Cat Found (Incomplete Scan) (prototype: 9_catsense_ai_no_cat_found)
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressScale } from "@/components/animations/PressScale";
import { Pulse } from "@/components/animations/Pulse";
import { Button } from "@/components/ui/Button";
import { Glow } from "@/components/ui/Glow";
import { Icon } from "@/components/ui/Icon";
import { images } from "@/constants/images";
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

export default function NoCatFoundScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const onTryAnotherVideo = () => {
    router.replace("/(tabs)/analyze");
  };

  const onRecordLive = () => {
    router.replace("/camera");
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={[styles.navBar, { paddingTop: Math.max(insets.top, 12) }]}>
        <PressScale
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.navButton}
        >
          <Icon name="arrow-back" size={20} color={colors.onSurface} />
        </PressScale>

        <View style={styles.navCenter}>
          <Text style={[type.headlineSm, styles.navTitle]}>Scan Results</Text>
          <Text style={[type.labelSm, styles.navBadge]}>INCOMPLETE SCAN</Text>
        </View>

        <PressScale
          onPress={() => router.replace("/(tabs)/analyze")}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.navButton}
        >
          <Icon name="close" size={20} color={colors.onSurface} />
        </PressScale>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Warning Card */}
        <View style={styles.heroCard}>
          {/* Ambient Coral & Amber Bloom */}
          <Glow
            size={192}
            color={colors.errorContainer}
            opacity={0.2}
            style={{ top: -48, right: -48 }}
          />
          <Glow
            size={176}
            color={colors.primaryContainer}
            opacity={0.15}
            style={{ bottom: -40, left: -40 }}
          />

          <View style={styles.heroCenter}>
            {/* Mascot 3D Illustration Container with floating search_off badge */}
            <View style={styles.mascotTargetRing}>
              <View style={styles.mascotCircle}>
                <Image
                  source={images.mascotNoCat}
                  style={styles.mascotImg}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.statusFloatingBadge}>
                <Icon
                  name="search-off"
                  size={20}
                  color={colors.onErrorContainer}
                />
              </View>
            </View>

            {/* Coral Warning Badge */}
            <View style={styles.coralWarningPill}>
              <Icon name="warning" size={14} color={colors.error} />
              <Text style={[type.labelMd, { color: colors.error }]}>
                No cat detected
              </Text>
            </View>

            {/* Main Headline & Subtext */}
            <Text style={[type.headlineXlMobile, styles.heroTitle]}>
              We could not find a cat
            </Text>
            <Text style={[type.bodyMd, styles.heroSubtitle]}>
              Our vision model couldn't pinpoint whiskers, ears, or feline
              motion. Try these quick tips and upload again.
            </Text>

            {/* Technical Metadata Pill Chip */}
            <View style={styles.metaChip}>
              <Pulse duration={1000} minOpacity={0.3}>
                <View style={styles.redDot} />
              </Pulse>
              <Text style={[type.labelSm, styles.metaText]}>
                No cat was found in this video
              </Text>
            </View>
          </View>
        </View>

        {/* Checklist Card: Tips for Best Analysis */}
        <View style={styles.checklistCard}>
          <View style={styles.checklistHeader}>
            <View style={styles.lightbulbCircle}>
              <Icon
                name="lightbulb"
                size={18}
                color={colors.primaryContainer}
              />
            </View>
            <View>
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                Tips for Best Analysis
              </Text>
              <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
                Boost computer vision accuracy
              </Text>
            </View>
          </View>

          {/* 4 Numbered Items */}
          <View style={styles.itemsList}>
            {/* Item 1 */}
            <View style={styles.itemRow}>
              <View style={styles.numberBadge}>
                <Text style={[type.labelMd, styles.numberText]}>1</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={[type.labelLg, { color: colors.onSurface }]}>
                  Keep the cat clearly in view
                </Text>
                <Text style={[type.bodySm, styles.itemDesc]}>
                  Ensure paws, ears, or tail aren't completely obscured by
                  furniture.
                </Text>
              </View>
            </View>

            {/* Item 2 */}
            <View style={styles.itemRow}>
              <View style={styles.numberBadge}>
                <Text style={[type.labelMd, styles.numberText]}>2</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={[type.labelLg, { color: colors.onSurface }]}>
                  Use clear light, avoid backlight
                </Text>
                <Text style={[type.bodySm, styles.itemDesc]}>
                  Direct soft light toward your cat rather than shooting
                  directly into windows or dark corners.
                </Text>
              </View>
            </View>

            {/* Item 3 */}
            <View style={styles.itemRow}>
              <View style={styles.numberBadge}>
                <Text style={[type.labelMd, styles.numberText]}>3</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={[type.labelLg, { color: colors.onSurface }]}>
                  Keep the phone steady
                </Text>
                <Text style={[type.bodySm, styles.itemDesc]}>
                  Rapid handheld shaking causes optical blur, degrading facial
                  landmark tracking.
                </Text>
              </View>
            </View>

            {/* Item 4 */}
            <View style={styles.itemRow}>
              <View style={styles.numberBadge}>
                <Text style={[type.labelMd, styles.numberText]}>4</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={[type.labelLg, { color: colors.onSurface }]}>
                  Clip should show cat for at least 5 seconds
                </Text>
                <Text style={[type.bodySm, styles.itemDesc]}>
                  Continuous tracking is required to calculate cadence, purr
                  acoustics, and tail tempo.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsGroup}>
          <Button
            label="Try another video"
            icon="video-library"
            iconPosition="left"
            iconSize={22}
            onPress={onTryAnotherVideo}
            gradient={gradients.ctaFade}
            paddingVertical={15}
            shadow={shadows.cta}
          />
          <Button
            label="Record live instead"
            icon="videocam"
            iconPosition="left"
            iconColor={colors.secondary}
            iconSize={22}
            color={colors.onSurface}
            background={withAlpha(colors.surfaceContainerHigh, 0.7)}
            onPress={onRecordLive}
            paddingVertical={15}
            shadow={shadows.md}
          />
        </View>

        {/* Disclaimer Note */}
        <View style={styles.disclaimerRow}>
          <Icon name="info" size={16} color={colors.onSurfaceVariant} />
          <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
            This video was not analysed and was not saved to your history.
          </Text>
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
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    zIndex: 20,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadows.md,
  },
  navCenter: {
    alignItems: "center",
  },
  navTitle: {
    color: colors.onSurface,
    letterSpacing: letterSpacing(18, tracking.tight),
  },
  navBadge: {
    color: colors.error,
    fontWeight: "700",
    letterSpacing: letterSpacing(10, tracking.wider),
    marginTop: 2,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.margin,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },

  heroCard: {
    position: "relative",
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerHigh,
    padding: spacing.lg,
    boxShadow: shadows.xl,
    overflow: "hidden",
  },
  heroCenter: {
    position: "relative",
    zIndex: 10,
    alignItems: "center",
    textAlign: "center",
  },
  mascotTargetRing: {
    position: "relative",
    marginBottom: spacing.md,
  },
  mascotCircle: {
    width: 128,
    height: 128,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLowest,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "inset 0 4px 12px rgba(0,0,0,0.6)",
  },
  mascotImg: {
    width: "100%",
    height: "100%",
    borderRadius: radius.full,
  },
  statusFloatingBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadows.lg,
  },

  coralWarningPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.errorContainer, 0.4),
    marginBottom: spacing.sm,
  },
  heroTitle: {
    color: colors.onSurface,
    letterSpacing: letterSpacing(26, tracking.tight),
    textAlign: "center",
    marginBottom: 6,
  },
  heroSubtitle: {
    color: colors.onSurfaceVariant,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  metaChip: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLowest,
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)",
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.error,
  },
  metaText: {
    color: colors.onSurfaceVariant,
    letterSpacing: letterSpacing(10, tracking.wide),
  },

  checklistCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainer,
    padding: spacing.lg,
    boxShadow: shadows.lg,
    gap: spacing.md,
  },
  checklistHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  lightbulbCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.primaryContainer, 0.2),
    alignItems: "center",
    justifyContent: "center",
  },
  itemsList: {
    gap: spacing.md,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.secondaryContainer, 0.2),
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  numberText: {
    color: colors.secondary,
    fontWeight: "700",
  },
  itemContent: {
    flex: 1,
  },
  itemDesc: {
    color: colors.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 18,
  },

  buttonsGroup: {
    gap: spacing.sm,
  },
  disclaimerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
  },
});
