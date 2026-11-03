import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";

import { PressScale } from "@/components/animations/PressScale";
import { colors, radius, type } from "@/theme";

const ROUTES: { n: string; path: string }[] = [
  { n: "1 Sign in", path: "/(auth)/login" },
  { n: "2 Add cat", path: "/add-cat" },
  { n: "3 Onboarding sound", path: "/onboarding" },
  { n: "4 Baseline", path: "/baseline" },
  { n: "5 Home", path: "/(tabs)/home" },
  { n: "6 Analyze", path: "/(tabs)/analyze" },
  { n: "7 Live camera", path: "/camera" },
  { n: "8 Processing", path: "/processing" },
  { n: "9 No cat found", path: "/no-cat-found" },
  { n: "10 Results", path: "/results/a1" },
  { n: "11 Behavior timeline", path: "/behavior/a1" },
  { n: "12 Sound mood", path: "/sound/a1" },
  { n: "13 Risk score (abhi baqi)", path: "/health/a1" },
  { n: "15/16 History", path: "/(tabs)/history" },
  { n: "17 Alerts", path: "/alerts" },
  { n: "18 Profile", path: "/(tabs)/profile" },
  { n: "19 Cat switcher", path: "/cats" },
  { n: "20 Cat profile", path: "/cat/milo" },
];

/** Temporary screen to open every screen. Delete this file before the final app. */
export default function Dev() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20, paddingTop: 60, gap: 10 }}
    >
      <Text
        style={[type.headlineSm, { color: colors.onSurface, marginBottom: 6 }]}
      >
        All screens
      </Text>
      {ROUTES.map((r) => (
        <PressScale
          key={r.path}
          onPress={() => router.push(r.path as never)}
          style={{
            padding: 14,
            borderRadius: radius.full,
            backgroundColor: colors.surfaceContainer,
          }}
        >
          <Text style={[type.labelLg, { color: colors.onSurface }]}>{r.n}</Text>
        </PressScale>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
