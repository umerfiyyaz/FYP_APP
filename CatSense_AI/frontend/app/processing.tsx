// SCREEN 8 - Processing / Neural Analysis Matrix (prototype: 8_catsense_ai._processing)
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

import { PressScale } from "@/components/animations/PressScale";
import { Pulse } from "@/components/animations/Pulse";
import { Button } from "@/components/ui/Button";
import { Glow } from "@/components/ui/Glow";
import { Icon } from "@/components/ui/Icon";
import { images } from "@/constants/images";
import { api, USE_MOCK } from "@/services/api";
import { errorMessage } from "@/services/auth";
import { historyApi } from "@/services/historyApi";
import { clearPendingUpload, getPendingUpload } from "@/services/pendingUpload";
import { uploadVideo, type UploadResponse } from "@/services/videos";
import { alertActions } from "@/store/alertStore";
import { catActions, useActiveCat } from "@/store/catStore";
import { historyActions } from "@/store/historyStore";
import {
  colors,
  gradients,
  letterSpacing,
  radius,
  shadows,
  spacing,
  tracking,
  type,
  withAlpha,
} from "@/theme";

const mascotPhrases = (name: string) => [
  `Checking ${name}'s movements...`,
  "Analyzing tail twitch frequency...",
  "Measuring paw angle & posture...",
  "Listening for happy purr vibrations...",
];

// The five steps the backend reports (stage names come from the server).
const STEPS = [
  {
    key: "preparing",
    title: "Preparing video",
    sub: "Uploading and checking your clip",
  },
  {
    key: "finding_cat",
    title: "Finding your cat",
    sub: "Looking for your cat in the frames",
  },
  {
    key: "reading_behavior",
    title: "Reading behavior",
    sub: "Posture and movement",
  },
  {
    key: "listening_sound",
    title: "Listening to the sound",
    sub: "Meows and purrs",
  },
  {
    key: "health_report",
    title: "Building health report",
    sub: "Comparing with your cat's usual",
  },
] as const;

/** Demo mode: pretend which step is active from the fake percent. */
function stageFromPercent(p: number) {
  if (p < 25) return "preparing";
  if (p < 45) return "finding_cat";
  if (p < 70) return "reading_behavior";
  if (p < 90) return "listening_sound";
  return "health_report";
}

type StepState = "done" | "running" | "waiting" | "queued";

function StepRow({
  state,
  title,
  sub,
}: {
  state: StepState;
  title: string;
  sub: string;
}) {
  if (state === "done") {
    return (
      <View style={styles.stepRowDone}>
        <View style={styles.stepLeft}>
          <View style={styles.doneIconCircle}>
            <Icon name="check-circle" size={18} color={colors.secondary} />
          </View>
          <Text style={[type.bodyMd, { color: colors.onSurface }]}>
            {title}
          </Text>
        </View>
        <View style={styles.doneTag}>
          <Text style={[type.labelSm, { color: colors.secondary }]}>Done</Text>
        </View>
      </View>
    );
  }
  if (state === "running") {
    return (
      <View style={styles.stepRowRunning}>
        <View style={styles.stepLeft}>
          <View style={styles.runningIconCircle}>
            <Pulse duration={1200}>
              <Icon name="sync" size={18} color={colors.primaryContainer} />
            </Pulse>
          </View>
          <View style={styles.runningTextCol}>
            <Text
              style={[
                type.bodyMd,
                { color: colors.primary, fontWeight: "600" },
              ]}
            >
              {title}
            </Text>
            <Text style={[type.labelSm, { color: colors.primaryFixedDim }]}>
              {sub}
            </Text>
          </View>
        </View>
        <View style={styles.runningTag}>
          <Text
            style={[
              type.labelSm,
              { color: colors.onPrimary, fontWeight: "700" },
            ]}
          >
            Running
          </Text>
        </View>
      </View>
    );
  }
  if (state === "waiting") {
    return (
      <View style={styles.stepRowWaiting}>
        <View style={styles.stepLeft}>
          <View style={styles.waitingIconCircle}>
            <Icon name="hourglass-top" size={16} color={colors.tertiary} />
          </View>
          <Text style={[type.bodyMd, { color: colors.onSurface }]}>
            {title}
          </Text>
        </View>
        <View style={styles.waitingTag}>
          <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
            Waiting
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.stepRowQueued}>
      <View style={styles.stepLeft}>
        <View style={styles.queuedIconCircle}>
          <Icon
            name="radio-button-unchecked"
            size={16}
            color={colors.onSurfaceVariant}
          />
        </View>
        <Text style={[type.bodyMd, { color: colors.onSurfaceVariant }]}>
          {title}
        </Text>
      </View>
      <View style={styles.waitingTag}>
        <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
          Queued
        </Text>
      </View>
    </View>
  );
}

export default function ProcessingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const cat = useActiveCat();
  const [percent, setPercent] = useState(USE_MOCK ? 64 : 3);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [stage, setStage] = useState<string>("preparing");
  const [failure, setFailure] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const analysisId = useRef<string | null>(null);
  const userCancelled = useRef(false);
  const job = useRef<{
    attempt: number;
    promise: Promise<UploadResponse>;
  } | null>(null);

  // Progressive simulation timer (demo mode only)
  useEffect(() => {
    if (!USE_MOCK) return;
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 98) {
          clearInterval(timer);
          return 98;
        }
        const next = prev + 1;
        if (next % 6 === 0) {
          setPhraseIdx((idx) => (idx + 1) % 4);
        }
        return next;
      });
    }, 800);

    return () => clearInterval(timer);
  }, []);

  // Real mode: upload the video, then ask the server for the progress until it is finished.
  useEffect(() => {
    if (USE_MOCK) return;
    const pending = getPendingUpload();
    if (!cat || !pending) {
      setFailure(
        "There is no video to analyse. Please choose a video from your gallery first.",
      );
      return;
    }
    const catId = cat.id;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    setFailure(null);
    setPercent(3);
    setStage("preparing");

    const finish = async (id: string) => {
      await Promise.all([
        historyActions.hydrate(catId),
        catActions.hydrate(),
        alertActions.hydrate(catId),
      ]);
      clearPendingUpload();
      if (!cancelled) router.replace(`/results/${id}` as never);
    };

    const poll = async (id: string, errors: number) => {
      if (cancelled) return;
      try {
        const s = await api<{
          status: string;
          progress: number;
          stage: string | null;
          error: string | null;
        }>(`/analyses/${id}/status`);
        if (cancelled) return;
        setPercent(Math.max(8, Math.min(100, s.progress)));
        if (s.stage) setStage(s.stage);
        if (s.status === "done") {
          finish(id);
          return;
        }
        if (s.status === "no_cat") {
          clearPendingUpload();
          router.replace("/no-cat-found");
          return;
        }
        if (s.status === "failed") {
          setFailure(s.error ?? "The analysis failed. Please try again.");
          return;
        }
        timer = setTimeout(() => poll(id, 0), 1500);
      } catch {
        if (cancelled) return;
        if (errors >= 3) {
          setFailure(
            "Lost the connection to the server. Check your Wi-Fi and try again.",
          );
          return;
        }
        timer = setTimeout(() => poll(id, errors + 1), 2000);
      }
    };

    // one upload per attempt (also when React runs this effect twice in development)
    if (!job.current || job.current.attempt !== attempt) {
      job.current = { attempt, promise: uploadVideo(catId, pending) };
    }
    job.current.promise
      .then((up) => {
        if (cancelled) {
          // the user left while the video was uploading: remove what the server just created
          if (userCancelled.current)
            historyApi.remove(up.analysis_id).catch(() => {});
          return;
        }
        analysisId.current = up.analysis_id;
        setPercent(8);
        poll(up.analysis_id, 0);
      })
      .catch((e) => {
        if (!cancelled) setFailure(errorMessage(e));
      });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [attempt]);

  // Real mode: rotate the mascot sentence every few seconds.
  useEffect(() => {
    if (USE_MOCK) return;
    const t = setInterval(() => setPhraseIdx((i) => (i + 1) % 4), 4000);
    return () => clearInterval(t);
  }, []);

  const pendingNow = getPendingUpload();
  const clipSec = pendingNow
    ? pendingNow.trimStart !== null && pendingNow.trimEnd !== null
      ? pendingNow.trimEnd - pendingNow.trimStart
      : pendingNow.durationSec
    : 0;
  const activeStage = USE_MOCK ? stageFromPercent(percent) : stage;
  const activeIdx = Math.max(
    0,
    STEPS.findIndex((s) => s.key === activeStage),
  );

  const totalCircumference = 440;
  const strokeDashoffset =
    totalCircumference - (totalCircumference * percent) / 100;
  const remainingSeconds = Math.max(
    2,
    Math.round(8 * (1 - (percent - 64) / 34)),
  );

  const onCancel = () => {
    Alert.alert(
      "Cancel Analysis",
      "Are you sure you want to cancel the analysis?",
      [
        { text: "Continue Analysis", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            userCancelled.current = true;
            const id = analysisId.current;
            if (!USE_MOCK && id) historyApi.remove(id).catch(() => {}); // stop it on the server too
            clearPendingUpload();
            router.back();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerLeft}>
          <PressScale
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Back"
            style={styles.headerIconBtn}
          >
            <Icon name="arrow-back" size={22} color={colors.onSurface} />
          </PressScale>
          <Image
            source={images.logoSmall}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={[type.headlineMd, styles.headerTitle]}>Results</Text>
        </View>

        <View style={styles.headerRight}>
          <PressScale
            accessibilityRole="button"
            accessibilityLabel="Share"
            style={styles.headerIconBtn}
          >
            <Icon name="share" size={20} color={colors.onSurface} />
          </PressScale>
          <LinearGradient
            colors={[colors.primaryContainer, colors.secondary]}
            style={styles.avatarBorder}
          >
            <Image
              source={images.userProfile}
              style={styles.profileAvatar}
              resizeMode="cover"
            />
          </LinearGradient>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Radial Ambient Glows */}
        <Glow
          size={240}
          color={colors.primaryContainer}
          opacity={0.12}
          style={{ top: 0, alignSelf: "center" }}
        />
        <Glow
          size={180}
          color={colors.tertiaryContainer}
          opacity={0.08}
          style={{ top: 120, alignSelf: "center" }}
        />

        {/* Circular Progress Gauge */}
        <View style={styles.gaugeSection}>
          <View style={styles.circleSvgWrap}>
            <Svg width={180} height={180} viewBox="0 0 160 160">
              <Circle
                cx={80}
                cy={80}
                r={70}
                fill="none"
                stroke={colors.surfaceContainerHighest}
                strokeWidth={8}
                opacity={0.45}
              />
              <Circle
                cx={80}
                cy={80}
                r={70}
                fill="none"
                stroke={colors.primaryContainer}
                strokeWidth={9}
                strokeDasharray={`${totalCircumference} ${totalCircumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                originX={80}
                originY={80}
                rotation={-90}
              />
            </Svg>

            <View style={styles.gaugeCenterLabel}>
              <View style={styles.percentRow}>
                <Text style={[type.headlineXl, styles.percentNumber]}>
                  {percent}
                </Text>
                <Text style={[type.headlineMd, styles.percentSign]}>%</Text>
              </View>
              <View style={styles.aiActiveBadge}>
                <Pulse duration={1000} minOpacity={0.3}>
                  <View style={styles.activeDot} />
                </Pulse>
                <Text style={[type.labelSm, styles.aiActiveText]}>
                  AI ACTIVE
                </Text>
              </View>
            </View>
          </View>

          <Text style={[type.headlineSm, styles.timeLeftText]}>
            {USE_MOCK
              ? `About ${remainingSeconds} seconds left`
              : "Analysing your clip"}
          </Text>
          <Text style={[type.bodyMd, styles.gaugeSubtitle]}>
            {USE_MOCK
              ? "We analyse about 30 seconds of the best cat footage."
              : "This can take a little while. You can keep this screen open."}
          </Text>

          {USE_MOCK || clipSec > 0 ? (
            <View style={styles.analysedPill}>
              <Icon name="timer" size={15} color={colors.secondary} />
              <Text style={[type.labelMd, { color: colors.onSurface }]}>
                {USE_MOCK ? (
                  <>
                    Seconds analysed:{" "}
                    <Text style={{ color: colors.primary, fontWeight: "700" }}>
                      30
                    </Text>{" "}
                    of 48
                  </>
                ) : (
                  <>
                    Clip length:{" "}
                    <Text style={{ color: colors.primary, fontWeight: "700" }}>
                      {Math.round(clipSec)} s
                    </Text>
                  </>
                )}
              </Text>
            </View>
          ) : null}
        </View>

        {failure ? (
          <View
            style={{
              borderRadius: radius.lg,
              padding: spacing.md,
              gap: spacing.sm,
              backgroundColor: withAlpha(colors.errorContainer, 0.35),
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Icon name="warning" size={18} color={colors.error} />
              <Text style={[type.labelLg, { color: colors.error }]}>
                Could not finish
              </Text>
            </View>
            <Text style={[type.bodyMd, { color: colors.onSurface }]}>
              {failure}
            </Text>
            {getPendingUpload() ? (
              <Button
                label="Try again"
                icon="refresh"
                iconPosition="left"
                onPress={() => setAttempt((a) => a + 1)}
                gradient={gradients.ctaFade}
                paddingVertical={13}
                shadow={shadows.cta}
              />
            ) : null}
            <Button
              label="Back"
              onPress={() => router.back()}
              color={colors.onSurface}
              background={withAlpha(colors.surfaceContainerHigh, 0.8)}
              paddingVertical={13}
              shadow={shadows.md}
            />
          </View>
        ) : null}

        {/* Neural Analysis Matrix Card */}
        <View style={styles.matrixCard}>
          <View style={styles.matrixHeader}>
            <View style={styles.matrixHeaderLeft}>
              <View style={styles.matrixIconCircle}>
                <Icon name="psychology" size={16} color={colors.primary} />
              </View>
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                Neural Analysis Matrix
              </Text>
            </View>
            {USE_MOCK ? (
              <View style={styles.liveVersionBadge}>
                <Text style={[type.labelSm, { color: colors.primary }]}>
                  v4.2 Live
                </Text>
              </View>
            ) : null}
          </View>

          {/* Steps List */}
          <View style={styles.stepsList}>
            {STEPS.map((st, i) => (
              <StepRow
                key={st.key}
                title={st.title}
                sub={st.sub}
                state={
                  i < activeIdx
                    ? "done"
                    : i === activeIdx
                      ? "running"
                      : i === activeIdx + 1
                        ? "waiting"
                        : "queued"
                }
              />
            ))}

            {/* Step 6: Saved to history */}
            <View style={styles.stepRowQueued}>
              <View style={styles.stepLeftStart}>
                <View style={styles.queuedIconCircle}>
                  <Icon
                    name="save-as"
                    size={16}
                    color={colors.onSurfaceVariant}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[type.bodyMd, { color: colors.onSurfaceVariant }]}
                  >
                    Saved to history
                  </Text>
                  <Text
                    style={[
                      type.labelSm,
                      { color: withAlpha(colors.onSurfaceVariant, 0.8) },
                    ]}
                  >
                    When finished, automatically saved to history.
                  </Text>
                </View>
              </View>
              <View style={styles.waitingTag}>
                <Text
                  style={[type.labelSm, { color: colors.onSurfaceVariant }]}
                >
                  Queued
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Mascot Sense Speech Card */}
        <View style={styles.mascotSpeechCard}>
          <View style={styles.mascotAvatarCircle}>
            <Image
              source={images.mascotSense}
              style={styles.mascotAvatarImg}
              resizeMode="cover"
            />
          </View>
          <View style={styles.speechBubble}>
            <View style={styles.speechHeader}>
              <Text style={[type.labelSm, styles.mascotSenseTitle]}>
                MASCOT SENSE
              </Text>
              <View style={styles.mintDot} />
            </View>
            <Text numberOfLines={1} style={[type.bodySm, styles.speechText]}>
              {mascotPhrases(cat?.name ?? "your cat")[phraseIdx % 4]}
            </Text>
          </View>
        </View>

        {/* Action: Cancel Button */}
        <View style={styles.cancelWrap}>
          <PressScale
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel="Cancel analysis"
            style={styles.cancelBtn}
          >
            <Icon name="close" size={18} color={colors.error} />
            <Text style={[type.labelLg, { color: colors.onSurface }]}>
              Cancel
            </Text>
          </PressScale>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: withAlpha(colors.background, 0.85),
    paddingBottom: 10,
    paddingHorizontal: spacing.margin,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 4px 24px rgba(13,7,47,0.45)",
    zIndex: 50,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerIconBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainer, 0.7),
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogo: {
    width: 30,
    height: 30,
  },
  headerTitle: {
    color: colors.onSurface,
    fontWeight: "700",
    letterSpacing: letterSpacing(18, tracking.tight),
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
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

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.margin,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },

  gaugeSection: {
    alignItems: "center",
    textAlign: "center",
    marginTop: 4,
  },
  circleSvgWrap: {
    position: "relative",
    width: 180,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  gaugeCenterLabel: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  percentRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  percentNumber: {
    color: colors.primaryContainer,
    fontWeight: "800",
  },
  percentSign: {
    color: colors.primaryContainer,
    marginLeft: 2,
  },
  aiActiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerHigh, 0.8),
    marginTop: 2,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
  },
  aiActiveText: {
    color: colors.primary,
    letterSpacing: letterSpacing(10, tracking.wider),
  },
  timeLeftText: {
    color: colors.onSurface,
    marginBottom: 4,
    letterSpacing: letterSpacing(18, tracking.tight),
  },
  gaugeSubtitle: {
    color: colors.onSurfaceVariant,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 22,
    marginBottom: 10,
  },
  analysedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerHigh, 0.9),
    boxShadow: shadows.inner,
  },

  matrixCard: {
    borderRadius: radius.lg,
    backgroundColor: withAlpha(colors.surfaceContainer, 0.9),
    padding: spacing.md,
    boxShadow: "0 12px 32px rgba(13,7,47,0.5)",
    gap: spacing.sm,
  },
  matrixHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 4,
  },
  matrixHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  matrixIconCircle: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: "center",
    justifyContent: "center",
  },
  liveVersionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.primaryContainer, 0.2),
  },

  stepsList: {
    gap: 8,
  },
  stepRowDone: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: radius.sm,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.6),
  },
  stepLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  stepLeftStart: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    flex: 1,
  },
  doneIconCircle: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.secondary, 0.15),
    alignItems: "center",
    justifyContent: "center",
  },
  doneTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.secondary, 0.1),
  },

  stepRowRunning: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: radius.sm,
    backgroundColor: withAlpha(colors.primaryContainer, 0.15),
    boxShadow: "0 0 16px rgba(255,176,32,0.12)",
  },
  runningIconCircle: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.primaryContainer, 0.25),
    alignItems: "center",
    justifyContent: "center",
  },
  runningTextCol: {
    flex: 1,
  },
  runningTag: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
  },

  stepRowWaiting: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: radius.sm,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.4),
    opacity: 0.8,
  },
  waitingIconCircle: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  waitingTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
  },

  stepRowQueued: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: radius.sm,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.3),
    opacity: 0.6,
  },
  queuedIconCircle: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },

  mascotSpeechCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: withAlpha(colors.surfaceContainerHigh, 0.7),
    boxShadow: shadows.lg,
    marginTop: 4,
  },
  mascotAvatarCircle: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    overflow: "hidden",
    backgroundColor: colors.surfaceContainerLowest,
    boxShadow: "0 4px 16px rgba(255,176,32,0.25)",
  },
  mascotAvatarImg: {
    width: "100%",
    height: "100%",
  },
  speechBubble: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.base,
    backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.9),
    boxShadow: shadows.inner,
  },
  speechHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  mascotSenseTitle: {
    color: colors.primary,
    fontWeight: "700",
    letterSpacing: letterSpacing(10, tracking.wider),
  },
  mintDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
  },
  speechText: {
    color: colors.onSurface,
    fontWeight: "500",
  },

  cancelWrap: {
    alignItems: "center",
    paddingTop: 4,
  },
  cancelBtn: {
    width: "100%",
    maxWidth: 320,
    paddingVertical: 14,
    borderRadius: radius.full,
    backgroundColor: withAlpha(colors.surfaceContainerHigh, 0.8),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
  },
});
