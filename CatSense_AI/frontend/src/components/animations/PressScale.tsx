import type { ReactNode } from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";

type Props = Omit<PressableProps, "style" | "children"> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Scale while pressed (Tailwind "active:scale-95" -> 0.95). */
  scaleTo?: number;
};

/** Pressable that shrinks a little while it is pressed. */
export function PressScale({
  children,
  style,
  scaleTo = 0.95,
  disabled,
  ...rest
}: Props) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        style,
        pressed && !disabled && { transform: [{ scale: scaleTo }] },
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}
