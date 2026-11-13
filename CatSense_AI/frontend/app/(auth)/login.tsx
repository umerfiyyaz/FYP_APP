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
import { ApiError, USE_MOCK } from "@/services/api";
import { errorMessage, isEmailTaken, signIn, signUp } from "@/services/auth";
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

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  form?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Checks every field on the phone, so all the problems are shown together, each under its own field. */
function checkFields(mode: Mode, email: string, password: string): FieldErrors {
  const out: FieldErrors = {};
  if (!email.trim()) out.email = "Enter your email address";
  else if (!EMAIL_RE.test(email.trim()))
    out.email = "Enter a valid email address";

  if (!password) out.password = "Enter your password";
  else if (mode === "register") {
    if (password.length < 8)
      out.password = "Password must contain at least 8 characters";
    else if (!/[A-Za-z]/.test(password) || !/\d/.test(password))
      out.password = "Password must contain both letters and numbers";
  }
  return out;
}

/** Turns the server's answer into one message per field (email problems under email, password under password). */
function serverErrors(e: unknown): FieldErrors {
  if (!(e instanceof ApiError)) return { form: errorMessage(e) };
  let detail: unknown;
  try {
    detail = JSON.parse(e.message)?.detail;
  } catch {
    /* not JSON */
  }
  if (Array.isArray(detail)) {
    const out: FieldErrors = {};
    for (const d of detail) {
      const loc = Array.isArray(d?.loc) ? d.loc : [];
      const field = String(loc[loc.length - 1] ?? "");
      const msg = String(d?.msg ?? "").replace(/^Value error,\s*/, "");
      if (field === "email")
        out.email = out.email ?? "Enter a valid email address";
      else if (field === "password")
        out.password = out.password ?? (msg || "This password is not valid");
      else if (field === "full_name")
        out.name = out.name ?? (msg || "This name is not valid");
      else out.form = out.form ?? msg;
    }
    return Object.keys(out).length ? out : { form: errorMessage(e) };
  }
  if (typeof detail === "string") {
    if (e.status === 409) return { email: detail }; // "An account with this email already exists"
    if (e.status === 401) return { password: detail }; // "Incorrect email or password"
    return { form: detail };
  }
  return { form: errorMessage(e) };
}

function FieldError({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <View style={[styles.hint, { marginTop: 6 }]}>
      <Icon name="info-outline" size={13} color={colors.error} />
      <Text style={[type.bodySm, styles.hintText, { color: colors.error }]}>
        {text}
      </Text>
    </View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState(
    DEMO_PREFILL && USE_MOCK ? "milo.guardian@whisker.ai" : "",
  );
  const [password, setPassword] = useState(
    DEMO_PREFILL && USE_MOCK ? "Meow2024!cat" : "",
  );
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const clear = (key: keyof FieldErrors) =>
    setErrors((p) => ({ ...p, [key]: undefined, form: undefined }));

  const strength = useMemo(() => passwordStrength(password), [password]);

  const onSubmit = async () => {
    if (loading) return;
    const found = checkFields(mode, email, password);

    // Sign up: also ask the server whether the email is taken, so that "already exists" and the
    // password problems appear together after ONE press. If the server cannot be reached, skip this check.
    if (mode === "register" && !USE_MOCK && !found.email) {
      setLoading(true);
      try {
        if (await isEmailTaken(email.trim()))
          found.email = "An account with this email already exists";
      } catch {
        /* the real sign-up below reports a connection problem */
      } finally {
        setLoading(false);
      }
    }

    setErrors(found);
    if (Object.keys(found).length > 0) return; // every problem is already shown under its field

    // Demo mode (no backend configured): keep the old behaviour.
    if (USE_MOCK) {
      router.push("/add-cat");
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        await signUp(email.trim(), password, fullName.trim() || undefined);
        router.replace("/add-cat"); // new account -> onboarding step 1 (add your cat)
      } else {
        await signIn(email.trim(), password);
        router.replace("/(tabs)/home");
      }
    } catch (e) {
      setErrors(serverErrors(e));
    } finally {
      setLoading(false);
    }
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
            onPress={() => {
              setMode("signin");
              setErrors({});
            }}
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
            onPress={() => {
              setMode("register");
              setErrors({});
            }}
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
          {/* Name (sign up only) */}
          {mode === "register" ? (
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text
                  style={[type.labelMd, { color: colors.onSurfaceVariant }]}
                >
                  Your name
                </Text>
              </View>
              <InsetField
                leftIcon="person"
                iconGap={10}
                value={fullName}
                onChangeText={(v) => {
                  setFullName(v);
                  clear("name");
                }}
                placeholder="e.g. Umer"
                placeholderTextColor={colors.surfaceContainerHighest}
                autoCapitalize="words"
                autoCorrect={false}
                autoComplete="name"
                textContentType="name"
                maxLength={80}
              />
              <FieldError text={errors.name} />
            </View>
          ) : null}

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
              onChangeText={(v) => {
                setEmail(v);
                clear("email");
              }}
              placeholder="you@email.com"
              placeholderTextColor={colors.surfaceContainerHighest}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
            />
            <FieldError text={errors.email} />
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
              onChangeText={(v) => {
                setPassword(v);
                clear("password");
              }}
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
            {errors.password ? (
              <FieldError text={errors.password} />
            ) : mode === "register" ? (
              <View style={styles.hintRow}>
                <View style={styles.hint}>
                  <Icon name="info-outline" size={13} color={colors.outline} />
                  <Text
                    style={[
                      type.bodySm,
                      styles.hintText,
                      { color: withAlpha(colors.onSurfaceVariant, 0.8) },
                    ]}
                  >
                    Minimum 8 characters with letters & numbers
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
            ) : null}
          </View>

          <FieldError text={errors.form} />

          {/* Buttons */}
          <View style={styles.buttons}>
            <Button
              label={
                loading
                  ? "Please wait..."
                  : mode === "signin"
                    ? "Sign in"
                    : "Create free account"
              }
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
          A private account for your cat's health insights.
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
