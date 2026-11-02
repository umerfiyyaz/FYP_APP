import type { ImageSourcePropType } from "react-native";

// The prototype images are loaded from the Stitch server so the screens look right immediately.
// For a real/offline app: download each image, save it in  frontend/assets/images/  and replace the
// { uri: '...' } with  require('../../assets/images/<file>.jpg')  (file names are written next to each line).
export const images: Record<
  "mascot" | "catPortrait" | "catEdit" | "headphones",
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
};
