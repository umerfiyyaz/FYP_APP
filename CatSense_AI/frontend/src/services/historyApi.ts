import { api } from "@/services/api";
import type { BehaviorLabel, ItemKind } from "@/store/historyStore";

// What the FastAPI backend has to return (snake_case = Pydantic). The mapping to the app's
// HistoryItem is in historyStore.ts, so the screens never see the network shape.
export type HistoryDto = {
  id: string;
  cat_id: string;
  created_at: string; // ISO
  duration_sec: number;
  kind: ItemKind;
  behavior: BehaviorLabel;
  confidence: number; // 0..100
  mood: string;
  title: string;
  subtitle: string;
  risk: number; // 0..100
  thumb_url: string | null;
};

export const historyApi = {
  list: (catId: string) => api<HistoryDto[]>(`/cats/${catId}/analyses`),
  remove: (id: string) => api<void>(`/analyses/${id}`, { method: "DELETE" }),
};
