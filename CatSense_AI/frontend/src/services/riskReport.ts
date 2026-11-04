import { useEffect, useState } from "react";

import { api, USE_MOCK } from "@/services/api";
import type { HistoryItem } from "@/store/historyStore";

// With EXPO_PUBLIC_API_URL set, useRiskReport() loads  GET /analyses/{id}/risk  (rule-based risk score
// + baseline comparison from the backend) and returns exactly the RiskReport shape below.
// Without it, buildRiskReport() makes the demo report. The screen is the same in both cases.

export type Factor = {
  id: string;
  icon: "sleep" | "food" | "sound";
  title: string;
  text: string;
  ok: boolean;
};

export type BaselineRow = {
  id: string;
  label: string;
  icon: "sleep" | "food" | "paw";
  /** Percent change vs the cat's own baseline, or null for a plain "Normal" badge. */
  delta: number | null;
};

export type RiskReport = {
  score: number;
  summary: string;
  factors: Factor[];
  baselineNote: string;
  baseline: BaselineRow[];
};

export function buildRiskReport(
  item: HistoryItem,
  catName: string,
): RiskReport {
  const alert = item.kind === "alert";
  return {
    score: item.risk,
    summary: alert
      ? `${catName} showed changes that are worth a closer look. Consider a vet check if it repeats.`
      : `${catName} shows well-regulated daily rhythms with stable comfort indicators.`,
    factors: [
      {
        id: "rest",
        icon: "sleep",
        title: "Rested as much as usual",
        text: "Resting time is in line with the usual 7-day pattern.",
        ok: true,
      },
      {
        id: "eat",
        icon: "food",
        title: "Ate normally",
        text: "Eating looked steady, without hesitation or pacing.",
        ok: true,
      },
      alert
        ? {
            id: "sound",
            icon: "sound",
            title: "Pain-like sounds heard",
            text: "A distressed vocal tone was picked up. A vet review is recommended.",
            ok: false,
          }
        : {
            id: "sound",
            icon: "sound",
            title: "No pain sounds heard",
            text: "Soft purring picked up and no signs of vocal distress.",
            ok: true,
          },
    ],
    baselineNote: "Baseline based on 2 of 3 videos — less reliable",
    baseline: [
      { id: "rest", label: "Resting", icon: "sleep", delta: 2 },
      { id: "eat", label: "Eating", icon: "food", delta: null },
      { id: "move", label: "Moving", icon: "paw", delta: -1 },
    ],
  };
}

/** Report for a result: instant demo data first, replaced by the backend report when it arrives. */
export function useRiskReport(
  item: HistoryItem | undefined,
  catName: string,
): RiskReport | null {
  const [remote, setRemote] = useState<RiskReport | null>(null);
  const id = item?.id;

  useEffect(() => {
    setRemote(null);
    if (USE_MOCK || !id) return;
    let off = false;
    api<RiskReport>(`/analyses/${id}/risk`)
      .then((r) => {
        if (!off) setRemote(r);
      })
      .catch(() => {}); // offline: the local report stays
    return () => {
      off = true;
    };
  }, [id]);

  return remote ?? (item ? buildRiskReport(item, catName) : null);
}
