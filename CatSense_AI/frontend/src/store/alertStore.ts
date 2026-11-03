import { useSyncExternalStore } from "react";

import { USE_MOCK } from "@/services/api";
import { petsApi } from "@/services/petsApi";
import type { AlertDto, AlertStatus, PetAlert } from "@/types/pets";

// Alerts of the active cat. Rule-based risk alerts come from the backend later (risk score + baseline).

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

type State = {
  alerts: PetAlert[];
  push: boolean;
  /** Last change, for the "Undo" toast. */
  last: { id: string; prev: AlertStatus; label: string } | null;
};

function seed(): PetAlert[] {
  const now = Date.now();
  return [
    {
      id: "al1",
      catId: "milo",
      itemId: "a3",
      level: "high",
      title: "Pain sounds detected",
      detail: "Pain-like vocal pattern in the recording.",
      source: "Sound analysis",
      createdAt: now - 2 * DAY - 5 * HOUR,
      confidence: 94,
      durationSec: 14,
      status: "open",
    },
    {
      id: "al2",
      catId: "milo",
      itemId: "a2",
      level: "medium",
      title: "Fighting or defensive sound",
      detail:
        "Sudden spike in low-frequency vocalization and a defensive posture.",
      source: "Video analysis",
      createdAt: now - 3 * DAY - 2 * HOUR,
      status: "open",
    },
    {
      id: "al3",
      catId: "milo",
      itemId: "a1",
      level: "advisory",
      title: "Long inactivity",
      detail: "Milo was resting 4.2h longer than his usual baseline.",
      emphasis: "4.2h longer",
      source: "Baseline comparison",
      createdAt: now - 4 * DAY,
      status: "open",
    },
  ];
}

let state: State = { alerts: seed(), push: true, last: null };
const listeners = new Set<() => void>();
const set = (next: State) => {
  state = next;
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const getSnapshot = () => state;

export function useAlerts() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

function change(id: string, status: AlertStatus, label: string) {
  const a = state.alerts.find((x) => x.id === id);
  if (!a || a.status === status) return;
  set({
    ...state,
    alerts: state.alerts.map((x) => (x.id === id ? { ...x, status } : x)),
    last: { id, prev: a.status, label },
  });
  if (!USE_MOCK)
    petsApi.setAlertStatus(id, status).catch(() => alertActions.undo());
}

function toAlert(d: AlertDto): PetAlert {
  return {
    id: d.id,
    catId: d.cat_id,
    itemId: d.item_id,
    level: d.level,
    title: d.title,
    detail: d.detail,
    emphasis: d.emphasis ?? undefined,
    source: d.source,
    createdAt: new Date(d.created_at).getTime(),
    confidence: d.confidence ?? undefined,
    durationSec: d.duration_sec ?? undefined,
    status: d.status,
  };
}

export const alertActions = {
  resolve: (id: string) => change(id, "resolved", "Alert resolved"),
  dismiss: (id: string) => change(id, "dismissed", "Alert dismissed"),
  acknowledge: (id: string) => change(id, "acknowledged", "Alert acknowledged"),
  undo() {
    const l = state.last;
    if (!l) return;
    set({
      ...state,
      alerts: state.alerts.map((x) =>
        x.id === l.id ? { ...x, status: l.prev } : x,
      ),
      last: null,
    });
    if (!USE_MOCK) petsApi.setAlertStatus(l.id, l.prev).catch(() => {});
  },
  clearUndo() {
    if (state.last) set({ ...state, last: null });
  },
  setPush(push: boolean) {
    set({ ...state, push }); // later: save on the backend / device token
  },
  async hydrate(catId: string) {
    if (USE_MOCK) return;
    try {
      const alerts = (await petsApi.listAlerts(catId)).map(toAlert);
      set({
        ...state,
        alerts: [...state.alerts.filter((a) => a.catId !== catId), ...alerts],
      });
    } catch {
      /* offline */
    }
  },
  resetDemo() {
    set({ alerts: seed(), push: state.push, last: null });
  },
};

export const openAlertsOf = (alerts: PetAlert[], catId: string | undefined) =>
  alerts.filter((a) => a.catId === catId && a.status === "open");
