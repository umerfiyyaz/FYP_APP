import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";

import { restoreSession } from "@/services/auth";
import { colors } from "@/theme";

type Target = "/(tabs)/home" | "/(auth)/login" | "/verify-email?next=home";

// App start: a saved, valid login goes straight to Home (or to the "enter your code" screen when the
// email is not verified yet), otherwise to the login screen.
export default function Index() {
  const [target, setTarget] = useState<Target | null>(null);

  useEffect(() => {
    let alive = true;
    restoreSession().then((user) => {
      if (!alive) return;
      if (!user) setTarget("/(auth)/login");
      else
        setTarget(
          user.email_verified ? "/(tabs)/home" : "/verify-email?next=home",
        );
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
  return <Redirect href={target as never} />;
}
