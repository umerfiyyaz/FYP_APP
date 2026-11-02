import { StyleSheet, Text, View } from "react-native";
import { AppHeader } from "@/components/ui/AppHeader";
import { Icon } from "@/components/ui/Icon";
import { colors, radius, spacing, type, withAlpha } from "@/theme";

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <AppHeader subtitle="History" />
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Icon name="schedule" size={32} color={colors.primary} />
        </View>
        <Text style={[type.headlineSm, { color: colors.onSurface, marginTop: 16 }]}>
          No scan history yet
        </Text>
        <Text
          style={[
            type.bodyMd,
            { color: colors.onSurfaceVariant, textAlign: "center", maxWidth: 260, marginTop: 6 },
          ]}
        >
          Your daily sessions, behavior timelines, and sound moods will appear here.
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
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerHigh, 0.7),
    alignItems: "center",
    justifyContent: "center",
  },
});

