import { Redirect } from "expo-router";

// TODO (later): if the user has a token -> /(tabs)/home, else -> login.
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
