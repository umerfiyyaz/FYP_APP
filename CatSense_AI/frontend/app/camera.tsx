// SCREEN 7 - Live Camera Viewfinder (prototype: 7_catsense_ai._live_camera)
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressScale } from "@/components/animations/PressScale";
import { Pulse } from "@/components/animations/Pulse";
import { Icon } from "@/components/ui/Icon";
import { images } from "@/constants/images";
import {
  colors,
  letterSpacing,
  radius,
  shadows,
  spacing,
  tracking,
  type,
  withAlpha,
} from "@/theme";

export default function CameraScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [flashOn, setFlashOn] = useState(true);
  const [mode, setMode] = useState<"15s" | "30s">("30s");
  const [seconds, setSeconds] = useState(6);
  const [isRecording, setIsRecording] = useState(true);

  // Auto increment recording timer
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const max = mode === "15s" ? 15 : 30;
        if (prev >= max) {
          // Finished recording, auto-navigate to processing
          clearInterval(interval);
          router.push("/processing");
          return max;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording, mode, router]);

  const maxSeconds = mode === "15s" ? 15 : 30;
  const formattedSeconds = String(seconds).padStart(2, "0");
  const formattedMax = String(maxSeconds).padStart(2, "0");

  const onStopOrCapture = () => {
    setIsRecording(false);
    router.push("/processing");
  };

  return (
    <View style={styles.container}>
      {/* Camera Live Stream Background */}
      <ImageBackground
        source={images.cameraBgCat}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        {/* Dark Cinematic Gradient Overlays */}
        <LinearGradient
          colors={[
            withAlpha(colors.surfaceContainerLowest, 0.85),
            "transparent",
            withAlpha(colors.surfaceContainerLowest, 0.92),
          ]}
          style={StyleSheet.absoluteFill}
        />

        {/* Viewfinder Content Container */}
        <View
          style={[
            styles.stage,
            { paddingTop: Math.max(insets.top, 16), paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          {/* Top Status Bar Overlay */}
          <View style={styles.topBar}>
            {/* REC Indicator Pill */}
            <View style={styles.recPill}>
              <Pulse duration={800} minOpacity={0.2}>
                <View style={styles.recDot} />
              </Pulse>
              <Text style={[type.labelSm, styles.recText]}>REC</Text>
              <Text style={[type.labelMd, styles.timerText]}>
                00:{formattedSeconds} / 00:{formattedMax}
              </Text>
            </View>

            {/* Action Buttons: Flash & Close */}
            <View style={styles.topActions}>
              <PressScale
                onPress={() => setFlashOn((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel="Toggle Flash"
                style={styles.topIconButton}
              >
                <Icon
                  name={flashOn ? "flash-on" : "flash-off"}
                  size={20}
                  color={flashOn ? colors.primary : colors.onSurfaceVariant}
                />
              </PressScale>
              <PressScale
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel="Close camera"
                style={styles.topIconButton}
              >
                <Icon name="close" size={20} color={colors.onSurface} />
              </PressScale>
            </View>
          </View>

          {/* Center HUD: AI Target Detection Reticle & Acoustic Spectrum */}
          <View style={styles.centerHud}>
            {/* Bounding Box Reticle */}
            <View style={styles.reticleBox}>
              {/* Corner Markers */}
              <View style={[styles.cornerMarker, styles.cornerTL]} />
              <View style={[styles.cornerMarker, styles.cornerTR]} />
              <View style={[styles.cornerMarker, styles.cornerBL]} />
              <View style={[styles.cornerMarker, styles.cornerBR]} />

              {/* Tag Chip Anchor */}
              <View style={styles.focusChipAnchor}>
                <View style={styles.focusChip}>
                  <Icon name="pets" size={13} color={colors.onPrimaryContainer} />
                  <Text style={[type.labelSm, styles.focusChipText]}>
                    Milo • Focus Lock
                  </Text>
                </View>
              </View>

              {/* Crosshair Center Sight */}
              <View style={styles.crosshairBox}>
                <Icon
                  name="center-focus-strong"
                  size={32}
                  color={colors.primaryContainer}
                />
              </View>
            </View>

            {/* HUD Acoustic Sound Level Spectrum Analyzer */}
            <View style={styles.spectrumCard}>
              {/* Purr Band */}
              <View style={styles.spectrumRow}>
                <View style={styles.bandLabelRow}>
                  <Icon name="graphic-eq" size={16} color={colors.secondary} />
                  <Text
                    numberOfLines={1}
                    style={[type.labelSm, { color: colors.secondary }]}
                  >
                    Purr Band (0–200 Hz)
                  </Text>
                </View>
                <View style={styles.audioBarsGroup}>
                  <View style={[styles.soundBar, { height: 8, backgroundColor: colors.secondary }]} />
                  <View style={[styles.soundBar, { height: 14, backgroundColor: colors.secondary }]} />
                  <View style={[styles.soundBar, { height: 20, backgroundColor: colors.secondary }]} />
                  <View style={[styles.soundBar, { height: 12, backgroundColor: colors.secondary }]} />
                  <View style={[styles.soundBar, { height: 6, backgroundColor: withAlpha(colors.secondary, 0.5) }]} />
                  <Text style={[type.labelSm, styles.bandScoreSecondary]}>
                    94%
                  </Text>
                </View>
              </View>

              {/* Meow Band */}
              <View style={[styles.spectrumRow, { paddingTop: 6 }]}>
                <View style={styles.bandLabelRow}>
                  <Icon
                    name="spatial-audio-off"
                    size={16}
                    color={colors.onSurfaceVariant}
                  />
                  <Text
                    numberOfLines={1}
                    style={[type.labelSm, { color: colors.onSurfaceVariant }]}
                  >
                    Meow Band (700–1500 Hz)
                  </Text>
                </View>
                <View style={styles.audioBarsGroup}>
                  <View style={[styles.soundBar, { height: 4, backgroundColor: colors.surfaceVariant }]} />
                  <View style={[styles.soundBar, { height: 6, backgroundColor: colors.surfaceVariant }]} />
                  <View style={[styles.soundBar, { height: 4, backgroundColor: colors.surfaceVariant }]} />
                  <View style={[styles.soundBar, { height: 4, backgroundColor: colors.surfaceVariant }]} />
                  <View style={[styles.soundBar, { height: 4, backgroundColor: colors.surfaceVariant }]} />
                  <Text style={[type.labelSm, styles.bandScoreIdle]}>Idle</Text>
                </View>
              </View>
            </View>

            {/* Live Guiding Hint Pill */}
            <View style={styles.hintPill}>
              <Icon
                name="screen-rotation-alt"
                size={16}
                color={colors.primaryFixedDim}
              />
              <Text style={[type.bodySm, { color: colors.onSurface }]}>
                Hold steady. Keep Milo in the frame.
              </Text>
            </View>
          </View>

          {/* Bottom Camera Control Cluster */}
          <View style={styles.bottomCluster}>
            {/* Duration Mode Switcher */}
            <View style={styles.modeSwitcher}>
              <Pressable
                onPress={() => {
                  setMode("15s");
                  setSeconds(6);
                }}
                style={[
                  styles.modeButton,
                  mode === "15s" && styles.modeButtonActive,
                ]}
              >
                <Text
                  style={[
                    type.labelMd,
                    {
                      color:
                        mode === "15s"
                          ? colors.onPrimaryContainer
                          : colors.onSurface,
                    },
                  ]}
                >
                  Quick 15s
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setMode("30s");
                  setSeconds(6);
                }}
                style={[
                  styles.modeButton,
                  mode === "30s" && styles.modeButtonActive,
                ]}
              >
                <Text
                  style={[
                    type.labelMd,
                    {
                      color:
                        mode === "30s"
                          ? colors.onPrimaryContainer
                          : colors.onSurface,
                    },
                  ]}
                >
                  30s
                </Text>
              </Pressable>
            </View>

            {/* Shutter & Peripheral Controls Row */}
            <View style={styles.controlsRow}>
              {/* Left: Gallery Media Thumbnail */}
              <PressScale
                onPress={() => router.push("/(tabs)/analyze")}
                accessibilityRole="button"
                accessibilityLabel="Open gallery"
                style={styles.galleryButton}
              >
                <Image
                  source={images.galleryThumbnail}
                  style={styles.galleryThumbImg}
                  resizeMode="cover"
                />
              </PressScale>

              {/* Center: Tactile Shutter Button with Pulse Aura */}
              <View style={styles.shutterWrapper}>
                <View style={styles.shutterAura} />
                <PressScale
                  onPress={onStopOrCapture}
                  accessibilityRole="button"
                  accessibilityLabel="Stop recording"
                  style={styles.shutterOuter}
                >
                  <LinearGradient
                    colors={[colors.primaryFixed, colors.primaryContainer]}
                    style={styles.shutterGradientBorder}
                  >
                    <View style={styles.shutterCore}>
                      {/* Stop Recording Square Indicator */}
                      <View style={styles.stopIndicator} />
                    </View>
                  </LinearGradient>
                </PressScale>
              </View>

              {/* Right: Flip Camera Button */}
              <PressScale
                accessibilityRole="button"
                accessibilityLabel="Flip camera"
                style={styles.flipButton}
              >
                <Icon name="flip-camera-ios" size={24} color={colors.onSurface} />
              </PressScale>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  stage: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.margin,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 20,
  },
  recPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.75),
    boxShadow: shadows.md,
  },
  recDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.error,
  },
  recText: {
    color: colors.error,
    fontWeight: "700",
    letterSpacing: letterSpacing(10, tracking.wider),
  },
  timerText: {
    color: colors.onSurface,
    marginLeft: 4,
    fontVariant: ["tabular-nums"],
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  topIconButton: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainer, 0.75),
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadows.md,
  },

  centerHud: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: "auto",
  },
  reticleBox: {
    position: "relative",
    width: 280,
    height: 250,
    borderRadius: radius.lg,
    padding: spacing.sm,
    boxShadow: "0 0 24px rgba(255,176,32,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cornerMarker: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: colors.primaryContainer,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3.5,
    borderLeftWidth: 3.5,
    borderTopLeftRadius: 10,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3.5,
    borderRightWidth: 3.5,
    borderTopRightRadius: 10,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3.5,
    borderLeftWidth: 3.5,
    borderBottomLeftRadius: 10,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    borderBottomRightRadius: 10,
  },
  focusChipAnchor: {
    position: "absolute",
    top: -14,
    left: 8,
  },
  focusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    boxShadow: shadows.md,
  },
  focusChipText: {
    color: colors.onPrimaryContainer,
    letterSpacing: letterSpacing(10, tracking.wide),
  },
  crosshairBox: {
    opacity: 0.4,
  },

  spectrumCard: {
    width: 280,
    marginTop: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.base,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.85),
    boxShadow: shadows.xl,
    gap: 4,
  },
  spectrumRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bandLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  audioBarsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  soundBar: {
    width: 5,
    borderRadius: radius.full,
  },
  bandScoreSecondary: {
    color: colors.secondary,
    marginLeft: 4,
    fontVariant: ["tabular-nums"],
  },
  bandScoreIdle: {
    color: colors.onSurfaceVariant,
    marginLeft: 4,
  },

  hintPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerHigh, 0.85),
    marginTop: spacing.md,
    boxShadow: shadows.md,
  },

  bottomCluster: {
    alignItems: "center",
    gap: spacing.md,
    zIndex: 20,
    paddingBottom: 4,
  },
  modeSwitcher: {
    flexDirection: "row",
    alignItems: "center",
    padding: 3,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.85),
    boxShadow: shadows.md,
    gap: 4,
  },
  modeButton: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  modeButtonActive: {
    backgroundColor: colors.primaryContainer,
    boxShadow: shadows.sm,
  },

  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: spacing.sm,
  },
  galleryButton: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    overflow: "hidden",
    padding: 2,
    backgroundColor: colors.surfaceContainerHigh,
    boxShadow: shadows.lg,
  },
  galleryThumbImg: {
    width: "100%",
    height: "100%",
    borderRadius: radius.full,
  },
  shutterWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterAura: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.primaryContainer, 0.2),
  },
  shutterOuter: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadows.xl,
  },
  shutterGradientBorder: {
    width: 74,
    height: 74,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterCore: {
    width: 58,
    height: 58,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: "center",
    justifyContent: "center",
  },
  stopIndicator: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: colors.primaryContainer,
    boxShadow: "0 0 12px rgba(255,176,32,0.8)",
  },
  flipButton: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainer, 0.75),
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadows.lg,
  },
});
