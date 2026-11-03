import * as ImagePicker from "expo-image-picker";

/** Opens the photo library and returns the chosen image uri (square crop), or null if cancelled. */
export async function pickPhotoUri(): Promise<string | null> {
  try {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (res.canceled) return null;
    return res.assets[0]?.uri ?? null;
  } catch {
    return null;
  }
}
