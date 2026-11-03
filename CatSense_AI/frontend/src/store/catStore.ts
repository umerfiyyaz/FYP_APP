import { useSyncExternalStore } from "react";

import { catPhotos } from "@/constants/catImages";
import { images } from "@/constants/images";
import { USE_MOCK } from "@/services/api";
import { petsApi } from "@/services/petsApi";
import type { Cat, CatDto } from "@/types/pets";

// ---------------------------------------------------------------------------------------------
// Cats + the "active cat". Same tiny store style as historyStore (no extra library, fast).
// Mock data until EXPO_PUBLIC_API_URL is set; then hydrate() loads the cats from the backend.
// ---------------------------------------------------------------------------------------------

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

type State = { cats: Cat[]; activeId: string | null };

function seed(): Cat[] {
  const now = Date.now();
  return [
    {
      id: "milo",
      name: "Milo",
      breed: "Domestic Shorthair",
      ageYears: 3,
      environment: "Indoor",
      photo: catPhotos.milo,
      createdAt: new Date(2026, 8, 12).getTime(),
      baselineVideos: 2,
      lastAnalysisAt: now - 14 * MIN,
      mood: "Calm & Content",
      note: "Baseline in progress",
      attention: null,
    },
    {
      id: "luna",
      name: "Luna",
      breed: "Siamese",
      ageYears: 1,
      environment: "Indoor",
      photo: catPhotos.luna,
      createdAt: new Date(2026, 9, 2).getTime(),
      baselineVideos: 3,
      lastAnalysisAt: now - DAY,
      mood: "Resting",
      note: "Quiet day",
      attention: null,
    },
    {
      id: "oliver",
      name: "Oliver",
      breed: "Maine Coon",
      ageYears: 5,
      environment: "Both",
      photo: catPhotos.oliver,
      createdAt: new Date(2026, 9, 18).getTime(),
      baselineVideos: 1,
      lastAnalysisAt: now - 3 * HOUR,
      mood: "Alert",
      note: "",
      attention: "Vocal pattern shift flagged",
    },
  ];
}

let state: State = { cats: seed(), activeId: "milo" };
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

export function useCats() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
/** The cat the whole app is looking at (Home, History, Alerts ...). */
export function useActiveCat(): Cat | undefined {
  const s = useCats();
  return s.cats.find((c) => c.id === s.activeId) ?? s.cats[0];
}
export function useCat(id: string | undefined): Cat | undefined {
  const s = useCats();
  return s.cats.find((c) => c.id === id);
}

function toCat(d: CatDto): Cat {
  return {
    id: d.id,
    name: d.name,
    breed: d.breed,
    ageYears: d.age_years,
    environment: d.environment,
    photo: d.photo_url ? { uri: d.photo_url } : images.mascot,
    createdAt: new Date(d.created_at).getTime(),
    baselineVideos: d.baseline_videos,
    lastAnalysisAt: d.last_analysis_at
      ? new Date(d.last_analysis_at).getTime()
      : null,
    mood: d.mood ?? "",
    note: d.note ?? "",
    attention: d.attention,
  };
}

export const catActions = {
  setActive(id: string) {
    if (state.cats.some((c) => c.id === id) && id !== state.activeId)
      set({ ...state, activeId: id });
  },
  add(cat: Cat) {
    set({ cats: [...state.cats, cat], activeId: cat.id });
  },
  update(id: string, patch: Partial<Cat>) {
    const before = state.cats.find((c) => c.id === id);
    if (!before) return;
    set({
      ...state,
      cats: state.cats.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    });
    if (USE_MOCK) return;
    petsApi
      .updateCat(id, {
        name: patch.name,
        breed: patch.breed,
        age_years: patch.ageYears,
        environment: patch.environment,
      })
      .catch(() =>
        set({
          ...state,
          cats: state.cats.map((c) => (c.id === id ? before : c)),
        }),
      ); // server said no -> undo
  },
  /** Removes the cat. Returns true if another cat is left. */
  remove(id: string): boolean {
    const before = state;
    const cats = state.cats.filter((c) => c.id !== id);
    const activeId =
      state.activeId === id ? (cats[0]?.id ?? null) : state.activeId;
    set({ cats, activeId });
    if (!USE_MOCK) petsApi.deleteCat(id).catch(() => set(before));
    return cats.length > 0;
  },
  async hydrate() {
    if (USE_MOCK) return;
    try {
      const cats = (await petsApi.listCats()).map(toCat);
      set({
        cats,
        activeId: cats.some((c) => c.id === state.activeId)
          ? state.activeId
          : (cats[0]?.id ?? null),
      });
    } catch {
      /* offline: keep what we have */
    }
  },
  resetDemo() {
    set({ cats: seed(), activeId: "milo" });
  },
};

export const ageText = (y: number) => `${y} ${y === 1 ? "year" : "years"}`;
export const ageShort = (y: number) => `${y} ${y === 1 ? "yr" : "yrs"}`;
