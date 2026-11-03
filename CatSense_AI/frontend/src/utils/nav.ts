import { router } from "expo-router";

/** One place for navigation, so a route rename needs a change in one file only. */
export const go = (href: string) => router.push(href as never);
export const goBack = () =>
  router.canGoBack() ? router.back() : router.replace("/(tabs)/home" as never);
