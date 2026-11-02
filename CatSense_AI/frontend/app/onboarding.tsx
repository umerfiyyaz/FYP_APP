// SCREEN 3 - Onboarding: sound (prototype: 3_catsense_ai._onboarding_sound) = onboarding step 2 of 3
// Screen 4 (onboarding step 3, health baseline) will be added later in this same route / file.
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { Pulse } from "@/components/animations/Pulse";
import { FeatureCard } from "@/components/cards/FeatureCard";
import {
  MiniEqualizer,
  SoundBars,
  WaveBar,
} from "@/components/charts/Waveform";
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

// Heights / colours / delays of the 7 bouncing bars (same as the prototype).
const WAVE_BARS: WaveBar[] = [
  { width: 4, height: 12, color: colors.primaryContainer, delay: 0 },
  { width: 4, height: 20, color: colors.primary, delay: 120 },
  { width: 4, height: 28, color: colors.secondary, delay: 240 },
  { width: 6, height: 32, color: colors.primaryContainer, delay: 80 },
  { width: 4, height: 24, color: colors.secondary, delay: 200 },
  { width: 4, height: 16, color: colors.primary, delay: 310 },
  { width: 4, height: 8, color: colors.primaryContainer, delay: 150 },
];

const EQ_BARS: WaveBar[] = [
  { width: 4, height: 12, color: colors.secondary, delay: 0 },
  { width: 4, height: 20, color: colors.secondary, delay: 150 },
  { width: 4, height: 8, color: colors.secondary, delay: 300 },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [playing, setPlaying] = useState(false);

  // TODO: Skip behaviour to be confirmed. Continue goes to screen 4 (step 3 of 3) once it exists.
  const goNext = () => router.replace("/(tabs)/home");

  return (
    <Screen>
      {/* Top bar: step chip + Skip */}
      <View style={styles.topBar}>
        <View style={styles.stepChip}>
          <Pulse>
            <View style={styles.stepDot} />
          </Pulse>
          <Text style={[type.labelSm, styles.stepText]}>Step 2 of 3</Text>
        </View>
        <Text
          onPress={goNext}
          accessibilityRole="button"
          style={[type.labelMd, styles.skip]}
        >
          Skip
        </Text>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Glow
          size={176}
          color={colors.primaryContainer}
          opacity={0.2}
          style={{ top: -40, right: -40 }}
        />
        <Glow
          size={160}
          color={colors.tertiaryContainer}
          opacity={0.15}
          style={{ bottom: -32, left: -32 }}
        />

        <LinearGradient
          colors={[
            withAlpha(colors.primaryContainer, 0.4),
            colors.surfaceContainerHigh,
            "transparent",
          ]}
          style={styles.heroImageRing}
        >
          <Image
            source={images.headphones}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.acousticBadge}>
            <Icon name="graphic-eq" size={14} color={colors.primary} />
            <Text
              style={[
                type.labelSm,
                {
                  color: colors.primary,
                  letterSpacing: letterSpacing(10, tracking.wide),
                },
              ]}
            >
              Acoustic AI
            </Text>
          </View>
        </LinearGradient>

        <SoundBars bars={WAVE_BARS} />
      </View>

      {/* Title */}
      <View style={styles.titleBox}>
        <Text style={[type.headlineXlMobile, styles.title]}>
          Hear what your cat feels
        </Text>
        <Text style={[type.bodyMd, styles.subtitle]}>
          CatSense AI listens to the sound in your video and tells you the mood:
          purring, happy, hungry, angry or in pain.
        </Text>
      </View>

      {/* Feature cards */}
      <View style={styles.features}>
        <FeatureCard
          communityIcon="heart-pulse"
          iconColor={colors.error}
          iconBackground={withAlpha(colors.errorContainer, 0.3)}
          title="Pain sound detection"
          badge="Priority"
          badgeBackground={colors.errorContainer}
          badgeColor={colors.onErrorContainer}
          description="Flags strained vocalizations, guttural groans, or subtle acoustic distress signatures instantly."
        />
        <FeatureCard
          icon="sentiment-very-satisfied"
          iconColor={colors.tertiary}
          iconBackground={withAlpha(colors.tertiaryContainer, 0.3)}
          title="Sound mood analysis"
          badge="10 Moods"
          badgeBackground={colors.surfaceVariant}
          badgeColor={colors.tertiary}
          description="Classifies into one of 10 clinical feline emotional states backed by confidence telemetry."
        />
        <FeatureCard
          icon="verified-user"
          iconColor={colors.secondary}
          iconBackground={withAlpha(colors.secondaryContainer, 0.2)}
          title="No usable sound?"
          badge="Zero Hallucination"
          badgeBackground={withAlpha(colors.secondaryContainer, 0.3)}
          badgeColor={colors.secondaryFixed}
          description="We openly say so and never fabricate answers when acoustic signals are obscured."
        />
      </View>

      {/* Sample player */}
      <View style={styles.sample}>
        <Pressable
          onPress={() => setPlaying((p) => !p)} // TODO: play a real audio sample
          accessibilityRole="button"
          accessibilityLabel="Play acoustic audio sample"
          style={[
            styles.playButton,
            playing && {
              boxShadow: `${shadows.lg}, 0 0 0 2px ${colors.primary}`,
            },
          ]}
        >
          <Icon
            name={playing ? "pause" : "play-arrow"}
            size={24}
            color={colors.onPrimaryContainer}
          />
        </Pressable>

        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={styles.sampleTitleRow}>
            <Text
              style={[
                type.labelSm,
                {
                  color: colors.secondary,
                  textTransform: "uppercase",
                  letterSpacing: letterSpacing(10, tracking.wider),
                },
              ]}
            >
              Verified Sample
            </Text>
            <View style={styles.sampleDot} />
            <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
              Low Purr
            </Text>
          </View>
          <Text
            numberOfLines={1}
            style={[type.labelMd, { color: colors.onSurface }]}
          >
            98.4% Relaxed Contentment
          </Text>
        </View>

        <MiniEqualizer bars={EQ_BARS} />
      </View>

      {/* Continue */}
      <Button
        label="Continue"
        icon="arrow-forward"
        onPress={goNext}
        gradient={gradients.ctaFade}
        paddingVertical={16}
        paddingHorizontal={24}
        shadow={shadows.xl}
        style={{ marginBottom: spacing.md }}
      />

      {/* Sign in link */}
      <View style={styles.signInRow}>
        <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
          Already have an account?{" "}
        </Text>
        <Text
          onPress={() => router.replace("/(auth)/login")}
          accessibilityRole="button"
          style={[type.labelMd, { color: colors.primary, marginLeft: 4 }]}
        >
          Sign in
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  stepChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    boxShadow: shadows.inner,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
  },
  stepText: {
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: letterSpacing(10, tracking.wider),
  },
  skip: {
    color: colors.onSurfaceVariant,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
  },

  hero: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainer,
    overflow: "hidden",
    boxShadow: shadows.xxl,
  },
  heroImageRing: {
    width: 176,
    height: 176,
    padding: 4,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadows.lg,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    borderRadius: radius.full,
  },
  acousticBadge: {
    position: "absolute",
    bottom: -8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLowest,
    boxShadow: shadows.md,
  },

  titleBox: {
    alignItems: "center",
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  title: {
    color: colors.onSurface,
    textAlign: "center",
    letterSpacing: letterSpacing(26, tracking.tight),
  },
  subtitle: {
    color: colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 22.75,
    marginTop: spacing.xs,
  },

  features: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  sample: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceContainerLowest,
    boxShadow: shadows.inner,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadows.lg,
  },
  sampleTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  sampleDot: {
    width: 4,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.onSurfaceVariant,
    opacity: 0.6,
  },

  signInRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: spacing.sm,
  },
});
