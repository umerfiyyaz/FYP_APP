import type { ComponentProps } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { colors } from "@/theme";

// The prototype uses Google "Material Symbols". MaterialIcons has the same icons
// (names use "-" instead of "_", e.g. photo_camera -> photo-camera).
export type IconName = ComponentProps<typeof MaterialIcons>["name"];
export type CommunityIconName = ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

type Props<N> = {
  name: N;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function Icon({
  name,
  size = 20,
  color = colors.onSurface,
  style,
}: Props<IconName>) {
  return <MaterialIcons name={name} size={size} color={color} style={style} />;
}

/** For the few icons that MaterialIcons does not have (e.g. heart-pulse). */
export function CommunityIcon({
  name,
  size = 20,
  color = colors.onSurface,
  style,
}: Props<CommunityIconName>) {
  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
}
