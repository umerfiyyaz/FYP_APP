import type { ImageSourcePropType } from "react-native";

// Cat photos of the demo cats, bundled inside the app (frontend/assets/images/) so they show without internet.
// For the real app the photo of each cat comes from the backend (photo_url) or from the image picker.
export const catPhotos: Record<
  | "milo"
  | "miloCard"
  | "miloShelf"
  | "luna"
  | "oliver"
  | "allClear"
  | "sleepingKitten",
  ImageSourcePropType
> = {
  // assets/images/milo.jpg
  milo: require("../../assets/images/milo.jpg"),
  // assets/images/miloCard.jpg
  miloCard: require("../../assets/images/miloCard.jpg"),
  // assets/images/miloShelf.jpg
  miloShelf: require("../../assets/images/miloShelf.jpg"),
  // assets/images/luna.jpg
  luna: require("../../assets/images/luna.jpg"),
  // assets/images/oliver.jpg
  oliver: require("../../assets/images/oliver.jpg"),
  // assets/images/allClear.jpg
  allClear: require("../../assets/images/allClear.jpg"),
  // assets/images/sleepingKitten.jpg (History: empty state)
  sleepingKitten: require("../../assets/images/sleepingKitten.jpg"),
};
