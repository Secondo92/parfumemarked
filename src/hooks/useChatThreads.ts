// src/hooks/useChatThreads.ts

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../services/firebase";
import type { ChatThread } from "../types";

const appId =
  (window as any).__app_id !== undefined
    ? (window as any).__app_id
    : "duftbasen-default-app";

export function useChatThreads(currentUserId: string) {
  const [threads, setThreads] = useState<ChatThread[]>([]);

  useEffect(() => {
    if (!currentUserId) return;

    // Vi bruger db DIREKTE — ikke db()
    const root = collection(db, `artifacts/${appId}/public/data/chat_threads`);

    const sellerQ = query(root, where("sellerId", "==", currentUserId));
    const buyerQ = query(root, where("buyerId", "==", currentUserId));

    const map = new Map<string, ChatThread>();

    const mergeAndSet = () => {
      const arr = Array.from(map.values());
      arr.sort(
        (a, b) =>
          (b.lastMessageTimestamp?.toDate().getTime() || 0) -
          (a.lastMessageTimestamp?.toDate().getTime() || 0)
      );
      setThreads(arr);
    };

    const unsubSeller = onSnapshot(sellerQ, (snap) => {
      snap.docChanges().forEach((change) => {
        const data = change.doc.data() as any;
        map.set(change.doc.id, {
          id: change.doc.id,
          ...data,
        });
      });
      mergeAndSet();
    });

    const unsubBuyer = onSnapshot(buyerQ, (snap) => {
      snap.docChanges().forEach((change) => {
        const data = change.doc.data() as any;
        map.set(change.doc.id, {
          id: change.doc.id,
          ...data,
        });
      });
      mergeAndSet();
    });

    return () => {
      unsubSeller();
      unsubBuyer();
    };
  }, [currentUserId]);

  return threads;
}
