import { useEffect, useMemo } from "react";
import { ActivityIndicator, View } from "react-native";

import { HistoryEmpty } from "@/features/history/HistoryEmpty";
import { HistoryFeed } from "@/features/history/HistoryFeed";
import { useActiveCat } from "@/store/catStore";
import {
  historyActions,
  itemsOf,
  useHistory,
  useHistoryLoaded,
} from "@/store/historyStore";
import { colors } from "@/theme";

// Screens 15 + 16 - History tab. File: app/(tabs)/history.tsx
// Shows the empty screen (15) when the active cat has no analyses, otherwise the list (16).
export default function HistoryScreen() {
  const cat = useActiveCat();
  const { items } = useHistory();
  const loaded = useHistoryLoaded(cat?.id);
  const mine = useMemo(() => itemsOf(items, cat?.id), [items, cat?.id]);

  useEffect(() => {
    if (cat) historyActions.hydrate(cat.id); // backend: loads this cat's results (mock: nothing)
  }, [cat?.id]);

  if (!loaded && mine.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.primaryContainer} />
      </View>
    );
  }
  return mine.length === 0 ? (
    <HistoryEmpty cat={cat} />
  ) : (
    <HistoryFeed cat={cat} items={mine} />
  );
}
