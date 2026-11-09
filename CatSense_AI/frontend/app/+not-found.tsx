import { Text, View } from "react-native";
import { router } from "expo-router";

import { Button } from "@/components/ui/Button";
import { colors, gradients, spacing, type } from "@/theme";

// Placeholder screen: unknown route
export default function NotFound() {
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
        This screen does not exist.
      </Text>
      <Button
        label="Go to Home"
        onPress={() => router.replace("/" as never)}
        gradient={gradients.ctaFade}
        paddingVertical={14}
        paddingHorizontal={28}
      />
    </View>
  );
}
