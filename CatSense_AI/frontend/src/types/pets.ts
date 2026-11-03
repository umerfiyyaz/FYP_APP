import type { ImageSourcePropType } from "react-native";

export type Environment = "Indoor" | "Outdoor" | "Both";

export type Cat = {
  id: string;
  name: string;
  breed: string;
  ageYears: number;
  environment: Environment;
  photo: ImageSourcePropType;
  createdAt: number; // ms
  /** How many baseline videos are done (3 = baseline complete). */
  baselineVideos: number;
  lastAnalysisAt: number | null;
  /** Short mood text shown on the switcher ("Calm & Content", "Resting"). */
  mood: string;
  /** Small line under the card ("Quiet day"). */
  note: string;
  /** If set, the cat needs attention (shown in coral). */
  attention: string | null;
};

export type AlertLevel = "high" | "medium" | "advisory";
export type AlertStatus = "open" | "resolved" | "dismissed" | "acknowledged";

export type PetAlert = {
  id: string;
  catId: string;
  /** History item that caused the alert (opens its result / sound screen). */
  itemId: string;
  level: AlertLevel;
  title: string;
  detail: string;
  /** Part of `detail` that is shown bold. */
  emphasis?: string;
  /** "Video analysis", "Sound analysis" ... */
  source: string;
  createdAt: number;
  confidence?: number; // 0..100
  durationSec?: number;
  status: AlertStatus;
};

// ---- API shapes (snake_case = what FastAPI/Pydantic returns) ------------------------------------
export type CatDto = {
  id: string;
  name: string;
  breed: string;
  age_years: number;
  environment: Environment;
  photo_url: string | null;
  created_at: string; // ISO
  baseline_videos: number;
  last_analysis_at: string | null;
  mood: string | null;
  note: string | null;
  attention: string | null;
};

export type AlertDto = {
  id: string;
  cat_id: string;
  item_id: string;
  level: AlertLevel;
  title: string;
  detail: string;
  emphasis: string | null;
  source: string;
  created_at: string;
  confidence: number | null;
  duration_sec: number | null;
  status: AlertStatus;
};
