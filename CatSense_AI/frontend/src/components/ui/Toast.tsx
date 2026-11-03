import { useEffect } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/ui/Icon";
import { colors, radius, type } from "@/theme";

type Props = {
  message: string | null;
  onDone: () => void;
  bottomOffset?: number;
};

/** Small info toast ("Coming soon"). Hides itself after 2.2 s. */
export function Toast({ message, onDone, bottomOffset = 104 }: Props) {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [message, onDone]);
  if (!message) return null;
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 20,
        right: 20,
        bottom: insets.bottom + bottomOffset,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: radius.full,
          backgroundColor: colors.surfaceContainerHigh,
          boxShadow: "0 8px 20px rgba(13,7,47,0.6)",
        }}
      >
        <Icon name="info-outline" size={18} color={colors.tertiary} />
        <Text style={[type.labelLg, { color: colors.onSurface }]}>
          {message}
        </Text>
      </View>
    </View>
  );
}
