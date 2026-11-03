import { useEffect } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressScale } from "@/components/animations/PressScale";
import { Icon } from "@/components/ui/Icon";
import { colors, radius, type, withAlpha } from "@/theme";

type Props = {
  visible: boolean;
  message?: string;
  onUndo: () => void;
  onDone: () => void;
  /** Distance above the floating tab bar. */
  bottomOffset?: number;
};

/** "Result removed  [Undo]" toast. Hides itself after 5 seconds. */
export function UndoToast({
  visible,
  message = "Result removed",
  onUndo,
  onDone,
  bottomOffset = 104,
}: Props) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onDone, 5000);
    return () => clearTimeout(t);
  }, [visible, onDone]);

  if (!visible) return null;
  return (
    <View
      pointerEvents="box-none"
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
          justifyContent: "space-between",
          paddingVertical: 10,
          paddingLeft: 16,
          paddingRight: 10,
          borderRadius: radius.full,
          backgroundColor: colors.surfaceContainerHigh,
          boxShadow: "0 8px 20px rgba(13,7,47,0.6)",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Icon
            name="check-circle-outline"
            size={20}
            color={colors.secondary}
          />
          <Text style={[type.labelLg, { color: colors.onSurface }]}>
            {message}
          </Text>
        </View>
        <PressScale
          onPress={onUndo}
          accessibilityRole="button"
          accessibilityLabel="Undo"
          style={{
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: radius.full,
            backgroundColor: withAlpha(colors.secondaryContainer, 0.45),
          }}
        >
          <Text style={[type.labelMd, { color: colors.secondary }]}>Undo</Text>
        </PressScale>
      </View>
    </View>
  );
}
