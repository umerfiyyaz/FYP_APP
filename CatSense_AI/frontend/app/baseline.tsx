// SCREEN 4 - Onboarding: Health Baseline (prototype: 4_catsense_ai._onboarding_health_baseline) = onboarding step 3 of 3
import { Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Svg, { Circle } from "react-native-svg";

import { Button } from "@/components/ui/Button";
import { Glow } from "@/components/ui/Glow";
import { Icon } from "@/components/ui/Icon";
import { Screen } from "@/components/ui/Screen";
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

type GaugeProps = {
  value: string;
  unit?: string;
  percentage: number;
  label: string;
  subtitle: string;
  strokeColor: string;
};

function CircularGauge({
  value,
  unit,
  percentage,
  label,
  subtitle,
  strokeColor,
}: GaugeProps) {
  const r = 15.9155;
  const circumference = 100;
  const strokeDashoffset = circumference - percentage;

  return (
    <View style={styles.gaugeCard}>
      <View style={styles.gaugeContainer}>
        <Svg width={64} height={64} viewBox="0 0 36 36">
          <Circle
            cx={18}
            cy={18}
            r={r}
            fill="none"
            stroke={colors.surfaceVariant}
            strokeWidth={3.5}
          />
          <Circle
            cx={18}
            cy={18}
            r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth={3.5}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            originX={18}
            originY={18}
            rotation={-90}
          />
        </Svg>
        <View style={styles.gaugeValueBox}>
          <Text style={[type.headlineSm, { color: strokeColor }]}>
            {value}
            {unit && <Text style={[type.labelSm, { color: strokeColor }]}>{unit}</Text>}
          </Text>
        </View>
      </View>
      <Text style={[type.labelMd, { color: colors.onSurface, marginTop: 4 }]}>{label}</Text>
      <Text numberOfLines={1} style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
        {subtitle}
      </Text>
    </View>
  );
}

export default function BaselineScreen() {
  const router = useRouter();

  const onStart = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <Screen>
      {/* Progress Header */}
      <View style={styles.progressHeader}>
        <View style={styles.stepInfoRow}>
          <Text style={[type.labelMd, styles.stepTag]}>Step 3 of 3</Text>
          <Text style={styles.bullet}>•</Text>
          <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
            Baseline Lock
          </Text>
        </View>

        {/* Indicator dots: 2 small, 1 active elongated bar */}
        <View style={styles.dotsRow}>
          <View style={styles.dotInactive} />
          <View style={styles.dotInactive} />
          <View style={styles.dotActive} />
        </View>
      </View>

      {/* Hero Calibrated Card */}
      <View style={styles.heroCard}>
        <LinearGradient
          colors={[colors.surfaceContainerHigh, colors.surfaceContainer]}
          style={StyleSheet.absoluteFill}
        />
        <Glow
          size={176}
          color={colors.secondary}
          opacity={0.15}
          style={{ top: -48, right: -48 }}
        />
        <Glow
          size={144}
          color={colors.primaryContainer}
          opacity={0.1}
          style={{ bottom: -40, left: -40 }}
        />

        {/* Profile Badge Pill */}
        <View style={styles.profileBadgePill}>
          <View style={styles.catAvatarBox}>
            <Image
              source={images.catBaseline}
              style={styles.catAvatarImg}
              resizeMode="cover"
            />
          </View>
          <View style={styles.badgeTextRow}>
            <Text style={[type.labelMd, { color: colors.onSurface }]}>Milo</Text>
            <View style={styles.mintDot} />
            <Text style={[type.bodySm, { color: colors.secondaryFixed }]}>
              Acoustic &amp; Motion Calibrated
            </Text>
          </View>
        </View>

        {/* Dual Mini Gauges */}
        <View style={styles.gaugesRow}>
          <CircularGauge
            value="94%"
            percentage={94}
            label="Normal"
            subtitle="Wellbeing Baseline Lock"
            strokeColor={colors.secondary}
          />
          <CircularGauge
            value="14.2"
            unit="h"
            percentage={82}
            label="Target"
            subtitle="Rest Cycle Optimal"
            strokeColor={colors.tertiaryFixedDim ?? colors.tertiary}
          />
        </View>
      </View>

      {/* Header & Description */}
      <View style={styles.titleBox}>
        <Text style={[type.headlineXlMobile, styles.title]}>
          Spot changes early
        </Text>
        <Text style={[type.bodyMd, styles.subtitle]}>
          After a few videos CatSense learns Milo’s normal and warns you when something changes.
        </Text>
      </View>

      {/* Feature Cards Stack */}
      <View style={styles.featuresStack}>
        {/* Feature 1 */}
        <View style={styles.featureCard}>
          <View
            style={[
              styles.featureIconCircle,
              { backgroundColor: withAlpha(colors.secondary, 0.15) },
            ]}
          >
            <Icon name="trending-up" size={20} color={colors.secondary} />
          </View>
          <View style={styles.featureContent}>
            <Text style={[type.labelLg, { color: colors.onSurface }]}>
              Personal baseline
            </Text>
            <Text style={[type.bodyMd, styles.featureDesc]}>
              Learns Milo’s own daily pattern from his earlier videos.
            </Text>
          </View>
        </View>

        {/* Feature 2 */}
        <View style={styles.featureCard}>
          <View
            style={[
              styles.featureIconCircle,
              { backgroundColor: withAlpha(colors.primaryContainer, 0.2) },
            ]}
          >
            <Icon name="notifications-active" size={20} color={colors.primary} />
          </View>
          <View style={styles.featureContent}>
            <Text style={[type.labelLg, { color: colors.onSurface }]}>
              Early alerts
            </Text>
            <Text style={[type.bodyMd, styles.featureDesc]}>
              Notifies you promptly when risk reaches Medium or High.
            </Text>
          </View>
        </View>

        {/* Feature 3 */}
        <View style={styles.featureCard}>
          <View
            style={[
              styles.featureIconCircle,
              { backgroundColor: withAlpha(colors.tertiaryContainer, 0.2) },
            ]}
          >
            <Icon name="medical-services" size={20} color={colors.tertiary} />
          </View>
          <View style={styles.featureContent}>
            <Text style={[type.labelLg, { color: colors.onSurface }]}>
              Always a guide, not a diagnosis
            </Text>
            <Text style={[type.bodyMd, styles.featureDesc]}>
              Talk to your trusted vet about any underlying health worries.
            </Text>
          </View>
        </View>
      </View>

      {/* Primary CTA & Microcopy */}
      <View style={styles.bottomCtaSection}>
        <Button
          label="Get started with Milo"
          icon="arrow-forward"
          onPress={onStart}
          gradient={gradients.ctaFade}
          paddingVertical={16}
          paddingHorizontal={24}
          shadow={shadows.cta}
          style={{ width: "100%" }}
        />
        <View style={styles.timerRow}>
          <Icon name="timer" size={14} color={colors.onSurfaceVariant} />
          <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
            Takes less than 1 minute
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  stepInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stepTag: {
    color: colors.secondary,
    textTransform: "uppercase",
    letterSpacing: letterSpacing(12, tracking.wider),
  },
  bullet: {
    color: colors.outline,
    fontSize: 14,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dotInactive: {
    width: 8,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
  },
  dotActive: {
    width: 24,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    boxShadow: shadows.sm,
  },

  heroCard: {
    position: "relative",
    overflow: "hidden",
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    boxShadow: shadows.xl,
  },
  profileBadgePill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.8),
    marginBottom: spacing.md,
    boxShadow: shadows.inner,
  },
  catAvatarBox: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  catAvatarImg: {
    width: "100%",
    height: "100%",
  },
  badgeTextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingRight: spacing.xs,
  },
  mintDot: {
    width: 4,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
  },

  gaugesRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  gaugeCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.6),
    boxShadow: shadows.md,
  },
  gaugeContainer: {
    position: "relative",
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  gaugeValueBox: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  titleBox: {
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.onSurface,
    letterSpacing: letterSpacing(26, tracking.tight),
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },

  featuresStack: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainer,
    boxShadow: shadows.md,
  },
  featureIconCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  featureContent: {
    flex: 1,
  },
  featureDesc: {
    color: colors.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 20,
  },

  bottomCtaSection: {
    alignItems: "center",
    gap: spacing.xs,
    marginTop: "auto",
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
});
