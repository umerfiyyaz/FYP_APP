import { StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/ui/Chip";
import {
  CommunityIcon,
  CommunityIconName,
  Icon,
  IconName,
} from "@/components/ui/Icon";
import { colors, radius, shadows, type } from "@/theme";

type Props = {
  /** Use `icon` for MaterialIcons or `communityIcon` for MaterialCommunityIcons. */
  icon?: IconName;
  communityIcon?: CommunityIconName;
  iconColor: string;
  iconBackground: string;
  title: string;
  badge: string;
  badgeBackground: string;
  badgeColor: string;
  description: string;
};

/** Rounded feature row used on the onboarding screens (icon, title + badge, 2-line text). */
export function FeatureCard({
  icon,
  communityIcon,
  iconColor,
  iconBackground,
  title,
  badge,
  badgeBackground,
  badgeColor,
  description,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: iconBackground }]}>
        {icon && <Icon name={icon} size={20} color={iconColor} />}
        {communityIcon && (
          <CommunityIcon name={communityIcon} size={20} color={iconColor} />
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={[type.headlineSm, styles.title]}>
            {title}
          </Text>
          <Badge
            label={badge}
            background={badgeBackground}
            color={badgeColor}
          />
        </View>
        <Text
          numberOfLines={2}
          style={[type.bodySm, { color: colors.onSurfaceVariant }]}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    padding: 16,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceContainerHigh,
    boxShadow: shadows.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
    marginBottom: 4,
  },
  title: {
    flexShrink: 1,
    color: colors.onSurface,
  },
});
