import { Text, View } from "react-native";
import { router } from "expo-router";

import { Button } from "@/components/ui/Button";
import { colors, gradients, spacing, type } from "@/theme";

// Placeholder screen: password reset is not built yet
export default function ForgotPassword() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.margin,
        gap: 16,
      }}
    >
      <Text
        style={[
          type.headlineSm,
          { color: colors.onSurface, textAlign: "center" },
        ]}
      >
        Password reset is not available yet.
      </Text>
      <Button
        label="Back to sign in"
        onPress={() => router.back()}
        gradient={gradients.ctaFade}
        paddingVertical={14}
        paddingHorizontal={28}
      />
    </View>
  );
}
