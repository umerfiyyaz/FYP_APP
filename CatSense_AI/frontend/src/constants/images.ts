import type { ImageSourcePropType } from "react-native";

// The prototype images are bundled inside the app (frontend/assets/images/), so they also show without internet.
// They were downloaded once with download-images.ps1; the file name is written above each line.
export const images: Record<
  | "mascot"
  | "catPortrait"
  | "catEdit"
  | "headphones"
  | "catBaseline"
  | "logoSmall"
  | "userProfile"
  | "catMilo"
  | "catHero3D"
  | "poseTracking"
  | "bioAcoustics"
  | "cameraBgCat"
  | "galleryThumbnail"
  | "mascotSense"
  | "mascotNoCat"
  | "mascotPurring"
  | "videoStillMilo"
  | "videoStillGrooming"
  | "mascotSoundHappy",
  ImageSourcePropType
> = {
  // assets/images/mascot.jpg
  mascot: require("../../assets/images/mascot.jpg"),
  // assets/images/cat-portrait.jpg
  catPortrait: require("../../assets/images/cat-portrait.jpg"),
  // assets/images/cat-edit.jpg
  catEdit: require("../../assets/images/cat-edit.jpg"),
  // assets/images/cat-headphones.jpg
  headphones: require("../../assets/images/cat-headphones.jpg"),
  // assets/images/cat-baseline.jpg (Screen 4 profile badge)
  catBaseline: require("../../assets/images/cat-baseline.jpg"),
  // assets/images/logo-small.png (Screens 5 & 6 Header mascot logo)
  logoSmall: require("../../assets/images/logo-small.png"),
  // assets/images/user-profile.jpg (Screens 5 & 6 Header profile avatar)
  userProfile: require("../../assets/images/user-profile.jpg"),
  // assets/images/cat-milo.jpg (Screen 5 Milo ready chip)
  catMilo: require("../../assets/images/cat-milo.jpg"),
  // assets/images/cat-hero-3d.jpg (Screen 5 3D stretching cat mascot hero)
  catHero3D: require("../../assets/images/cat-hero-3d.jpg"),
  // assets/images/pose-tracking.jpg (Screen 6 Pose Tracking card)
  poseTracking: require("../../assets/images/pose-tracking.jpg"),
  // assets/images/bio-acoustics.jpg (Screen 6 Bio-Acoustics card)
  bioAcoustics: require("../../assets/images/bio-acoustics.jpg"),
  // assets/images/camera-bg-cat.jpg (Screen 7 Live camera feed cat background)
  cameraBgCat: require("../../assets/images/camera-bg-cat.jpg"),
  // assets/images/gallery-thumbnail.jpg (Screen 7 Gallery media thumbnail)
  galleryThumbnail: require("../../assets/images/gallery-thumbnail.jpg"),
  // assets/images/mascot-sense.png (Screen 8 Processing Mascot Sense avatar)
  mascotSense: require("../../assets/images/mascot-sense.png"),
  // assets/images/mascot-no-cat.png (Screen 9 No Cat Detected perplexed mascot)
  mascotNoCat: require("../../assets/images/mascot-no-cat.png"),
  // assets/images/mascot-purring.png (Screen 10 3D cat mascot purring peacefully)
  mascotPurring: require("../../assets/images/mascot-purring.png"),
  // assets/images/video-still-milo.jpg (Screen 10 British shorthair cat video frame)
  videoStillMilo: require("../../assets/images/video-still-milo.jpg"),
  // assets/images/video-still-grooming.jpg (Screen 11 ginger cat grooming video frame)
  videoStillGrooming: require("../../assets/images/video-still-grooming.jpg"),
  // assets/images/mascot-sound-happy.png (Screen 12 cute tabby cat mascot with glowing mint aura)
  mascotSoundHappy: require("../../assets/images/mascot-sound-happy.png"),
};
