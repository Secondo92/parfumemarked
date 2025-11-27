import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  setDoc,
  deleteDoc,
  getDocs,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db as firestore } from "./firebase";
import type { ChatMessage, ChatThread, Listing } from "../types";

export const CHATS_ROOT = (appId: string) =>
  `artifacts/${appId}/public/data/chats`;

export function getChatRoomId(
  listingId: string,
  buyerId: string,
  sellerId: string
) {
  return `${listingId}_${buyerId}_${sellerId}`;
}

export function listenToChatMessages(
  appId: string,
  chatId: string,
  cb: (messages: ChatMessage[]) => void,
  onError: (error: Error) => void
) {
  const ref = collection(
    firestore,
    `${CHATS_ROOT(appId)}/${chatId}/messages`
  );
  const q = query(ref, orderBy("timestamp"));

  return onSnapshot(
    q,
    (snap) => {
      const messages: ChatMessage[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      cb(messages);
    },
    (error) => {
      console.error("Chat listen error", error);
      onError(error);
    }
  );
}

export async function sendChatMessage(params: {
  appId: string;
  listing: Listing;
  text: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  senderId: string;
  senderName: string;
}) {
  const {
    appId,
    listing,
    text,
    sellerId,
    buyerId,
    buyerName,
    senderId,
    senderName,
  } = params;

  const chatId = getChatRoomId(listing.id, buyerId, sellerId);

  const messagesRef = collection(
    firestore,
    `${CHATS_ROOT(appId)}/${chatId}/messages`
  );

  const threadRef = doc(
    firestore,
    `artifacts/${appId}/public/data/chat_threads`,
    chatId
  );

  await setDoc(
    threadRef,
    {
      listingId: listing.id,
      listingTitle: listing.title,
      sellerId,
      sellerName: listing.sellerName,
      buyerId,
      buyerName,
      lastMessageText: text,
      lastMessageTimestamp: serverTimestamp(),
    },
    { merge: true }
  );

  await addDoc(messagesRef, {
    text,
    senderId,
    senderName,
    timestamp: serverTimestamp(),
  });
}

export async function deleteChatThread(appId: string, threadId: string) {
  const messagesRef = collection(
    firestore,
    `${CHATS_ROOT(appId)}/${threadId}/messages`
  );
  const snap = await getDocs(messagesRef);

  await Promise.all(
    snap.docs.map((d) => deleteDoc(d.ref))
  );

  await deleteDoc(
    doc(
      firestore,
      `artifacts/${appId}/public/data/chat_threads`,
      threadId
    )
  );
}
