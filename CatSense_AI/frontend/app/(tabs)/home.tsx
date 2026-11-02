// SCREEN 5 - Home Dashboard (First Scan) (prototype: 5_catsense_ai._home_first_scan)
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { Pulse } from "@/components/animations/Pulse";
import { AppHeader } from "@/components/ui/AppHeader";
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

export default function HomeScreen() {
  const router = useRouter();

  const onUpload = () => {
    router.push("/(tabs)/analyze");
  };

  const onRecord = () => {
    router.push("/camera");
  };

  return (
    <View style={styles.container}>
      {/* Top Fixed App Header */}
      <AppHeader subtitle="Home" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome & Status Bar */}
        <View style={styles.greetingRow}>
          <View style={styles.greetingLeft}>
            <Text style={[type.headlineSm, styles.greetingTitle]}>
              Welcome, Alex! 👋
            </Text>
            <View style={styles.statusRow}>
              <View style={styles.greenDotGlow} />
              <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
                AI Biometrics Standby
              </Text>
            </View>
          </View>

          {/* Cat status pill */}
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/(tabs)/profile")}
            style={styles.catPill}
          >
            <View style={styles.catAvatarContainer}>
              <Image
                source={images.catMilo}
                style={styles.catAvatarSmall}
                resizeMode="cover"
              />
              <View style={styles.avatarOnlineDot} />
            </View>
            <View style={styles.catPillTexts}>
              <Text style={[type.labelSm, { color: colors.primary, lineHeight: 12 }]}>
                Milo
              </Text>
              <Text style={[type.labelSm, styles.readyText]}>Ready</Text>
            </View>
          </Pressable>
        </View>

        {/* Hero Section: Ready for Milo's first check-in */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[
              colors.surfaceContainer,
              colors.surfaceContainer,
              colors.surfaceContainerLow,
            ]}
            style={StyleSheet.absoluteFill}
          />
          <Glow
            size={176}
            color={colors.primaryContainer}
            opacity={0.15}
            style={{ top: -48, right: -48 }}
          />
          <Glow
            size={144}
            color={colors.tertiaryContainer}
            opacity={0.1}
            style={{ bottom: -40, left: -40 }}
          />

          {/* Top badges */}
          <View style={styles.heroTopBadges}>
            <View style={styles.dayBadge}>
              <Icon name="cake" size={15} color={colors.primaryFixedDim} />
              <Text style={[type.labelMd, { color: colors.primary }]}>
                Day 1 with Milo
              </Text>
            </View>
            <View style={styles.newProfileBadge}>
              <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
                New profile
              </Text>
            </View>
          </View>

          {/* Hero 3D Mascot Image */}
          <View style={styles.heroImageBox}>
            <Image
              source={images.catHero3D}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", withAlpha(colors.surfaceContainer, 0.8)]}
              style={styles.imageGradientOverlay}
            />
            <View style={styles.acousticReadyBadge}>
              <Pulse duration={1500}>
                <Icon name="graphic-eq" size={14} color={colors.secondary} />
              </Pulse>
              <Text style={[type.labelSm, { color: colors.onSurface, fontSize: 11 }]}>
                Acoustic &amp; Vision Ready
              </Text>
            </View>
          </View>

          {/* Hero text */}
          <Text style={[type.headlineXlMobile, styles.heroTitle]}>
            Ready for Milo's first check-in
          </Text>
          <Text style={[type.bodyMd, styles.heroSubtitle]}>
            Upload a short video of Milo resting, moving or eating to build his baseline.
          </Text>

          {/* Hero CTA buttons */}
          <View style={styles.heroButtons}>
            <Button
              label="Upload First Video"
              icon="cloud-upload"
              iconPosition="left"
              onPress={onUpload}
              gradient={gradients.ctaFade}
              paddingVertical={14}
              shadow={shadows.cta}
            />
            <Button
              label="Record Live"
              icon="videocam"
              iconPosition="left"
              iconColor={colors.secondary}
              color={colors.onSurface}
              background={colors.surfaceContainerHigh}
              onPress={onRecord}
              paddingVertical={14}
              shadow={shadows.md}
            />
          </View>
        </View>

        {/* Health Baseline Section */}
        <View style={styles.cardContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.headerIconCircle}>
                <Icon name="monitor-heart" size={18} color={colors.primary} />
              </View>
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                Health baseline
              </Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={[type.labelMd, { color: colors.primary }]}>0/3</Text>
            </View>
          </View>

          {/* 3 Clip cards */}
          <View style={styles.clipsGrid}>
            {/* Clip 1: Active */}
            <View style={styles.clipCardActive}>
              <View style={styles.clipNumberCircleActive}>
                <Text style={[type.labelLg, { color: colors.onPrimaryContainer }]}>1</Text>
              </View>
              <Text style={[type.labelMd, { color: colors.primary, fontWeight: "700" }]}>
                Clip 1
              </Text>
              <View style={styles.nextBadge}>
                <Text style={[type.labelSm, { color: colors.primary, fontSize: 10 }]}>Next</Text>
              </View>
            </View>

            {/* Clip 2: Locked */}
            <View style={styles.clipCardLocked}>
              <View style={styles.clipNumberCircleLocked}>
                <Icon name="lock" size={16} color={colors.onSurfaceVariant} />
              </View>
              <Text style={[type.labelMd, { color: colors.onSurfaceVariant }]}>
                Clip 2
              </Text>
              <View style={styles.lockedBadge}>
                <Text style={[type.labelSm, { color: colors.onSurfaceVariant, fontSize: 10 }]}>
                  Locked
                </Text>
              </View>
            </View>

            {/* Clip 3: Locked */}
            <View style={styles.clipCardLocked}>
              <View style={styles.clipNumberCircleLocked}>
                <Icon name="lock" size={16} color={colors.onSurfaceVariant} />
              </View>
              <Text style={[type.labelMd, { color: colors.onSurfaceVariant }]}>
                Clip 3
              </Text>
              <View style={styles.lockedBadge}>
                <Text style={[type.labelSm, { color: colors.onSurfaceVariant, fontSize: 10 }]}>
                  Locked
                </Text>
              </View>
            </View>
          </View>

          {/* Explanatory note */}
          <View style={styles.infoBanner}>
            <Icon name="info" size={18} color={colors.primary} />
            <Text style={[type.bodySm, styles.infoBannerText]}>
              Analyse 3 videos on different days to unlock a reliable risk score.
            </Text>
          </View>
        </View>

        {/* Weekly Habits Section */}
        <View style={styles.cardContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View
                style={[
                  styles.headerIconCircle,
                  { backgroundColor: withAlpha(colors.secondaryContainer, 0.2) },
                ]}
              >
                <Icon name="query-stats" size={18} color={colors.secondary} />
              </View>
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                Weekly habits
              </Text>
            </View>
            <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
              7-day trends
            </Text>
          </View>

          {/* Empty state box */}
          <View style={styles.habitsEmptyState}>
            <View style={styles.hourglassCircle}>
              <Icon name="hourglass-empty" size={30} color={colors.tertiary} />
              <View style={styles.analyticsSubBadge}>
                <Icon name="analytics" size={12} color={colors.onSecondary} />
              </View>
            </View>

            <Text style={[type.headlineSm, { color: colors.onSurface, marginTop: 4 }]}>
              Waiting for first scan
            </Text>
            <Text style={[type.bodySm, styles.habitsEmptyDesc]}>
              Behavior signatures calibrate automatically once Milo's first session is processed.
            </Text>

            {/* Behaviors tag list */}
            <View style={styles.behaviorTagsWrap}>
              <View style={styles.behaviorTag}>
                <Icon name="restaurant" size={13} color={colors.primary} />
                <Text style={[type.labelSm, styles.behaviorTagText]}>Eating</Text>
              </View>
              <View style={styles.behaviorTag}>
                <Icon name="auto-fix-high" size={13} color={colors.tertiary} />
                <Text style={[type.labelSm, styles.behaviorTagText]}>Grooming</Text>
              </View>
              <View style={styles.behaviorTag}>
                <Icon name="hotel" size={13} color={colors.secondary} />
                <Text style={[type.labelSm, styles.behaviorTagText]}>Resting</Text>
              </View>
              <View style={styles.behaviorTag}>
                <Icon name="pets" size={13} color={colors.primaryFixedDim} />
                <Text style={[type.labelSm, styles.behaviorTagText]}>Moving</Text>
              </View>
              <View style={styles.behaviorTag}>
                <Icon name="accessibility-new" size={13} color={colors.tertiaryFixedDim ?? colors.tertiary} />
                <Text style={[type.labelSm, styles.behaviorTagText]}>Standing</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pro Tip Card */}
        <View style={styles.proTipCard}>
          <View style={styles.proTipIconCircle}>
            <Icon name="lightbulb" size={20} color={colors.primaryContainer} />
          </View>
          <View style={styles.proTipTextColumn}>
            <Text style={[type.labelMd, styles.proTipLabel]}>PRO TIP</Text>
            <Text style={[type.bodyMd, styles.proTipContent]}>
              Film at cat eye-level in good light. The cat does not need to look at the camera.
            </Text>
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

  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  greetingLeft: {
    flex: 1,
  },
  greetingTitle: {
    color: colors.onSurface,
    fontWeight: "800",
    letterSpacing: letterSpacing(18, tracking.tight),
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  greenDotGlow: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
    boxShadow: shadows.dotGlow,
  },

  catPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    boxShadow: shadows.md,
  },
  catAvatarContainer: {
    position: "relative",
  },
  catAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
  },
  avatarOnlineDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
  },
  catPillTexts: {
    paddingRight: 4,
  },
  readyText: {
    color: colors.secondary,
    fontSize: 10,
    marginTop: 1,
  },

  heroSection: {
    position: "relative",
    borderRadius: radius.lg,
    padding: spacing.lg,
    overflow: "hidden",
    boxShadow: shadows.xl,
  },
  heroTopBadges: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  dayBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
    boxShadow: shadows.sm,
  },
  newProfileBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.6),
  },
  heroImageBox: {
    position: "relative",
    width: "100%",
    height: 176,
    borderRadius: radius.base,
    overflow: "hidden",
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.8),
    marginBottom: spacing.md,
    boxShadow: shadows.inner,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  imageGradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  acousticReadyBadge: {
    position: "absolute",
    bottom: 10,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.9),
  },
  heroTitle: {
    color: colors.onSurface,
    fontWeight: "800",
    letterSpacing: letterSpacing(26, tracking.tight),
    lineHeight: 32,
  },
  heroSubtitle: {
    color: colors.onSurfaceVariant,
    marginTop: 6,
    lineHeight: 22,
  },
  heroButtons: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },

  cardContainer: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainer,
    padding: spacing.lg,
    boxShadow: shadows.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: "center",
    justifyContent: "center",
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
  },

  clipsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: spacing.md,
  },
  clipCardActive: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    padding: 12,
    borderRadius: radius.base,
    backgroundColor: colors.surfaceContainerHigh,
    boxShadow: "0 4px 16px rgba(255,176,32,0.18)",
  },
  clipNumberCircleActive: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 12px rgba(255,176,32,0.6)",
  },
  nextBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.primaryContainer, 0.2),
  },

  clipCardLocked: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    padding: 12,
    borderRadius: radius.base,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.5),
    opacity: 0.6,
  },
  clipNumberCircleLocked: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: "center",
    justifyContent: "center",
  },
  lockedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
  },

  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: radius.base,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.6),
  },
  infoBannerText: {
    flex: 1,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },

  habitsEmptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.base,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.4),
  },
  hourglassCircle: {
    position: "relative",
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    boxShadow: shadows.inner,
  },
  analyticsSubBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: colors.secondaryContainer,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadows.sm,
  },
  habitsEmptyDesc: {
    color: colors.onSurfaceVariant,
    textAlign: "center",
    marginTop: 4,
    maxWidth: 240,
    lineHeight: 18,
  },
  behaviorTagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: spacing.md,
  },
  behaviorTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerHighest, 0.8),
  },
  behaviorTagText: {
    color: colors.onSurfaceVariant,
    fontSize: 11,
  },

  proTipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerHigh,
    boxShadow: shadows.md,
    marginBottom: 8,
  },
  proTipIconCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.primaryContainer, 0.2),
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  proTipTextColumn: {
    flex: 1,
  },
  proTipLabel: {
    color: colors.primary,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: letterSpacing(12, tracking.wider),
  },
  proTipContent: {
    color: colors.onSurface,
    lineHeight: 22,
    marginTop: 2,
  },
});

