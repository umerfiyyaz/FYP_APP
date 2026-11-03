import { api } from "@/services/api";
import type { AlertDto, AlertStatus, CatDto } from "@/types/pets";

// Endpoints the FastAPI backend has to provide (the stores call these only when EXPO_PUBLIC_API_URL is set).
export const petsApi = {
  listCats: () => api<CatDto[]>("/cats"),
  updateCat: (
    id: string,
    patch: Partial<
      Pick<CatDto, "name" | "breed" | "age_years" | "environment" | "photo_url">
    >,
  ) => api<void>(`/cats/${id}`, { method: "PATCH", body: patch }),
  deleteCat: (id: string) => api<void>(`/cats/${id}`, { method: "DELETE" }),
  listAlerts: (catId: string) => api<AlertDto[]>(`/cats/${catId}/alerts`),
  setAlertStatus: (id: string, status: AlertStatus) =>
    api<void>(`/alerts/${id}`, { method: "PATCH", body: { status } }),
};
