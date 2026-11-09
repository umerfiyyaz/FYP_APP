import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";

import { restoreSession } from "@/services/auth";
import { colors } from "@/theme";

// App start: a saved, valid login goes straight to Home, otherwise to the login screen.
export default function Index() {
  const [target, setTarget] = useState<"/(tabs)/home" | "/(auth)/login" | null>(
    null,
  );

  useEffect(() => {
    let alive = true;
    restoreSession().then((user) => {
      if (alive) setTarget(user ? "/(tabs)/home" : "/(auth)/login");
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!target) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  return <Redirect href={target} />;
}
