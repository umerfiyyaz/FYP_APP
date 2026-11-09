import { apiUpload } from "@/services/api";
import type { PendingUpload } from "@/services/pendingUpload";

export type UploadResponse = { analysis_id: string; status: string };

/** POST /cats/{id}/videos. trim_start / trim_end are only sent when the user trimmed. */
export function uploadVideo(
  catId: string,
  video: PendingUpload,
): Promise<UploadResponse> {
  const form = new FormData();
  // React Native's FormData takes { uri, name, type } for a file.
  form.append("file", {
    uri: video.uri,
    name: video.name,
    type: video.mimeType,
  } as unknown as Blob);
  form.append("source", "upload");
  if (video.trimStart !== null && video.trimEnd !== null) {
    form.append("trim_start", String(video.trimStart));
    form.append("trim_end", String(video.trimEnd));
  }
  return apiUpload<UploadResponse>(`/cats/${catId}/videos`, form);
}
