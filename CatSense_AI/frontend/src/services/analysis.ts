// Analysis API Service & Mock Provider
// When backend is connected, simply swap the returned mock data with `api.get(...)` / `api.post(...)`.

import {
  AnalysisSummary,
  BehaviorTimelineData,
  SoundMoodDetails,
} from "@/types";
import { colors } from "@/theme";
import { api, USE_MOCK } from "@/services/api";
import { formatWhen } from "@/store/historyStore";
import type {
  AllowedBehavior,
  MoodBreakdownItem,
  RiskLevel,
  SoundWaveBar,
  TimelineEpoch,
  TimelineSegment,
} from "@/types";

// Default mock analysis result (Matches Screen 10: 10_catsense_ai._results)
export const mockAnalysisResult: AnalysisSummary = {
  id: "8492",
  catId: "cat_milo_01",
  catName: "Milo",
  timestamp: "2026-10-28T14:32:00Z",
  dateFormatted: "Oct 28 • 14:32",
  durationSeconds: 30,
  riskLevel: "Low",
  sentimentTitle: "Calm & Content",
  sentimentDescription: "Overall feline sentiment index",
  clipNumber: "Clip #8492",
  location: "Recorded in Living Room",
  behaviors: {
    resting: 45,
    grooming: 30,
    moving: 25,
    eating: 0,
    standing: 0,
  },
  dominantMood: {
    name: "Happy",
    percentage: 82,
    description: "Rhythmic low purr detected",
  },
  secondaryMoods: [
    { name: "Resting", percentage: 12 },
    { name: "Hungry", percentage: 5 },
  ],
  interpretation:
    "Relaxed, content sounds and calm body postures. No action needed.",
  isSynced: true,
};

// Default mock behavior timeline (Matches Screen 11: 11_catsense_ai._behavior_timeline)
export const mockBehaviorTimeline: BehaviorTimelineData = {
  sessionId: "1409",
  catName: "Milo",
  timestamp: "Today, 2:40 PM",
  clipDurationSeconds: 60,
  currentTimecode: "00:32",
  activeEpochRange: "Epoch 00:20 - 00:45",
  timelineSegments: [
    {
      label: "Resting",
      percentage: 33.3,
      color: colors.tertiaryContainer,
      timeRange: "00:00 - 00:20",
    },
    {
      label: "Grooming",
      percentage: 41.7,
      color: colors.primaryContainer,
      timeRange: "00:20 - 00:45",
    },
    {
      label: "Uncertain",
      percentage: 8.3,
      color: colors.surfaceContainerHighest,
      timeRange: "00:45 - 00:50",
    },
    {
      label: "No Cat",
      percentage: 16.7,
      color: colors.surfaceContainerLowest,
      timeRange: "00:50 - 01:00",
    },
  ],
  epochs: [
    {
      id: "ep_1",
      timeRange: "00:00 - 00:20",
      behavior: "Resting",
      confidence: 91,
      confidenceLevel: "High",
      description: "Quiet deep respiration, eyes softened",
      tags: ["Slow Breathing", "Eyes Closed", "Relaxed Shoulders"],
      color: colors.tertiaryContainer,
      icon: "self-improvement",
      durationText: "20s window",
      modelAgreement: "Model v4.3 Agreement",
    },
    {
      id: "ep_2",
      timeRange: "00:20 - 00:45",
      behavior: "Grooming",
      confidence: 88,
      confidenceLevel: "High",
      description: "Paw lick & facial rub repetitive cycles",
      tags: ["Self-soothing", "Normal Groom Rhythm", "Purr Detected"],
      color: colors.primaryContainer,
      icon: "clean-hands",
      durationText: "25s window",
      modelAgreement: "Model v4.3 Agreement",
    },
    {
      id: "ep_3",
      timeRange: "00:45 - 00:50",
      behavior: "Uncertain",
      confidence: 41,
      confidenceLevel: "Moderate",
      description: "Rapid frame transition / occluded tail",
      tags: ["Partial Occlusion", "Rapid Shift"],
      color: colors.surfaceContainerHighest,
      icon: "help-outline",
      durationText: "5s window",
      modelAgreement: "Model v4.3 Low Certainty",
    },
    {
      id: "ep_4",
      timeRange: "00:50 - 01:00",
      behavior: "No cat",
      confidence: 0,
      confidenceLevel: "Absent",
      description: "Subject exited sensor coverage zone",
      tags: ["Out of frame"],
      color: colors.surfaceContainerLowest,
      icon: "visibility-off",
      durationText: "10s window",
      modelAgreement: "Sensor Out of Scope",
    },
  ],
  focusedEpochId: "ep_2",
  timeBreakdown: [
    {
      name: "Grooming",
      seconds: 25,
      percentage: 50,
      color: colors.primaryContainer,
    },
    {
      name: "Resting",
      seconds: 20,
      percentage: 40,
      color: colors.tertiaryContainer,
    },
    {
      name: "Moving",
      seconds: 3,
      percentage: 6,
      color: colors.secondary,
    },
    {
      name: "Standing",
      seconds: 2,
      percentage: 4,
      color: colors.outline,
    },
    {
      name: "Eating",
      seconds: 0,
      percentage: 0,
      color: colors.surfaceContainerHighest,
    },
  ],
  totalValidSeconds: 50,
};

// Default mock sound mood details (Matches Screen 12: 12_catsense_ai._sound_mood)
export const mockSoundMoodDetails: SoundMoodDetails = {
  clipId: "084",
  catName: "Milo",
  acousticModel: "AI Acoustic Model 4.2",
  match: {
    mood: "Happy",
    percentage: 82,
    description: "Vibrato-rich low purr detected",
  },
  chips: [
    { label: "Happy", percentage: 82, color: colors.secondary },
    { label: "Resting", percentage: 12, color: colors.tertiaryContainer },
    { label: "Hungry", percentage: 5, color: colors.primaryContainer },
  ],
  soundTimeline: {
    timecode: "00:03.4",
    peakCallout: "Peak 480 Hz • Cat vocal burst (1.8s)",
    sequenceName: "Purr Sequence 01",
    speed: "1.0x",
    waveformBars: [
      { height: 16, color: colors.secondary },
      { height: 22, color: colors.secondary },
      { height: 32, color: colors.secondary },
      { height: 42, color: colors.secondary },
      { height: 28, color: colors.secondary },
      { height: 48, color: colors.secondary },
      { height: 60, color: colors.secondary },
      { height: 42, color: colors.secondary },
      { height: 34, color: colors.secondary },
      // Peak Zone
      { height: 50, color: colors.primary, isPeak: true },
      { height: 72, color: colors.primaryContainer, isPeak: true },
      { height: 64, color: colors.primaryContainer, isPeak: true },
      { height: 46, color: colors.primary, isPeak: true },
      // Descending
      { height: 38, color: colors.tertiaryContainer },
      { height: 26, color: colors.tertiaryContainer },
      { height: 20, color: colors.tertiaryContainer },
      { height: 32, color: colors.secondary },
      { height: 24, color: colors.secondary },
      { height: 14, color: colors.secondary },
      { height: 10, color: colors.secondary },
    ],
  },
  moodBreakdown: [
    {
      name: "Happy / Purring",
      percentage: 82,
      icon: "sentiment-very-satisfied",
      color: colors.secondary,
    },
    {
      name: "Resting / Calm",
      percentage: 12,
      icon: "bedtime",
      color: colors.tertiaryContainer,
    },
    {
      name: "Hungry / Demanding",
      percentage: 5,
      icon: "restaurant",
      color: colors.primaryContainer,
    },
    {
      name: "Defensive / Wary",
      percentage: 1,
      icon: "shield",
      color: colors.outlineVariant,
    },
    {
      name: "Pain / Distress",
      percentage: 0,
      icon: "healing",
      color: colors.error,
    },
    {
      name: "Angry / Agitated",
      percentage: 0,
      icon: "warning",
      color: colors.error,
    },
  ],
  explanation:
    "Vocal frequency indicates comfort and contentment during contact. Milo is communicating trust and low heart rate.",
};

// ---- What the FastAPI backend returns (snake_case) --------------------------------------------
type ResultDto = {
  id: string;
  cat_id: string;
  cat_name: string;
  created_at: string;
  duration_sec: number;
  risk_level: RiskLevel;
  headline: string;
  behaviors: {
    resting: number;
    grooming: number;
    moving: number;
    eating: number;
    standing: number;
  };
  dominant_mood: {
    name: string;
    percentage: number;
    description: string;
  } | null;
  secondary_moods: { name: string; percentage: number }[];
  interpretation: string;
};

type TimelineDto = {
  session_id: string;
  cat_name: string;
  created_at: string;
  clip_duration_sec: number;
  segments: {
    start_s: number;
    end_s: number;
    behavior: string;
    confidence: number;
  }[];
  focused_index: number;
  time_breakdown: {
    name: AllowedBehavior;
    seconds: number;
    percentage: number;
  }[];
  total_valid_seconds: number;
};

type SoundDto = {
  clip_id: string;
  cat_name: string;
  model_version: string | null;
  match: { name: string; percentage: number; description: string } | null;
  moods: { name: string; percentage: number }[];
  waveform: number[] | null;
  peak_time_sec: number | null;
  explanation: string;
};

// ---- Small helpers (colors and icons live here, in the app, not in the backend) --------------
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const pad2 = (n: number) => String(n).padStart(2, "0");

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()} • ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function mmss(sec: number) {
  const s = Math.max(0, Math.round(sec));
  return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
}

function preciseClock(sec: number) {
  const t = Math.round(Math.max(0, sec) * 10) / 10;
  return `${pad2(Math.floor(t / 60))}:${(t % 60).toFixed(1).padStart(4, "0")}`;
}

function later<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 50));
}

const FALLBACK_STYLE = {
  color: colors.surfaceContainerHighest,
  icon: "help-outline",
};
const BEHAVIOR_STYLE: Record<string, { color: string; icon: string }> = {
  Resting: { color: colors.tertiaryContainer, icon: "self-improvement" },
  Grooming: { color: colors.primaryContainer, icon: "clean-hands" },
  Moving: { color: colors.secondary, icon: "directions-walk" },
  Standing: { color: colors.outline, icon: "accessibility" },
  Eating: { color: colors.primary, icon: "restaurant" },
  Uncertain: FALLBACK_STYLE,
  "No cat": { color: colors.surfaceContainerLowest, icon: "visibility-off" },
};
const styleOf = (behavior: string) =>
  BEHAVIOR_STYLE[behavior] ?? FALLBACK_STYLE;

const DESCRIPTIONS: Record<string, string> = {
  Resting: "Cat appears to be resting",
  Grooming: "Cat appears to be grooming",
  Moving: "Cat is moving around",
  Standing: "Cat is standing",
  Eating: "Cat appears to be eating",
  Uncertain: "Not enough certainty for this window",
  "No cat": "Cat not visible in this window",
};

const MOOD_STYLE: { match: RegExp; icon: string; color: string }[] = [
  {
    match: /happy|purr/i,
    icon: "sentiment-very-satisfied",
    color: colors.secondary,
  },
  { match: /calm|rest/i, icon: "bedtime", color: colors.tertiaryContainer },
  { match: /hungry/i, icon: "restaurant", color: colors.primaryContainer },
  { match: /defens|wary|fear/i, icon: "shield", color: colors.outlineVariant },
  { match: /pain|distress|stress/i, icon: "healing", color: colors.error },
  { match: /angry|agitat/i, icon: "warning", color: colors.error },
];
const moodStyle = (name: string) =>
  MOOD_STYLE.find((m) => m.match.test(name)) ?? {
    icon: "graphic-eq",
    color: colors.outline,
  };

const CHIP_COLORS = [
  colors.secondary,
  colors.tertiaryContainer,
  colors.primaryContainer,
];

// ---- Service functions (mock while EXPO_PUBLIC_API_URL is empty, backend otherwise) ----------
export async function fetchAnalysisResult(
  id: string,
): Promise<AnalysisSummary> {
  if (USE_MOCK) return later(mockAnalysisResult);
  const d = await api<ResultDto>(`/analyses/${id}/result`);
  return {
    id: d.id,
    catId: d.cat_id,
    catName: d.cat_name,
    timestamp: d.created_at,
    dateFormatted: fmtDate(d.created_at),
    durationSeconds: d.duration_sec,
    riskLevel: d.risk_level,
    sentimentTitle: d.headline,
    sentimentDescription: "Overall feline sentiment index",
    clipNumber: `Clip #${d.id.slice(0, 4)}`,
    location: "", // the app does not record where the clip was filmed yet
    behaviors: d.behaviors,
    dominantMood: d.dominant_mood ?? {
      name: "Unknown",
      percentage: 0,
      description: "",
    },
    secondaryMoods: d.secondary_moods,
    interpretation: d.interpretation,
    isSynced: true,
  };
}

export async function fetchBehaviorTimeline(
  sessionId: string,
): Promise<BehaviorTimelineData> {
  if (USE_MOCK) return later(mockBehaviorTimeline);
  const d = await api<TimelineDto>(`/analyses/${sessionId}/timeline`);
  const total = Math.max(d.clip_duration_sec, 1);

  const epochs: TimelineEpoch[] = d.segments.map((s, i) => {
    const noCat = s.behavior === "No cat";
    const style = styleOf(s.behavior);
    return {
      id: `ep_${i + 1}`,
      timeRange: `${mmss(s.start_s)} - ${mmss(s.end_s)}`,
      behavior: s.behavior,
      confidence: s.confidence,
      confidenceLevel: noCat
        ? "Absent"
        : s.confidence >= 75
          ? "High"
          : s.confidence >= 40
            ? "Moderate"
            : "Low",
      description: DESCRIPTIONS[s.behavior] ?? "",
      tags: [],
      color: style.color,
      icon: style.icon,
      durationText: `${Math.round(s.end_s - s.start_s)}s window`,
      modelAgreement: noCat
        ? "No cat in view"
        : s.behavior === "Uncertain"
          ? "Low certainty"
          : `Model confidence ${s.confidence}%`,
    };
  });

  const timelineSegments: TimelineSegment[] = d.segments.map((s) => ({
    label: (s.behavior === "No cat"
      ? "No Cat"
      : s.behavior) as TimelineSegment["label"],
    percentage: Math.round(((s.end_s - s.start_s) / total) * 1000) / 10,
    color: styleOf(s.behavior).color,
    timeRange: `${mmss(s.start_s)} - ${mmss(s.end_s)}`,
  }));

  const focused = epochs[d.focused_index] ?? epochs[0];
  return {
    sessionId: d.session_id,
    catName: d.cat_name,
    timestamp: formatWhen(new Date(d.created_at).getTime()),
    clipDurationSeconds: d.clip_duration_sec,
    currentTimecode: "00:00",
    activeEpochRange: focused ? `Epoch ${focused.timeRange}` : "",
    timelineSegments,
    epochs,
    focusedEpochId: focused?.id ?? "",
    timeBreakdown: d.time_breakdown.map((b) => ({
      name: b.name,
      seconds: b.seconds,
      percentage: b.percentage,
      color: styleOf(b.name).color,
    })),
    totalValidSeconds: d.total_valid_seconds,
  };
}

export async function fetchSoundMoodDetails(
  clipId: string,
): Promise<SoundMoodDetails> {
  if (USE_MOCK) return later(mockSoundMoodDetails);
  const d = await api<SoundDto>(`/analyses/${clipId}/sound`);

  const wave = d.waveform ?? [];
  const peak = wave.length ? wave.indexOf(Math.max(...wave)) : -1;
  const waveformBars: SoundWaveBar[] = wave.map((height, i) => {
    const isPeak = peak >= 0 && Math.abs(i - peak) <= 1;
    return {
      height,
      color: isPeak ? colors.primary : colors.secondary,
      isPeak,
    };
  });
  const timecode = preciseClock(d.peak_time_sec ?? 0);

  const moodBreakdown: MoodBreakdownItem[] = d.moods.map((m) => {
    const st = moodStyle(m.name);
    return {
      name: m.name,
      percentage: m.percentage,
      icon: st.icon,
      color: st.color,
    };
  });

  return {
    clipId: d.clip_id,
    catName: d.cat_name,
    acousticModel: d.model_version
      ? `Sound model • ${d.model_version}`
      : "Sound model",
    match: d.match
      ? {
          mood: d.match.name,
          percentage: d.match.percentage,
          description: d.match.description,
        }
      : { mood: "Unknown", percentage: 0, description: "" },
    chips: d.moods.slice(0, 3).map((m, i) => ({
      label: m.name,
      percentage: m.percentage,
      color: CHIP_COLORS[i % CHIP_COLORS.length],
    })),
    soundTimeline: {
      timecode,
      peakCallout: wave.length
        ? `Loudest moment at ${timecode}`
        : "No audio detail for this clip",
      sequenceName: "Sound clip",
      speed: "1.0x",
      waveformBars,
    },
    moodBreakdown,
    explanation: d.explanation,
  };
}

export async function deleteAnalysisResult(id: string): Promise<boolean> {
  if (USE_MOCK) return later(true);
  await api<void>(`/analyses/${id}`, { method: "DELETE" });
  return true;
}
