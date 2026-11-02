import type { ImageSourcePropType } from "react-native";

// The prototype images are loaded from the Stitch server so the screens look right immediately.
// For a real/offline app: download each image, save it in  frontend/assets/images/  and replace the
// { uri: '...' } with  require('../../assets/images/<file>.jpg')  (file names are written next to each line).
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
  mascot: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkr_bEL0BcBhwkhw_A2lc7Ze23J2jlZZO4WOfuyelNbvlXCUz_Ds4IloXFMfqxtADm7VY259hLdW28wVRzRe0T6pLIHCtiAJ8DfPOcyFvwywaxTuX22GB4WEQkYpdU6rx4Hgyu-fv_pSndSx0xkZF7VpStc5-TSmxUayFmUq1st12ZjEniQmVFiDbYFV3jR9QSKfWd7CVDB1wkGUkEG_waO4Sm6WY-VoHQbucByl-c",
  },
  // assets/images/cat-portrait.jpg
  catPortrait: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvOeM_lggr4QY1bVj9CIVjQiJgbKFtZc65ypB4lfAbiHlR8KkhfovJ20d6HflGgbAU9xFariFx5zZ6RN4YHz04cYlF09EFlzGzifP80yvp46aULz1XUkgukx0leHACnLCk5J_ShITXmIaxWViW9uEOVkcFxssXOknpju65ttebfvf29ayv6Bu2X9dVVll7BdU_zefpB-H-PWq1eTx0diLkT7zmvYD0q5G27RXbZEfJ",
  },
  // assets/images/cat-edit.jpg
  catEdit: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDK7jdwSYdUlxThgJfSyBfQUqEw5781-BON9MVpWxez7okaTJYgkDEAnBQz9iSL1cMGpkCxMzhMO37uq8kBL6NKIZbufQJodgXGYllrvqtaUdrPvJpkb0yjY72Q_CzU4E3PPOiXNy805LWlzHw-_7SADAY_atZG9BQMscMNTAUNT0dRtRT5KeYnEh8EOCp7paSFdNLwcELAQjAlve4ByQ1knHebsplFW7fnkBckqLD3",
  },
  // assets/images/cat-headphones.jpg
  headphones: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8Qab0psSjQcP_9puTk2DhjhYyvcrl_BJC-4mENeFvOp97t-Pd6A-nRUrfRKR3I3WB8cLqLdtKZ9eCNBjdexvZr-ZyJFE05DDDipJEw4bpPyjvaBIDDoivFO7i4xyP5yb9D9KkhN7BQyimTfgDWRMWxwf0Cl4ZGJgu5DeXh5jftHfXXxN8-lOf9Wek02LU6eVrR5LE1qOFGCwjp5D5TSQ0cOGsyE3zrEfWx2hhpnx7",
  },
  // assets/images/cat-baseline.jpg (Screen 4 profile badge)
  catBaseline: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6K22zhJGKne111JdRPtb3-vRrzELI9ujKJOwh57-qQwBjjDHNabFNe_BCKz0aAz2nQC-oq0N9Cvyw-OwFGWRfcJNGPSucYcgsah-99O15e9FzkIvR78Rs8YQkANxks5KTdbkJY9XeHn5QJAJPBmMsd_uNXPMZMyV2nkEYYZT5ClB9v1pxyiOo-_6mO5QWzj0VRzkmSG5q5MeZ0f4Lo_ULnvhUo0uHPHQEqoVQgw0o",
  },
  // assets/images/logo-small.png (Screens 5 & 6 Header mascot logo)
  logoSmall: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC634NJocH7sS9e7J66Z0ulUOLrRAOhNNXMXdHClec_a5HRoGEwyAZ6hR1MAMkPnC4cuF8oGJ54zxOv7p1pm-Bw4yM9PQlNpUN9hI_dj1bjP0tBGM5FV7DKdQLw5v5QdYNTWe5CH-08l2p16StshN8jdNj15I2qIMYq1hIi5Xpe4dP5kMLuPFZxOY2bVUWU6dM3zA8QD4Vn_CwK2TY9seQSpHZDRtss6ZyvB3tFG2R4",
  },
  // assets/images/user-profile.jpg (Screens 5 & 6 Header profile avatar)
  userProfile: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAm5unVEnGsae9Z1Up4FSZ5jgOJ3_Bep5LxOL3AOOHmM34dluEmphWKF543pqru4gNswBB6svGqFHpq0wL8QO0crN5PHEpYM3BfJeDUt5NKAIZjVIoN3GtRMsTau3uG_ukXXY615ADQG5tPECP4YFUFeV9bcmIKCQsDMHAMN2nUFDAdaySMIKuGT6u9R7BnX8Qn38gIn59wVKVR640ddiJeI2Pq_WfhhHf1Bl0cf1Gi",
  },
  // assets/images/cat-milo.jpg (Screen 5 Milo ready chip)
  catMilo: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCalHkCpPnDqnDCq60hYIfnWvQ0xvAPGkL1wkQIsvj2MHXGe8p0LxssYn2n2JfEEbwdAx1KovtK3pgKE23jH-GZMMQjH_sMUlZFxVlhBH-oGPKjwP90ciyCA0u8lFNqvDV6HO_OBKbH6uAod_5Qr_BYdCeYl1mK4HPY33_-DbBet-R3Yp1zUW4nNyw-uKJp79zufZA2l-L2KjLEgpzVLLi2NtN4AmimqMSlZxWpdoNQ",
  },
  // assets/images/cat-hero-3d.jpg (Screen 5 3D stretching cat mascot hero)
  catHero3D: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXCnnt5GWgcwWHcTbY0D-frMfq5yuD1eXSCt3nLTzWjPUjoe1u4y4jZYj_ncTHM6MtMRIqNFuH6Feo2PWvEsSd2bKo6XAsRoju7mWku5LNj_p93Llkkd71Gqph7Qf1eZ8mXOrnwtRn4YUHNvfqIs1zsVcpqLnRLflBNOQcLNgUChtAFPmV31-v7nXJMZJjI-KdUA99GLU6hSN2V1SRYD1efKVb54XEr-dZac8eDFES",
  },
  // assets/images/pose-tracking.jpg (Screen 6 Pose Tracking card)
  poseTracking: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7t6uEHpIZ0zetIKy4-kxcAOcyW6xKkG0berwAH24qM-nI6u9jRLHRxIfELOw-6gwS0AM1agAy6u8ynfOoovJL9M8SsKxkGIlb_y4I1-PXseYL3wT2vIoSkh8StVOGYk8PRpD5mBKFkQG26KLKzcQNsX6ijXynNEUJhhc2fEMbatBKdPtO4gIslM5UFtPrG5gbAzXg1wvLu1GMoNPuUEinKOYJNNTB7_JiwqFZY-h9",
  },
  // assets/images/bio-acoustics.jpg (Screen 6 Bio-Acoustics card)
  bioAcoustics: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgPYrB-kzbD5mWtgalS6I_VurJy_ofNgeD4QO28jLHVNIwd7WacZNw2DYDmaXXoGJ4tuD78h5kBHIsSGuV3xtgGzNmQPG5LAUlABhkNuJEZM734WdvDYocsoj8GWFjgtaQGwFyshZJ1SwquGzZ5Fxjgomjtz25PZPVpfL-OnvQNzgWD-JRoV38yDBCk7HJd_0IudRqinwhgyN6CxOWtfOe1-oT1FsTQLUun2SJd6nN",
  },
  // assets/images/camera-bg-cat.jpg (Screen 7 Live camera feed cat background)
  cameraBgCat: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBAnrGIxAPv27SNbVLwZ_MOb2MCwRWJtDnZLet5Q9ntTN33NToL84R1L0mQwD4X8A8gPRgMKOvU9ikifr54u2uYLQYgQPlyuvPbMhj_796q8AbQPio3tnhjMN0epI_f7Z144TCT7u1IdEBQX79o6N3W2rSZivoB7SWItZ_R4EQrgWf_6S_Kx0ElO7F3jYfKpM23_M8UG_5akr10lPQ3dPEfHq2OoUh-I7L6HDQs9KG",
  },
  // assets/images/gallery-thumbnail.jpg (Screen 7 Gallery media thumbnail)
  galleryThumbnail: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCzm35AYQWRs4PudPhSW1sDMFRcmT91WO8blfc2V8mgtd-zrJZ5EhwA0AG1U9vR0SttAcCCxu5e-qeEPEUl7iowqk5f3kMd88fxici0zphCnbeWzGp9fe4Le8tzuSv5816yaeAPK2kAwCCeeRZs3L15uioEQnIQx9oCC0Ya0tg2cuOkSOWUc5H4Ksu8z19gLTD0RyM1SkN2M3Fb98EUeZwmRpdKV4Kdfiedn_u_U_Z",
  },
  // assets/images/mascot-sense.png (Screen 8 Processing Mascot Sense avatar)
  mascotSense: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp3zQNOE2MOLNHKV6i34DKJD53XMVQunhw1RmaKBHu0L-cz29rs6BJ5pmSll4Z7gDf94QkQ9mQZLkfYwyH-vafeIYGVGq8nnqlBTq4aPIXeix9JVQTKRQw9LREoPR9_WWta--vysyS0pYXf_5heIJmcnffxwpngKyiRQMNiwWtP4oppylAJVy-KDnjmHaUAnp5qumBPRbCUzT-uppLVa8_kMaGWqipz5OVGV6AOI-E",
  },
  // assets/images/mascot-no-cat.png (Screen 9 No Cat Detected perplexed mascot)
  mascotNoCat: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzHlVh5JF3tQPtfloC5F8Po1LyQ9jcvMAw3lMyzpYC3rUP2DrlPJoQyOD2W6_XGyLFTAPBKQHW3bEONQpPxtEbnl_9CCpt-mQHUG2jYrwow46QJJWsfpBKUPw6IXDciunV1SoH9Zn-0FqG7-e8wJXdKDnAons6OSVJWd-dpuk35Yi1f0nDzWaqpTx6EcDuj1wg5VkUgvLPXmhQq2nFH5oo4zYiyIM7wrzw04K6ju0O",
  },
  // assets/images/mascot-purring.png (Screen 10 3D cat mascot purring peacefully)
  mascotPurring: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDu5bC0gDmsbcu7a4wIcln32hXpaBUB4nJfAWF1S9V9fHqbYiC5dQufQIk_xmEApsbkv-DCIak7d_NWwIsL0I3hRDrLRcCeSaB-ric4_rCMql0hejqbQdq_wN6VQEUe9SPtF5CwTiXaIX59jDOxRj8sBzuSqDNQjoTtt_aznKum7lI6Znr_z23fx6VazHf7NA9E7uYgDd0m9ogkmR8qXcQBl68vDgZQX710B_JfxyjA",
  },
  // assets/images/video-still-milo.jpg (Screen 10 British shorthair cat video frame)
  videoStillMilo: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWSW4yA-MfuR3I1qdfVJPlBn8ql4yDFnAsMsdpo2_OgQbJHBVKHGheIa-leNj6mPd0cLseEy6baANl0DQzQjr0IFegYh6CbZDUuispBRv9cLPdS4mE0p_vqfouXvE-yxnUzg7v2B0rP3-vXahktL9r2FHf4L894x0an5cqJIQy2_FmF9P6OaOJZY558pM6c_YqDSGvlPY2GcF2F6j0n5WyZC9O8moZ0lB7nnh5JufX",
  },
  // assets/images/video-still-grooming.jpg (Screen 11 ginger cat grooming video frame)
  videoStillGrooming: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ_RlakNVT1a1d5nUJapA_MtMtu0ZCTSXYs3MpwuT-9TLN2DkHi7VB4LChgeZPujX0ewwAP_WYCsfpguOVHbeuzSKmgfiFKS_zPQgDxJRjBfvZlywtcnV1P9825scywZ14LAVZ-qWUL0oyxGvkxqV__syBC6kupXNDDZkgsukWn5_o7h2U18fpHUUGB47it4jtwhbV6y3onfwVysdk_I4nSO7QQkDpMwKamP3sCM5s",
  },
  // assets/images/mascot-sound-happy.png (Screen 12 cute tabby cat mascot with glowing mint aura)
  mascotSoundHappy: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB90RKX5x998SfUVQ4V6GpYw75VQFK9Vgs66FPzQHyb97SRbJXZlmIZ0wSP7zTTLQ_4wR1oGvFrxhFM_sUIUOqA575puJ7bLliWQMXkKBQW549zpaLhOhIcGTDkqVOqJ-eIET5TRa5RrTEHOFGIvBgVWWl94PCZkus9hHinqi11Zw9hQj-zHgQZ7vuhZ7Ka2ZpXW815FblEUJoEP00qxxYhJoGn0QHxC4vtdfkbpHXq",
  },
};
