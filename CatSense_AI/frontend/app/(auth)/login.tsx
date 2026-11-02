// SCREEN 1 - Welcome / Sign in (prototype: 1_catsense_ai._welcome_sign_in)
import { useMemo, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { Pulse } from "@/components/animations/Pulse";
import { Button } from "@/components/ui/Button";
import { Glow } from "@/components/ui/Glow";
import { Icon } from "@/components/ui/Icon";
import { InsetField } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { DEMO_PREFILL } from "@/constants/config";
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

type Mode = "signin" | "register";

function passwordStrength(p: string): "" | "Weak" | "Fair" | "Strong" {
  if (!p) return "";
  let score = 0;
  if (p.length >= 8) score += 1;
  if (/[A-Za-z]/.test(p) && /\d/.test(p)) score += 1;
  if (p.length >= 12 || /[^A-Za-z0-9]/.test(p)) score += 1;
  return (["Weak", "Weak", "Fair", "Strong"] as const)[score];
}

const STRENGTH_COLOR = {
  Weak: colors.error,
  Fair: colors.primaryContainer,
  Strong: colors.secondary,
} as const;

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState(
    DEMO_PREFILL ? "milo.guardian@whisker.ai" : "",
  );
  const [password, setPassword] = useState(DEMO_PREFILL ? "Meow2024!cat" : "");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const strength = useMemo(() => passwordStrength(password), [password]);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordOk =
    password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
  const showError = submitted && (!emailOk || !passwordOk);

  const onSubmit = () => {
    setSubmitted(true);
    if (!emailOk || !passwordOk) return;
    // TODO: call the backend (sign in or register) here.
    // After a successful sign in with an existing account -> /(tabs)/home.
    // For now every submit continues with onboarding step 1 (add your cat).
    router.push("/add-cat");
  };

  return (
    <Screen contentStyle={{ overflow: "hidden" }}>
      {/* Ambient glows */}
      <Glow
        size={320}
        color={colors.primaryContainer}
        opacity={0.15}
        style={{ top: -96, alignSelf: "center" }}
      />
      <Glow
        size={256}
        color={colors.tertiaryContainer}
        opacity={0.1}
        style={{ top: 320, right: -80 }}
      />

      {/* Header: app badge + version */}
      <View style={styles.header}>
        <View style={styles.appBadge}>
          <Icon name="pets" size={18} color={colors.primaryContainer} />
          <Text style={[type.labelMd, styles.appBadgeText]}>CatSense AI</Text>
          <View style={styles.dot} />
        </View>
        <View style={styles.versionBadge}>
          <Icon name="auto-awesome" size={15} color={colors.primary} />
          <Text style={[type.labelSm, styles.versionText]}>v2.4 Pro</Text>
        </View>
      </View>

      {/* Mascot */}
      <View style={styles.mascotArea}>
        <View style={styles.mascotBox}>
          <Pulse style={styles.mascotPulse}>
            <Glow
              size={176}
              color={colors.primaryContainer}
              opacity={0.3}
              style={{ top: 0, left: 0 }}
            />
          </Pulse>
          <View style={styles.mascotRing} />
          <LinearGradient
            colors={[withAlpha(colors.primaryContainer, 0.2), "transparent"]}
            style={styles.mascotCircle}
          >
            <Image
              source={images.mascot}
              style={styles.mascotImage}
              resizeMode="contain"
            />
          </LinearGradient>
          <View style={styles.acousticChip}>
            <Icon name="graphic-eq" size={14} color={colors.secondary} />
            <Text style={[type.labelSm, { color: colors.secondary }]}>
              Acoustic AI
            </Text>
          </View>
        </View>
      </View>

      {/* Headline */}
      <View style={styles.headlineBox}>
        <Text style={[type.headlineXlMobile, styles.headline]}>
          Understand your cat in every <Text style={styles.glowText}>meow</Text>{" "}
          and <Text style={styles.glowText}>move</Text>.
        </Text>
        <Text style={[type.bodyMd, styles.subtext]}>
          CatSense AI reads behavior from video and mood from acoustic sound.
        </Text>
      </View>

      {/* Auth card */}
      <View style={styles.card}>
        {/* Sign in / Create account switch */}
        <View style={styles.switcher}>
          <Pressable
            onPress={() => setMode("signin")}
            style={[styles.tab, mode === "signin" && styles.tabActive]}
            accessibilityRole="button"
          >
            <Icon
              name="login"
              size={15}
              color={
                mode === "signin" ? colors.primary : colors.onSurfaceVariant
              }
            />
            <Text
              style={[
                type.labelMd,
                {
                  color:
                    mode === "signin"
                      ? colors.onSurface
                      : colors.onSurfaceVariant,
                },
              ]}
            >
              Sign in
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode("register")}
            style={[styles.tab, mode === "register" && styles.tabActive]}
            accessibilityRole="button"
          >
            <Icon
              name="person-add"
              size={15}
              color={
                mode === "register" ? colors.primary : colors.onSurfaceVariant
              }
            />
            <Text
              style={[
                type.labelMd,
                {
                  color:
                    mode === "register"
                      ? colors.onSurface
                      : colors.onSurfaceVariant,
                },
              ]}
            >
              Create account
            </Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          {/* Email */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={[type.labelMd, { color: colors.onSurfaceVariant }]}>
                Guardian email
              </Text>
              <View style={styles.secureTag}>
                <Icon name="verified-user" size={12} color={colors.secondary} />
                <Text style={[type.labelSm, { color: colors.secondary }]}>
                  Secure
                </Text>
              </View>
            </View>
            <InsetField
              leftIcon="alternate-email"
              iconGap={10}
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              placeholderTextColor={colors.surfaceContainerHighest}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
            />
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={[type.labelMd, { color: colors.onSurfaceVariant }]}>
                Password
              </Text>
              <Text
                onPress={() => router.push("/forgot-password")}
                accessibilityRole="button"
                style={[type.labelSm, { color: colors.primary }]}
              >
                Forgot password?
              </Text>
            </View>
            <InsetField
              leftIcon="lock"
              iconGap={10}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              textContentType={mode === "signin" ? "password" : "newPassword"}
              inputStyle={
                showPassword
                  ? undefined
                  : { letterSpacing: letterSpacing(14, tracking.widest) }
              }
              right={
                <Pressable
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? "Hide password" : "Show password"
                  }
                  style={{ marginLeft: 8, padding: 2 }}
                >
                  <Icon
                    name={showPassword ? "visibility-off" : "visibility"}
                    size={20}
                    color={colors.outline}
                  />
                </Pressable>
              }
            />
            <View style={styles.hintRow}>
              <View style={styles.hint}>
                <Icon
                  name="info-outline"
                  size={13}
                  color={showError ? colors.error : colors.outline}
                />
                <Text
                  style={[
                    type.bodySm,
                    styles.hintText,
                    {
                      color: showError
                        ? colors.error
                        : withAlpha(colors.onSurfaceVariant, 0.8),
                    },
                  ]}
                >
                  {showError && !emailOk
                    ? "Enter a valid e-mail address"
                    : "Minimum 8 characters with letters & numbers"}
                </Text>
              </View>
              {!!strength && (
                <Text
                  style={[type.labelSm, { color: STRENGTH_COLOR[strength] }]}
                >
                  {strength}
                </Text>
              )}
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <Button
              label={mode === "signin" ? "Sign in" : "Create free account"}
              icon="arrow-forward"
              onPress={onSubmit}
              gradient={gradients.ctaVertical}
              paddingVertical={14}
              paddingHorizontal={24}
              shadow={shadows.cta}
            />
            <Button
              label="Quick Passkey / Face ID"
              icon="fingerprint"
              iconPosition="left"
              iconSize={18}
              gap={8}
              color={colors.onSurface}
              iconColor={colors.secondary}
              labelStyle={type.labelMd}
              background={withAlpha(colors.surfaceContainerHigh, 0.5)}
              paddingVertical={10}
              paddingHorizontal={16}
              shadow={null}
              pressScale={0.98}
              onPress={() =>
                Alert.alert(
                  "Passkey / Face ID",
                  "This sign-in method will be added later.",
                )
              }
            />
          </View>
        </View>
      </View>

      {/* Reassurance */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Icon name="check-circle" size={16} color={colors.secondary} />
          <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
            No collar device or subscription required
          </Text>
        </View>
        <Text style={[type.bodySm, styles.footerText]}>
          Private, on-device model processing for your feline's sanctuary.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.xs,
    marginBottom: spacing.md,
  },
  appBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainer, 0.8),
    boxShadow: shadows.sm,
  },
  appBadgeText: {
    color: colors.onSurface,
    letterSpacing: letterSpacing(12, tracking.wide),
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
  },
  versionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerHigh, 0.6),
  },
  versionText: {
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: letterSpacing(10, tracking.wider),
  },

  mascotArea: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.xs,
  },
  mascotBox: {
    width: 176,
    height: 176,
    alignItems: "center",
    justifyContent: "center",
  },
  mascotPulse: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 176,
    height: 176,
    transform: [{ scale: 0.95 }],
  },
  mascotRing: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerHigh, 0.4),
  },
  mascotCircle: {
    width: 144,
    height: 144,
    borderRadius: radius.full,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadows.xxl,
  },
  mascotImage: {
    width: "100%",
    height: "100%",
  },
  acousticChip: {
    position: "absolute",
    bottom: -4,
    right: -4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerHighest, 0.9),
    boxShadow: shadows.lg,
  },

  headlineBox: {
    alignItems: "center",
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  headline: {
    color: colors.onSurface,
    textAlign: "center",
    letterSpacing: letterSpacing(26, tracking.tight),
    marginBottom: spacing.xs,
  },
  glowText: {
    color: colors.primaryContainer,
    textShadowColor: "rgba(255,176,32,0.55)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtext: {
    color: colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 22.75,
    maxWidth: 320,
  },

  card: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: withAlpha(colors.surfaceContainer, 0.9),
    boxShadow: shadows.xlDeep,
  },
  switcher: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    marginBottom: spacing.lg,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLowest,
    boxShadow: shadows.inner,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  tabActive: {
    backgroundColor: colors.surfaceContainerHigh,
    boxShadow: shadows.md,
  },
  form: {
    gap: spacing.md,
  },
  fieldGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  secureTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 6,
    paddingTop: 2,
  },
  hint: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  hintText: {
    flex: 1,
  },
  buttons: {
    paddingTop: spacing.xs,
    gap: spacing.sm,
  },

  footer: {
    alignItems: "center",
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  footerText: {
    color: withAlpha(colors.onSurfaceVariant, 0.7),
    textAlign: "center",
  },
});
