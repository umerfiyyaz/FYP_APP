// Holds the video the user picked + the part they kept, until the upload starts.
// (Processing screen reads this when we connect it to the backend.)

export type PendingUpload = {
  uri: string;
  name: string;
  mimeType: string;
  durationSec: number;
  /** null = whole video (no trimming) */
  trimStart: number | null;
  trimEnd: number | null;
};

let pending: PendingUpload | null = null;

export const setPendingUpload = (p: PendingUpload | null) => {
  pending = p;
};
export const getPendingUpload = () => pending;
export const clearPendingUpload = () => {
  pending = null;
};
