import { Tabs } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { Icon, IconName } from "@/components/ui/Icon";
import { colors, radius, shadows, spacing, type, withAlpha } from "@/theme";

type TabConfig = {
  name: string;
  label: string;
  icon: IconName;
};

const TABS: TabConfig[] = [
  { name: "home", label: "Home", icon: "home" },
  { name: "analyze", label: "Analyze", icon: "videocam" },
  { name: "history", label: "History", icon: "schedule" },
  { name: "profile", label: "Profile", icon: "pets" },
];

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBarWrapper,
        { paddingBottom: Math.max(insets.bottom, 12) },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.dock}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const tab = TABS.find((t) => t.name === route.name) || {
            name: route.name,
            label: options.title || route.name,
            icon: "circle" as IconName,
          };

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={tab.label}
              style={[
                styles.tabItem,
                isFocused && styles.tabItemActive,
              ]}
            >
              <Icon
                name={tab.icon}
                size={22}
                color={
                  isFocused ? colors.onPrimaryContainer : colors.onSurfaceVariant
                }
              />
              <Text
                style={[
                  type.labelSm,
                  styles.tabLabel,
                  {
                    color: isFocused
                      ? colors.onPrimaryContainer
                      : colors.onSurfaceVariant,
                    fontFamily: isFocused ? "PlusJakartaSans_700Bold" : "PlusJakartaSans_500Medium",
                  },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="analyze" options={{ title: "Analyze" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.margin,
    paddingTop: 4,
    zIndex: 50,
  },
  dock: {
    height: 64,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainer, 0.94),
    boxShadow: "0 12px 32px rgba(13,7,47,0.7)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    minWidth: 48,
    height: 50,
    borderRadius: radius.full,
  },
  tabItemActive: {
    backgroundColor: colors.primaryContainer,
    boxShadow: "0 0 18px rgba(255,176,32,0.45)",
  },
  tabLabel: {
    lineHeight: 12,
  },
});

