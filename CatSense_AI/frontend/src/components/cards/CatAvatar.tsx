import {
  Image,
  ImageSourcePropType,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

import { colors, radius } from "@/theme";

type Props = {
  source: ImageSourcePropType;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

/** Round cat photo. */
export function CatAvatar({ source, size = 48, style }: Props) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius.full,
          overflow: "hidden",
          backgroundColor: colors.surfaceContainerHigh,
        },
        style,
      ]}
    >
      <Image
        source={source}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </View>
  );
}
