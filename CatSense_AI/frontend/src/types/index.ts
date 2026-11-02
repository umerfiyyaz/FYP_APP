// Data contracts & interfaces for CatSense AI Frontend
// Designed to match the FastAPI Backend / SQLAlchemy Models & ML inference output seamlessly

export type RiskLevel = "Low" | "Medium" | "High";

export type AllowedBehavior = "Resting" | "Grooming" | "Moving" | "Standing" | "Eating";

export interface AnalysisSummary {
  id: string;
  catId: string;
  catName: string;
  timestamp: string;
  dateFormatted: string;
  durationSeconds: number;
  riskLevel: RiskLevel;
  sentimentTitle: string;
  sentimentDescription: string;
  clipNumber: string;
  location: string;
  behaviors: {
    resting: number;
    grooming: number;
    moving: number;
    eating: number;
    standing: number;
  };
  dominantMood: {
    name: string;
    percentage: number;
    description: string;
  };
  secondaryMoods: Array<{
    name: string;
    percentage: number;
  }>;
  interpretation: string;
  isSynced: boolean;
}

export interface TimelineSegment {
  label: "Resting" | "Grooming" | "Uncertain" | "No Cat";
  percentage: number;
  color: string;
  timeRange: string;
}

export interface TimelineEpoch {
  id: string;
  timeRange: string;
  behavior: string;
  confidence: number;
  confidenceLevel: "High" | "Moderate" | "Low" | "Absent";
  description: string;
  tags: string[];
  color: string;
  icon: string;
  durationText: string;
  modelAgreement: string;
}

export interface TimeBreakdownItem {
  name: AllowedBehavior;
  seconds: number;
  percentage: number;
  color: string;
}

export interface BehaviorTimelineData {
  sessionId: string;
  catName: string;
  timestamp: string;
  clipDurationSeconds: number;
  currentTimecode: string;
  activeEpochRange: string;
  timelineSegments: TimelineSegment[];
  epochs: TimelineEpoch[];
  focusedEpochId: string;
  timeBreakdown: TimeBreakdownItem[];
  totalValidSeconds: number;
}

export interface SoundWaveBar {
  height: number;
  color: string;
  isPeak?: boolean;
}

export interface MoodBreakdownItem {
  name: string;
  percentage: number;
  icon: string;
  color: string;
}

export interface SoundMoodDetails {
  clipId: string;
  catName: string;
  acousticModel: string;
  match: {
    mood: string;
    percentage: number;
    description: string;
  };
  chips: Array<{
    label: string;
    percentage: number;
    color: string;
  }>;
  soundTimeline: {
    timecode: string;
    peakCallout: string;
    sequenceName: string;
    speed: string;
    waveformBars: SoundWaveBar[];
  };
  moodBreakdown: MoodBreakdownItem[];
  explanation: string;
}

