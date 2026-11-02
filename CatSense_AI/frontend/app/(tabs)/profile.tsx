import { Image, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "@/components/ui/AppHeader";
import { Icon } from "@/components/ui/Icon";
import { images } from "@/constants/images";
import { colors, radius, shadows, spacing, type, withAlpha } from "@/theme";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <AppHeader subtitle="Profile" />
      <View style={styles.content}>
        <View style={styles.avatarBorder}>
          <Image
            source={images.catMilo}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
        <Text style={[type.headlineSm, { color: colors.onSurface, marginTop: 16 }]}>
          Milo's Profile
        </Text>
        <Text style={[type.bodyMd, { color: colors.onSurfaceVariant, marginTop: 4 }]}>
          Domestic Shorthair • 3 yrs • Indoor
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.margin,
    paddingBottom: 110,
  },
  avatarBorder: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    padding: 3,
    backgroundColor: colors.primaryContainer,
    boxShadow: shadows.ctaSoft,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: radius.full,
  },
});

