// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../services/firebase";
import { createUserProfile, getUserProfile } from "../services/profileService";
import type { UserProfile } from "../types";

export interface UseAuthResult {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;

  register: (email: string, password: string, username: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export default function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Observerer login-status + loader profil
  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("AUTH STATE CHANGE", currentUser);

      setUser(currentUser);

      // Ikke logget ind → nulstil
      if (!currentUser) {
        console.log("Ingen bruger. Stopper loading.");
        setProfile(null);
        setLoading(false);
        return;
      }

      // Logget ind → hent profil
      (async () => {
        try {
          console.log("🔍 HENTER PROFIL FOR:", currentUser.uid);

          const p = await getUserProfile(currentUser.uid);

          console.log("✅ FIK PROFIL:", p);

          setProfile(p);
          setError(null);
        } catch (err: any) {
          console.error("❌ PROFIL FEJL:", err);

          // fallback
          const fallback: UserProfile = {
            userId: currentUser.uid,
            username:
              currentUser.email ?? `Bruger-${currentUser.uid.substring(0, 5)}`,
            created: new Date().toISOString(),
          };

          console.log("⚠️ BRUGER FALLBACK PROFIL:", fallback);

          setProfile(fallback);
          setError(err?.message ?? "Profilfejl");
        } finally {
          console.log("⏳ LOADING FALSE (after profile load)");
          setLoading(false);
        }
      })();
    });

    return () => unsubscribe();
  }, []);

  // 🔵 Opret bruger
  const register = async (email: string, password: string, username: string) => {
    try {
      setError(null);
      setLoading(true);
      console.log("📌 Register:", email, username);

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      console.log("📌 Opretter profil for uid:", uid);

      await createUserProfile({
        userId: uid,
        username,
        created: new Date().toISOString(),
      });

      const p = await getUserProfile(uid);
      console.log("📌 Fik profil efter oprettelse:", p);

      setProfile(p);
    } catch (err: any) {
      console.error("❌ REGISTER ERROR", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Log ind
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      console.log("📌 LOGIN:", email);

      const cred = await signInWithEmailAndPassword(auth, email, password);

      console.log("📌 Login successful. Henter profil...");

      const p = await getUserProfile(cred.user.uid);

      console.log("📌 Profil hentet:", p);

      setProfile(p);
    } catch (err: any) {
      console.error("❌ LOGIN ERROR", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Log ud
  const logout = async () => {
    try {
      setError(null);
      console.log("📌 LOGGER UD");

      await signOut(auth);
      setProfile(null);

      console.log("📌 Logget ud.");
    } catch (err: any) {
      console.error("❌ LOGOUT ERROR", err);
      setError(err.message);
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    register,
    login,
    logout,
  };
}
