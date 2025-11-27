import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  type DocumentReference,
} from "firebase/firestore";
import { db } from "./firebase";
import type { UserProfile } from "../types";

export function getProfileDocRef(uid: string): DocumentReference {
  return doc(db, `users/${uid}`);
}

export async function getUserProfile(uid: string): Promise<UserProfile> {
  const ref = getProfileDocRef(uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const defaultProfile: UserProfile = {
      userId: uid,
      username: `Bruger-${uid.substring(0, 5)}`,
      created: new Date().toISOString(),
    };
    await setDoc(ref, defaultProfile, { merge: true });
    return defaultProfile;
  }

  return snap.data() as UserProfile;
}

export async function createUserProfile(profile: UserProfile): Promise<void> {
  const ref = getProfileDocRef(profile.userId);
  await setDoc(ref, profile, { merge: true });
}

export function listenToUserProfile(
  uid: string,
  onChange: (profile: UserProfile) => void,
  onError: (err: Error) => void
) {
  const ref = getProfileDocRef(uid);
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onChange(snap.data() as UserProfile);
      }
    },
    onError
  );
}
