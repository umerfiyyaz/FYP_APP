// Sign up, step 2: the user types the 6 digit code that was emailed to them.
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { InsetField } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import {
  errorMessage,
  resendCode,
  signOut,
  useCurrentUser,
  verifyEmail,
} from "@/services/auth";
import { catActions } from "@/store/catStore";
import { colors, gradients, shadows, spacing, type, withAlpha } from "@/theme";

const RESEND_SECONDS = 60;

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { next } = useLocalSearchParams<{ next?: string }>();
  const user = useCurrentUser();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [wait, setWait] = useState(RESEND_SECONDS); // a code was just sent, a new one only after this many seconds

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  // After sign up: push the add-cat screen so that Back returns to this screen (then to Sign up).
  const goNext = () =>
    next === "add-cat"
      ? router.push("/add-cat" as never)
      : router.replace("/(tabs)/home" as never);

  const onVerify = async () => {
    if (loading) return;
    const value = code.trim();
    if (!/^\d{6}$/.test(value)) {
      setError("Enter the 6 digit code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await verifyEmail(value);
      await catActions.hydrate();
      goNext();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (wait > 0) return;
    setError("");
    setInfo("");
    try {
      await resendCode();
      setWait(RESEND_SECONDS);
      setInfo("A new code was sent to your email.");
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  const useAnotherEmail = async () => {
    await signOut();
    router.replace("/(auth)/login" as never);
  };

  // Came back here with Back after the email was already verified: nothing to type any more.
  if (user?.email_verified) {
    return (
      <Screen>
        <View
          style={{
            gap: 20,
            paddingTop: 80,
            paddingHorizontal: spacing.margin,
            alignItems: "center",
          }}
        >
          <Icon name="verified-user" size={40} color={colors.primary} />
          <Text
            style={[
              type.headlineMd,
              { color: colors.onSurface, textAlign: "center" },
            ]}
          >
            Email verified
          </Text>
          <Text
            style={[
              type.bodyMd,
              { color: colors.onSurfaceVariant, textAlign: "center" },
            ]}
          >
            {user.email}
          </Text>
          <Button
            label="Continue"
            icon="arrow-forward"
            onPress={goNext}
            gradient={gradients.ctaVertical}
            paddingVertical={14}
            paddingHorizontal={24}
            shadow={shadows.cta}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View
        style={{ gap: 20, paddingTop: 56, paddingHorizontal: spacing.margin }}
      >
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
            <Icon name="verified-user" size={30} color={colors.primary} />
          </View>
          <Text
            style={[
              type.headlineMd,
              { color: colors.onSurface, textAlign: "center" },
            ]}
          >
            Verify your email
          </Text>
          <Text
            style={[
              type.bodyMd,
              { color: colors.onSurfaceVariant, textAlign: "center" },
            ]}
          >
            We sent a 6 digit code to
          </Text>
          <Text
            style={[
              type.labelLg,
              { color: colors.primary, textAlign: "center" },
            ]}
          >
            {user?.email ?? "your email"}
          </Text>
        </View>

        <View>
          <InsetField
            leftIcon="verified-user"
            iconGap={10}
            value={code}
            onChangeText={(v) => {
              setCode(v.replace(/\D/g, "").slice(0, 6));
              setError("");
            }}
            placeholder="6 digit code"
            placeholderTextColor={colors.surfaceContainerHighest}
            keyboardType="number-pad"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="oneTimeCode"
            maxLength={6}
          />
          <FieldError text={error} />
          {info ? (
            <Text
              style={[type.bodySm, { color: colors.secondary, marginTop: 6 }]}
            >
              {info}
            </Text>
          ) : null}
        </View>

        <Button
          label={loading ? "Please wait..." : "Verify"}
          icon="arrow-forward"
          onPress={onVerify}
          gradient={gradients.ctaVertical}
          paddingVertical={14}
          paddingHorizontal={24}
          shadow={shadows.cta}
        />

        <View style={{ alignItems: "center", gap: 14 }}>
          <Text
            onPress={onResend}
            accessibilityRole="button"
            style={[
              type.labelMd,
              { color: wait > 0 ? colors.onSurfaceVariant : colors.primary },
            ]}
          >
            {wait > 0 ? `Resend code in ${wait}s` : "Resend code"}
          </Text>
          <Text
            onPress={useAnotherEmail}
            accessibilityRole="button"
            style={[type.labelMd, { color: colors.onSurfaceVariant }]}
          >
            Use a different email
          </Text>
        </View>
      </View>
    </Screen>
  );
}
