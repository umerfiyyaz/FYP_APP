import { useEffect, useRef } from "react";
import { Animated, Easing, Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressScale } from "@/components/animations/PressScale";
import { Icon, IconName } from "@/components/ui/Icon";
import { colors, radius, type, withAlpha } from "@/theme";

type Props = {
  visible: boolean;
  icon: IconName;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  /** danger = coral (delete), warm = orange (sign out). */
  tone?: "danger" | "warm";
  onConfirm: () => void;
  onCancel: () => void;
};

/** Bottom confirmation sheet (same look as the "Remove this result?" sheet). Native-thread animation. */
export function ConfirmSheet({
  visible,
  icon,
  title,
  message,
  confirmLabel,
  cancelLabel,
  tone = "danger",
  onConfirm,
  onCancel,
}: Props) {
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: visible ? 220 : 160,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [visible, anim]);

  const danger = tone === "danger";
  const accent = danger ? colors.error : colors.primaryContainer;
  const accentText = danger ? "#690005" : colors.onPrimary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(13,7,47,0.75)",
            opacity: anim,
          }}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={onCancel}
            accessibilityLabel="Close"
          />
        </Animated.View>
        <Animated.View
          style={{
            marginHorizontal: 16,
            marginBottom: insets.bottom + 16,
            padding: 24,
            paddingTop: 12,
            borderRadius: radius.lg,
            backgroundColor: colors.surfaceContainer,
            alignItems: "center",
            boxShadow: "0 20px 25px -5px rgba(13,7,47,0.6)",
            opacity: anim,
            transform: [
              {
                translateY: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [60, 0],
                }),
              },
            ],
          }}
        >
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: withAlpha(colors.onSurface, 0.2),
            }}
          />
          <View
            style={{
              marginTop: 20,
              width: 64,
              height: 64,
              borderRadius: 32,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: danger
                ? withAlpha(colors.errorContainer, 0.7)
                : withAlpha(colors.primaryContainer, 0.18),
            }}
          >
            <Icon name={icon} size={30} color={accent} />
          </View>
          <Text
            style={[
              type.headlineSm,
              { color: colors.onSurface, marginTop: 14, textAlign: "center" },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              type.bodyMd,
              {
                color: colors.onSurfaceVariant,
                textAlign: "center",
                marginTop: 6,
              },
            ]}
          >
            {message}
          </Text>
          <PressScale
            onPress={onConfirm}
            accessibilityRole="button"
            accessibilityLabel={confirmLabel}
            style={{
              alignSelf: "stretch",
              marginTop: 20,
              paddingVertical: 15,
              borderRadius: radius.full,
              alignItems: "center",
              backgroundColor: accent,
              boxShadow: `0 6px 18px ${withAlpha(accent, 0.35)}`,
            }}
          >
            <Text style={[type.labelLg, { color: accentText, fontSize: 15 }]}>
              {confirmLabel}
            </Text>
          </PressScale>
          <PressScale
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel={cancelLabel}
            style={{
              alignSelf: "stretch",
              marginTop: 10,
              paddingVertical: 15,
              borderRadius: radius.full,
              alignItems: "center",
              backgroundColor: colors.surfaceContainerHigh,
            }}
          >
            <Text
              style={[type.labelLg, { color: colors.onSurface, fontSize: 15 }]}
            >
              {cancelLabel}
            </Text>
          </PressScale>
        </Animated.View>
      </View>
    </Modal>
  );
}
