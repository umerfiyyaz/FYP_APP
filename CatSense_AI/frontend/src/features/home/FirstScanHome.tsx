// Home for a cat that has no analysis yet: explains the first steps and sends the user to Analyze.
import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";

import { PressScale } from "@/components/animations/PressScale";
import { CatAvatar } from "@/components/cards/CatAvatar";
import { BrandHeader } from "@/components/ui/BrandHeader";
import { Button } from "@/components/ui/Button";
import { Icon, IconName } from "@/components/ui/Icon";
import { images } from "@/constants/images";
import { useActiveCat } from "@/store/catStore";
import {
  colors,
  gradients,
  radius,
  shadows,
  spacing,
  type,
  withAlpha,
} from "@/theme";

const STEPS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "videocam",
    title: "Choose a video",
    text: "A clear clip of your cat, from the gallery or recorded live.",
  },
  {
    icon: "content-cut",
    title: "Trim it",
    text: "Keep only the part where your cat is visible.",
  },
  {
    icon: "insights",
    title: "Get the result",
    text: "Behavior, sound mood and a health check for this clip.",
  },
];

export default function FirstScanHome() {
  const cat = useActiveCat();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BrandHeader subtitle="Home" hasAlert={false} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.margin,
          paddingTop: 8,
          paddingBottom: 130, // clear the floating tab dock
          gap: 16,
        }}
      >
        {/* Hero */}
        <View
          style={{
            borderRadius: radius.lg,
            padding: 24,
            alignItems: "center",
            gap: 10,
            backgroundColor: colors.surfaceContainer,
            boxShadow: shadows.xlDeep,
          }}
        >
          <CatAvatar source={cat?.photo ?? images.mascot} size={96} />
          <Text
            style={[
              type.headlineXlMobile,
              { color: colors.onSurface, textAlign: "center" },
            ]}
          >
            {cat ? `Meet ${cat.name}` : "Welcome to CatSense AI"}
          </Text>
          <Text
            style={[
              type.bodyMd,
              {
                color: colors.onSurfaceVariant,
                textAlign: "center",
                maxWidth: 300,
              },
            ]}
          >
            {cat
              ? `Add the first video to start ${cat.name}'s baseline. After 3 videos we can tell what is normal for ${cat.name}.`
              : "Add your cat to get started."}
          </Text>

          {cat ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginTop: 4,
              }}
            >
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={{
                    width: 28,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor:
                      i < cat.baselineVideos
                        ? colors.secondary
                        : colors.surfaceContainerHighest,
                  }}
                />
              ))}
              <Text
                style={[
                  type.labelMd,
                  { color: colors.onSurfaceVariant, marginLeft: 6 },
                ]}
              >
                {`Baseline ${cat.baselineVideos} of 3`}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Main action */}
        <Button
          label={cat ? "Analyze first video" : "Add your cat"}
          icon="arrow-forward"
          onPress={() =>
            router.push((cat ? "/(tabs)/analyze" : "/add-cat") as never)
          }
          gradient={gradients.ctaFade}
          paddingVertical={16}
          shadow={shadows.cta}
        />

        {/* How it works */}
        <View style={{ gap: 10 }}>
          <Text style={[type.headlineSm, { color: colors.onSurface }]}>
            How it works
          </Text>
          {STEPS.map((s, i) => (
            <View
              key={s.title}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                padding: 14,
                borderRadius: radius.base,
                backgroundColor: colors.surfaceContainerLow,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.surfaceContainerHighest,
                }}
              >
                <Icon name={s.icon} size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[type.labelLg, { color: colors.onSurface }]}
                >{`${i + 1}. ${s.title}`}</Text>
                <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
                  {s.text}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Switch cat */}
        {cat ? (
          <PressScale
            onPress={() => router.push("/cats" as never)}
            accessibilityRole="button"
            accessibilityLabel="Switch or add a cat"
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingVertical: 14,
              borderRadius: radius.full,
              backgroundColor: withAlpha(colors.surfaceContainerHigh, 0.8),
            }}
          >
            <Icon name="pets" size={18} color={colors.onSurface} />
            <Text style={[type.labelLg, { color: colors.onSurface }]}>
              Switch or add a cat
            </Text>
          </PressScale>
        ) : null}
      </ScrollView>
    </View>
  );
}
