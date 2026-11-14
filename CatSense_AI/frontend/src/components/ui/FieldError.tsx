import { Text, View } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { colors, type } from "@/theme";

/** One red message under a form field. Shows nothing when there is no text. */
export function FieldError({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 6,
      }}
    >
      <Icon name="info-outline" size={13} color={colors.error} />
      <Text style={[type.bodySm, { color: colors.error, flex: 1 }]}>
        {text}
      </Text>
    </View>
  );
}
