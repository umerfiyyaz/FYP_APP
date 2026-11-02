// Analysis API Service & Mock Provider
// When backend is connected, simply swap the returned mock data with `api.get(...)` / `api.post(...)`.

import {
  AnalysisSummary,
  BehaviorTimelineData,
  SoundMoodDetails,
} from "@/types";
import { colors } from "@/theme";

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

// Async service functions ready for real backend HTTP calls:
export async function fetchAnalysisResult(id: string): Promise<AnalysisSummary> {
  // TODO: When backend is active: return (await api.get(`/api/v1/analysis/${id}`)).data;
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAnalysisResult), 50);
  });
}

export async function fetchBehaviorTimeline(
  sessionId: string,
): Promise<BehaviorTimelineData> {
  // TODO: When backend is active: return (await api.get(`/api/v1/behavior/${sessionId}`)).data;
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockBehaviorTimeline), 50);
  });
}

export async function fetchSoundMoodDetails(
  clipId: string,
): Promise<SoundMoodDetails> {
  // TODO: When backend is active: return (await api.get(`/api/v1/sound/${clipId}`)).data;
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSoundMoodDetails), 50);
  });
}

export async function deleteAnalysisResult(id: string): Promise<boolean> {
  // TODO: When backend is active: return (await api.delete(`/api/v1/analysis/${id}`)).data.success;
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 50);
  });
}

