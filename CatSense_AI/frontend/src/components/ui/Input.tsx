import { ReactNode, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from "react-native";

import { colors, radius, shadows, type } from "@/theme";
import { Icon, IconName } from "./Icon";

type Props = Omit<TextInputProps, "style"> & {
  leftIcon?: IconName;
  leftIconSize?: number;
  leftIconColor?: string;
  /** Space between the left icon and the text. */
  iconGap?: number;
  /** Anything shown at the right end (eye button, search icon ...). */
  right?: ReactNode;
  inputStyle?: StyleProp<TextStyle>;
  /** Inner (inset) shadow of the sunken field. */
  shadow?: string;
};

/** Sunken ("inset") text field from the design system. Gets an orange ring when focused. */
export function InsetField({
  leftIcon,
  leftIconSize = 20,
  leftIconColor = colors.outline,
  iconGap = 0,
  right,
  inputStyle,
  shadow = shadows.insetField,
  onFocus,
  onBlur,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.box,
        {
          boxShadow: focused
            ? `${shadow}, 0 0 0 1px ${colors.primaryContainer}`
            : shadow,
        },
      ]}
    >
      {leftIcon && (
        <Icon
          name={leftIcon}
          size={leftIconSize}
          color={leftIconColor}
          style={{ marginRight: iconGap }}
        />
      )}
      <TextInput
        {...rest}
        placeholderTextColor={colors.outline}
        selectionColor={colors.primaryContainer}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[styles.input, inputStyle]}
      />
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.base,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
    color: colors.onSurface,
    ...type.bodyMd,
  },
});
