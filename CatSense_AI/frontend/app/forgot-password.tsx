// Forgot password: 1) email a code, 2) type the code and a new password.
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { InsetField } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { ApiError, USE_MOCK } from "@/services/api";
import { errorMessage, forgotPassword, resetPassword } from "@/services/auth";
import { colors, gradients, shadows, spacing, type, withAlpha } from "@/theme";

type Errors = {
  email?: string;
  code?: string;
  password?: string;
  form?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_SECONDS = 60;

/** Turns the server's answer into messages under the right field. */
function fromServer(e: unknown): Errors {
  if (!(e instanceof ApiError)) return { form: errorMessage(e) };
  let detail: unknown;
  try {
    detail = JSON.parse(e.message)?.detail;
  } catch {
    /* not JSON */
  }
  if (Array.isArray(detail)) {
    const out: Errors = {};
    for (const d of detail) {
      const loc = Array.isArray(d?.loc) ? d.loc : [];
      const field = String(loc[loc.length - 1] ?? "");
      const msg = String(d?.msg ?? "").replace(/^Value error,\s*/, "");
      if (field === "email") out.email = out.email ?? msg;
      else if (field === "code") out.code = out.code ?? msg;
      else if (field === "new_password") out.password = out.password ?? msg;
      else out.form = out.form ?? msg;
    }
    return Object.keys(out).length ? out : { form: errorMessage(e) };
  }
  if (typeof detail === "string")
    return e.status === 400 ? { code: detail } : { form: detail };
  return { form: errorMessage(e) };
}

export default function ForgotPassword() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();

  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState(String(params.email ?? ""));
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const clear = (key: keyof Errors) =>
    setErrors((p) => ({ ...p, [key]: undefined, form: undefined }));

  const sendCode = async (again = false) => {
    if (loading) return;
    const value = email.trim();
    if (!value) return setErrors({ email: "Enter your email address" });
    if (!EMAIL_RE.test(value))
      return setErrors({ email: "Enter a valid email address" });
    setLoading(true);
    setErrors({});
    setInfo("");
    try {
      await forgotPassword(value);
      setStep("reset");
      setWait(RESEND_SECONDS);
      if (again) setInfo("If this email has an account, a new code was sent.");
    } catch (e) {
      setErrors(fromServer(e));
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async () => {
    if (loading) return;
    const found: Errors = {};
    if (!/^\d{6}$/.test(code.trim())) found.code = "Enter the 6 digit code";
    if (!password) found.password = "Enter your new password";
    else if (password.length < 8)
      found.password = "Password must contain at least 8 characters";
    else if (!/[A-Za-z]/.test(password) || !/\d/.test(password))
      found.password = "Password must contain both letters and numbers";
    setErrors(found);
    if (Object.keys(found).length > 0) return; // all problems are shown together

    setLoading(true);
    try {
      await resetPassword(email.trim(), code.trim(), password);
      Alert.alert(
        "Password changed",
        "Please sign in with your new password.",
        [
          {
            text: "Sign in",
            onPress: () => router.replace("/(auth)/login" as never),
          },
        ],
      );
    } catch (e) {
      setErrors(fromServer(e));
    } finally {
      setLoading(false);
    }
  };

  if (USE_MOCK) {
    return (
      <Screen>
        <View
          style={{
            gap: 16,
            paddingTop: 80,
            paddingHorizontal: spacing.margin,
            alignItems: "center",
          }}
        >
          <Text
            style={[
              type.headlineSm,
              { color: colors.onSurface, textAlign: "center" },
            ]}
          >
            Password reset needs the server, so it is not available in demo
            mode.
          </Text>
          <Button
            label="Back to sign in"
            onPress={() => router.back()}
            gradient={gradients.ctaFade}
            paddingVertical={14}
            paddingHorizontal={28}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View
        style={{ gap: 20, paddingTop: 24, paddingHorizontal: spacing.margin }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityLabel="Back"
        >
          <Icon name="arrow-back" size={24} color={colors.onSurface} />
        </Pressable>

        <View style={{ alignItems: "center", gap: 10 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: withAlpha(colors.primaryContainer, 0.2),
            }}
          >
            <Icon name="lock" size={28} color={colors.primary} />
          </View>
          <Text
            style={[
              type.headlineMd,
              { color: colors.onSurface, textAlign: "center" },
            ]}
          >
            {step === "email" ? "Forgot your password?" : "Set a new password"}
          </Text>
          <Text
            style={[
              type.bodyMd,
              { color: colors.onSurfaceVariant, textAlign: "center" },
            ]}
          >
            {step === "email"
              ? "Enter your email and we will send you a 6 digit code."
              : `Enter the code we sent to ${email.trim()} and choose a new password.`}
          </Text>
        </View>

        {step === "email" ? (
          <>
            <View>
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
            <FieldError text={errors.form} />
            <Button
              label={loading ? "Please wait..." : "Send code"}
              icon="arrow-forward"
              onPress={() => sendCode(false)}
              gradient={gradients.ctaVertical}
              paddingVertical={14}
              paddingHorizontal={24}
              shadow={shadows.cta}
            />
          </>
        ) : (
          <>
            <View>
              <InsetField
                leftIcon="verified-user"
                iconGap={10}
                value={code}
                onChangeText={(v) => {
                  setCode(v.replace(/\D/g, "").slice(0, 6));
                  clear("code");
                }}
                placeholder="6 digit code"
                placeholderTextColor={colors.surfaceContainerHighest}
                keyboardType="number-pad"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="oneTimeCode"
                maxLength={6}
              />
              <FieldError text={errors.code} />
            </View>

            <View>
              <InsetField
                leftIcon="lock"
                iconGap={10}
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  clear("password");
                }}
                placeholder="New password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
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
              ) : (
                <Text
                  style={[
                    type.bodySm,
                    { color: colors.onSurfaceVariant, marginTop: 6 },
                  ]}
                >
                  Minimum 8 characters with letters & numbers
                </Text>
              )}
            </View>

            {info ? (
              <Text style={[type.bodySm, { color: colors.secondary }]}>
                {info}
              </Text>
            ) : null}
            <FieldError text={errors.form} />

            <Button
              label={loading ? "Please wait..." : "Change password"}
              icon="check"
              onPress={savePassword}
              gradient={gradients.ctaVertical}
              paddingVertical={14}
              paddingHorizontal={24}
              shadow={shadows.cta}
            />

            <View style={{ alignItems: "center", gap: 14 }}>
              <Text
                onPress={() => wait <= 0 && sendCode(true)}
                accessibilityRole="button"
                style={[
                  type.labelMd,
                  {
                    color: wait > 0 ? colors.onSurfaceVariant : colors.primary,
                  },
                ]}
              >
                {wait > 0 ? `Send a new code in ${wait}s` : "Send a new code"}
              </Text>
              <Text
                onPress={() => {
                  setStep("email");
                  setErrors({});
                  setInfo("");
                }}
                accessibilityRole="button"
                style={[type.labelMd, { color: colors.onSurfaceVariant }]}
              >
                Use a different email
              </Text>
            </View>
          </>
        )}
      </View>
    </Screen>
  );
}
