import type { Timestamp } from "firebase/firestore";

export type ListingType = "fullBottle" | "decant" | "split";

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  type: ListingType;
  img: string | null;
  images?: string[];
  sellerId: string;
  sellerName: string;
  isActive: boolean;
  createdAt?: Timestamp;
}

export interface UserProfile {
  userId: string;
  username: string;
  name?: string;
  created: string;
}


export interface ChatThread {
  id: string;
  listingId: string;
  listingTitle: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  lastMessageText?: string;
  lastMessageTimestamp?: Timestamp;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp?: Timestamp;
}
