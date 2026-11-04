import { useEffect, useRef } from "react";
import { Animated, Easing, Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressScale } from "@/components/animations/PressScale";
import { Icon } from "@/components/ui/Icon";
import { colors, radius, type, withAlpha } from "@/theme";

type Props = {
  visible: boolean;
  catName: string;
  onRemove: () => void;
  onKeep: () => void;
};

/** "Remove this result?" bottom sheet. Animated on the native thread (no jank). */
export function RemoveSheet({ visible, catName, onRemove, onKeep }: Props) {
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onKeep}
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
            onPress={onKeep}
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
              backgroundColor: withAlpha(colors.errorContainer, 0.7),
            }}
          >
            <Icon name="delete-outline" size={30} color={colors.error} />
          </View>
          <Text
            style={[
              type.headlineSm,
              { color: colors.onSurface, marginTop: 14 },
            ]}
          >
            Remove this result?
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
            {`It will be deleted from ${catName}'s history. This cannot be undone.`}
          </Text>
          <PressScale
            onPress={onRemove}
            accessibilityRole="button"
            accessibilityLabel="Remove"
            style={{
              alignSelf: "stretch",
              marginTop: 20,
              paddingVertical: 15,
              borderRadius: radius.full,
              alignItems: "center",
              backgroundColor: colors.error,
              boxShadow: "0 6px 18px rgba(255,180,171,0.35)",
            }}
          >
            <Text style={[type.labelLg, { color: "#690005", fontSize: 15 }]}>
              Remove
            </Text>
          </PressScale>
          <PressScale
            onPress={onKeep}
            accessibilityRole="button"
            accessibilityLabel="Keep"
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
              Keep
            </Text>
          </PressScale>
        </Animated.View>
      </View>
    </Modal>
  );
}
