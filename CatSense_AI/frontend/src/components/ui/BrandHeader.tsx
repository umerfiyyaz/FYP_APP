import { Image, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressScale } from "@/components/animations/PressScale";
import { Icon } from "@/components/ui/Icon";
import { images } from "@/constants/images";
import { colors, spacing, type, withAlpha } from "@/theme";
import { go } from "@/utils/nav";

type Props = {
  subtitle: string;
  hasAlert?: boolean;
  /** Shows a back arrow before the logo (screens that are not tabs). */
  onBack?: () => void;
  /** Default: open the Alerts screen. */
  onBell?: () => void;
};

/** Top bar of the main tabs: logo + title, bell, profile photo. Fixed (outside the scroll). */
export function BrandHeader({ subtitle, hasAlert, onBack, onBell }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: colors.background,
        boxShadow: "0 4px 24px rgba(13,7,47,0.45)",
        zIndex: 10,
      }}
    >
      <View
        style={{
          height: 64,
          paddingHorizontal: spacing.margin,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
          }}
        >
          {onBack ? (
            <PressScale
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Back"
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 2,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: withAlpha(colors.surfaceContainer, 0.7),
              }}
            >
              <Icon name="arrow-back" size={22} />
            </PressScale>
          ) : null}
          <Image
            source={images.mascot}
            style={{ width: 34, height: 34 }}
            resizeMode="contain"
          />
          <View>
            <Text
              style={[
                type.headlineSm,
                { color: colors.primary, lineHeight: 20 },
              ]}
            >
              CatSense AI
            </Text>
            <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
              {subtitle}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
          }}
        >
          <PressScale
            onPress={onBell ?? (() => go("/alerts"))}
            accessibilityRole="button"
            accessibilityLabel="Alerts"
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: withAlpha(colors.surfaceContainer, 0.7),
            }}
          >
            <Icon name="notifications-none" size={22} />
            {hasAlert ? (
              <View
                style={{
                  position: "absolute",
                  top: 11,
                  right: 12,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.error,
                }}
              />
            ) : null}
          </PressScale>
          <PressScale
            onPress={() => go("/(tabs)/profile")}
            accessibilityLabel="Profile"
          >
            <LinearGradient
              colors={[colors.primaryContainer, colors.secondary]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={{ padding: 2, borderRadius: 20 }}
            >
              <Image
                source={images.catEdit}
                style={{ width: 32, height: 32, borderRadius: 16 }}
              />
            </LinearGradient>
          </PressScale>
        </View>
      </View>
    </View>
  );
}
