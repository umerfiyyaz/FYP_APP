import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import FirstScanHome from "@/features/home/FirstScanHome";
import { HomeDashboard } from "@/features/home/HomeDashboard";
import { alertActions } from "@/store/alertStore";
import { useActiveCat } from "@/store/catStore";
import {
  historyActions,
  itemsOf,
  useHistory,
  useHistoryLoaded,
} from "@/store/historyStore";
import { colors } from "@/theme";

export default function HomeScreen() {
  const { items } = useHistory();
  const cat = useActiveCat();
  const loaded = useHistoryLoaded(cat?.id);
  const mine = itemsOf(items, cat?.id);

  // backend: load this cat's results and alerts (demo mode: nothing happens)
  useEffect(() => {
    if (cat) {
      historyActions.hydrate(cat.id);
      alertActions.hydrate(cat.id);
    }
  }, [cat?.id]);

  if (cat && !loaded && mine.length === 0) {
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
  return mine.length > 0 ? <HomeDashboard /> : <FirstScanHome />;
}
