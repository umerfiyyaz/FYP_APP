import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing } from "@/theme";

type Props = {
  children: ReactNode;
  /** Extra style for the padded content box (e.g. { overflow: 'hidden' } for screens with glows). */
  contentStyle?: StyleProp<ViewStyle>;
};

/** Dark background + safe area + scrolling + keyboard handling + 20px side margins. */
export function Screen({ children, contentStyle }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            {
              flex: 1,
              paddingHorizontal: spacing.margin,
              paddingBottom: spacing.xl,
            },
            contentStyle,
          ]}
        >
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
