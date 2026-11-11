import { api, apiUpload } from "@/services/api";
import type { AlertDto, AlertStatus, CatDto, Environment } from "@/types/pets";

// Endpoints the FastAPI backend has to provide (the stores call these only when EXPO_PUBLIC_API_URL is set).
export const petsApi = {
  listCats: () => api<CatDto[]>("/cats"),
  createCat: (body: {
    name: string;
    breed: string;
    age_years: number;
    environment: Environment;
  }) => api<CatDto>("/cats", { method: "POST", body }),
  updateCat: (
    id: string,
    patch: Partial<
      Pick<CatDto, "name" | "breed" | "age_years" | "environment" | "photo_url">
    >,
  ) => api<void>(`/cats/${id}`, { method: "PATCH", body: patch }),
  /** Save the cat's profile photo on the server (JPG, PNG or WEBP, up to 5 MB). Returns the updated cat. */
  uploadPhoto: (id: string, uri: string) => {
    const ext = (uri.split("?")[0].split(".").pop() ?? "jpg").toLowerCase();
    const mime =
      ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : "image/jpeg";
    const form = new FormData();
    form.append("file", {
      uri,
      name: `photo.${ext}`,
      type: mime,
    } as unknown as Blob);
    return apiUpload<CatDto>(`/cats/${id}/photo`, form, 60000);
  },
  deleteCat: (id: string) => api<void>(`/cats/${id}`, { method: "DELETE" }),
  listAlerts: (catId: string) => api<AlertDto[]>(`/cats/${catId}/alerts`),
  setAlertStatus: (id: string, status: AlertStatus) =>
    api<void>(`/alerts/${id}`, { method: "PATCH", body: { status } }),
};
