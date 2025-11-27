import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import type { Listing, ListingType } from "../types";

export function getListingsCollection(appId: string) {
  return collection(db, `artifacts/${appId}/public/data/listings`);
}

export function listenToListings(
  appId: string,
  cb: (listings: Listing[]) => void,
  onError: (error: Error) => void
) {
  const refCol = getListingsCollection(appId);
  const q = query(refCol);

  return onSnapshot(
    q,
    (snap) => {
      const result: Listing[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      result.sort(
        (a, b) =>
          (b.createdAt?.toDate?.().getTime() || 0) -
          (a.createdAt?.toDate?.().getTime() || 0)
      );
      cb(result);
    },
    (error) => {
      console.error("Firestore Listings Error", error);
      onError(error);
    }
  );
}


export async function uploadListingImages(
  appId: string,
  ownerId: string,
  files: File[]
): Promise<string[]> {
  const urls: string[] = [];

  for (const file of files) {
    const path = `artifacts/${appId}/public/listing-images/${ownerId}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    urls.push(url);
  }

  return urls;
}

interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  type: ListingType;
  sellerId: string;
  sellerName: string;
  images?: string[];
}

export async function createListing(appId: string, data: CreateListingInput) {
  const refCol = getListingsCollection(appId);
  const images = data.images ?? [];
  const primaryImg = images.length > 0 ? images[0] : null;

  await addDoc(refCol, {
    title: data.title,
    description: data.description,
    price: data.price,
    type: data.type,
    sellerId: data.sellerId,
    sellerName: data.sellerName,
    img: primaryImg,
    images,
    isActive: true,
    createdAt: serverTimestamp(),
  });
}

export async function toggleListingStatus(
  appId: string,
  listingId: string,
  currentStatus: boolean
) {
  const refDoc = doc(db, `artifacts/${appId}/public/data/listings`, listingId);
  await updateDoc(refDoc, { isActive: !currentStatus });
}

export async function deleteListing(appId: string, listingId: string) {
  const refDoc = doc(db, `artifacts/${appId}/public/data/listings`, listingId);
  const snap = await getDoc(refDoc);
  if (!snap.exists()) return;
  await deleteDoc(refDoc);
}

export async function getListingById(
  appId: string,
  id: string
): Promise<Listing | null> {
  const refDoc = doc(db, `artifacts/${appId}/public/data/listings`, id);
  const snap = await getDoc(refDoc);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as any) } as Listing;
}
