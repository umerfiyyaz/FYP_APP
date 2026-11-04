import { useCallback, useState } from "react";

import { RemoveSheet } from "@/components/ui/RemoveSheet";
import { UndoToast } from "@/components/ui/UndoToast";
import { historyActions, useHistory } from "@/store/historyStore";

/**
 * Shared "Remove -> confirm sheet -> Undo toast" flow (used by Home and History).
 *   const { ask, overlay } = useRemoveFlow('Milo');
 *   <Trash onPress={() => ask(item.id)} />   ...   {overlay}
 */
export function useRemoveFlow(catName: string) {
  const { lastRemoved } = useHistory();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const ask = useCallback((id: string) => setPendingId(id), []);
  const keep = useCallback(() => setPendingId(null), []);
  const confirm = useCallback(() => {
    if (pendingId) historyActions.remove(pendingId);
    setPendingId(null);
  }, [pendingId]);

  const overlay = (
    <>
      <RemoveSheet
        visible={pendingId !== null}
        catName={catName}
        onRemove={confirm}
        onKeep={keep}
      />
      <UndoToast
        visible={lastRemoved !== null && pendingId === null}
        onUndo={historyActions.undo}
        onDone={historyActions.clearUndo}
      />
    </>
  );
  return { ask, overlay };
}
