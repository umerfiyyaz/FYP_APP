import { useSyncExternalStore } from "react";

// ---------------------------------------------------------------------------------------------
// History store: tiny, dependency-free, fast (only components that read it re-render).
// Today it holds MOCK data. When the FastAPI backend exists, replace `seed()` with a fetch and
// make `add` / `remove` call the API (keep the same function names, the screens will not change).
// ---------------------------------------------------------------------------------------------

export type ItemKind = "behavior" | "sound" | "alert";
// Behavior labels shown to the user (matches the 5-output model). Never "Playing".
export type BehaviorLabel =
  | "Eating"
  | "Grooming"
  | "Resting"
  | "Moving"
  | "Standing";

export type HistoryItem = {
  id: string;
  catId: string;
  createdAt: number; // ms since epoch
  durationSec: number;
  kind: ItemKind;
  behavior: BehaviorLabel;
  confidence: number; // 0..100
  mood: string; // Happy, Calm, Defensive ...
  title: string;
  subtitle: string;
  risk: number; // 0..100 AI health risk index
};

type State = {
  items: HistoryItem[];
  /** Last removed item (for the "Undo" toast). */
  lastRemoved: { item: HistoryItem; index: number } | null;
};

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function seed(): HistoryItem[] {
  const now = Date.now();
  return [
    {
      id: "a1",
      catId: "milo",
      createdAt: now - 14 * MIN,
      durationSec: 30,
      kind: "behavior",
      behavior: "Resting",
      confidence: 92,
      mood: "Happy",
      title: "Gentle purring & loaf pose",
      subtitle: "Posture steady • Purr detected",
      risk: 18,
    },
    {
      id: "a2",
      catId: "milo",
      createdAt: now - 1 * DAY - 2 * HOUR,
      durationSec: 30,
      kind: "behavior",
      behavior: "Grooming",
      confidence: 88,
      mood: "Happy",
      title: "Relaxed grooming session",
      subtitle: "Calm movement • No distress sounds",
      risk: 22,
    },
    {
      id: "a3",
      catId: "milo",
      createdAt: now - 2 * DAY - 5 * HOUR,
      durationSec: 28,
      kind: "alert",
      behavior: "Standing",
      confidence: 76,
      mood: "Defensive",
      title: "Pain sounds detected",
      subtitle: "Review recommended with primary veterinarian",
      risk: 58,
    },
    {
      id: "a4",
      catId: "milo",
      createdAt: now - 3 * DAY - 1 * HOUR,
      durationSec: 36,
      kind: "behavior",
      behavior: "Moving",
      confidence: 81,
      mood: "Happy",
      title: "Active walking around the room",
      subtitle: "Smooth gait • Normal pace",
      risk: 20,
    },
    {
      id: "a5",
      catId: "milo",
      createdAt: now - 4 * DAY,
      durationSec: 24,
      kind: "sound",
      behavior: "Resting",
      confidence: 90,
      mood: "Calm",
      title: "Soft purring",
      subtitle: "Low, steady vocal tone",
      risk: 15,
    },
    {
      id: "a6",
      catId: "milo",
      createdAt: now - 9 * DAY,
      durationSec: 31,
      kind: "behavior",
      behavior: "Eating",
      confidence: 85,
      mood: "Happy",
      title: "Normal meal",
      subtitle: "Steady eating pace",
      risk: 17,
    },
  ];
}

let state: State = { items: seed(), lastRemoved: null };
const listeners = new Set<() => void>();

function set(next: State) {
  state = next;
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const getSnapshot = () => state;

/** Subscribe a component to the history. */
export function useHistory() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export const historyActions = {
  /** Auto-save: call this when an analysis finishes (no "Save" button needed). */
  add(item: HistoryItem) {
    set({ ...state, items: [item, ...state.items] });
  },
  remove(id: string) {
    const index = state.items.findIndex((i) => i.id === id);
    if (index < 0) return;
    set({
      items: state.items.filter((i) => i.id !== id),
      lastRemoved: { item: state.items[index], index },
    });
  },
  undo() {
    const r = state.lastRemoved;
    if (!r) return;
    const items = state.items.slice();
    items.splice(Math.min(r.index, items.length), 0, r.item);
    set({ items, lastRemoved: null });
  },
  clearUndo() {
    if (state.lastRemoved) set({ ...state, lastRemoved: null });
  },
  /** Demo helper: empty the list to see the "No analyses yet" screen. */
  clearAll() {
    set({ items: [], lastRemoved: null });
  },
  resetDemo() {
    set({ items: seed(), lastRemoved: null });
  },
};

export function getItem(id: string | undefined) {
  return state.items.find((i) => i.id === id);
}

// ---- formatting helpers (shared by Home / History / Risk screens) ----------------------------

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function formatClock(ts: number) {
  const d = new Date(ts);
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}

export function formatWhen(ts: number) {
  const startToday = new Date();
  startToday.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((startToday.getTime() - ts) / DAY) + 1;
  if (ts >= startToday.getTime()) return `Today ${formatClock(ts)}`;
  if (diffDays === 1) return `Yesterday ${formatClock(ts)}`;
  if (diffDays < 7) return `${DAYS[new Date(ts).getDay()]} ${formatClock(ts)}`;
  return `${new Date(ts).getDate()}/${new Date(ts).getMonth() + 1} ${formatClock(ts)}`;
}

export function formatAgo(ts: number) {
  const min = Math.max(1, Math.round((Date.now() - ts) / MIN));
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
}

export function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export type Period = "week" | "month" | "all";
export function inPeriod(ts: number, p: Period) {
  if (p === "all") return true;
  return Date.now() - ts <= (p === "week" ? 7 : 30) * DAY;
}
