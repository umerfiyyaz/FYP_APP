import { HomeDashboard } from "@/features/home/HomeDashboard";
import FirstScanHome from "@/features/home/FirstScanHome";
import { useActiveCat } from "@/store/catStore";
import { itemsOf, useHistory } from "@/store/historyStore";

export default function HomeScreen() {
  const { items } = useHistory();
  const cat = useActiveCat();
  return itemsOf(items, cat?.id).length > 0 ? (
    <HomeDashboard />
  ) : (
    <FirstScanHome />
  );
}
