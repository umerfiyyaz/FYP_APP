import { Text, View } from "react-native";
import { router } from "expo-router";

import { Button } from "@/components/ui/Button";
import { colors, gradients, spacing, type } from "@/theme";

// Placeholder screen: settings are not built yet
export default function Settings() {
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
        Settings are coming soon.
      </Text>
      <Button
        label="Back"
        onPress={() => router.back()}
        gradient={gradients.ctaFade}
        paddingVertical={14}
        paddingHorizontal={28}
      />
    </View>
  );
}
