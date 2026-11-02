import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { Icon } from "./Icon";
import { images } from "@/constants/images";
import { colors, radius, shadows, spacing, tracking, letterSpacing, type, withAlpha } from "@/theme";

type Props = {
  subtitle: string;
};

export function AppHeader({ subtitle }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={[
        styles.headerContainer,
        { paddingTop: Math.max(insets.top, 12) },
      ]}
    >
      <View style={styles.contentRow}>
        {/* Brand Left */}
        <View style={styles.brandRow}>
          <Image
            source={images.logoSmall}
            style={styles.mascotLogo}
            resizeMode="contain"
          />
          <View style={styles.titleColumn}>
            <Text style={[type.headlineSm, styles.brandTitle]}>CatSense AI</Text>
            <Text style={[type.labelSm, styles.screenSubtitle]}>{subtitle}</Text>
          </View>
        </View>

        {/* Actions Right */}
        <View style={styles.actionsRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={() => router.push("/alerts")}
            style={styles.notificationBtn}
          >
            <Icon name="notifications" size={20} color={colors.onSurface} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Profile settings"
            onPress={() => router.push("/(tabs)/profile")}
          >
            <LinearGradient
              colors={[colors.primaryContainer, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarBorder}
            >
              <Image
                source={images.userProfile}
                style={styles.profileAvatar}
                resizeMode="cover"
              />
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: withAlpha(colors.background, 0.9),
    paddingBottom: 10,
    zIndex: 50,
    boxShadow: "0 4px 24px rgba(13,7,47,0.45)",
  },
  contentRow: {
    height: 54,
    paddingHorizontal: spacing.margin,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  mascotLogo: {
    width: 32,
    height: 32,
  },
  titleColumn: {
    justifyContent: "center",
  },
  brandTitle: {
    color: colors.primary,
    letterSpacing: letterSpacing(18, tracking.tight),
    lineHeight: 20,
  },
  screenSubtitle: {
    color: colors.onSurfaceVariant,
    textTransform: "capitalize",
    letterSpacing: letterSpacing(10, tracking.wide),
    lineHeight: 14,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  notificationBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainer, 0.7),
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBorder: {
    padding: 2,
    borderRadius: radius.full,
  },
  profileAvatar: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
  },
});

