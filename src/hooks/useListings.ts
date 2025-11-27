// src/hooks/useListings.ts
import { useEffect, useState } from "react";
import type { Listing } from "../types";
import { listenToListings } from "../services/listingsService";

const appId =
  (window as any).__app_id !== undefined
    ? (window as any).__app_id
    : "duftbasen-default-app";

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsub = listenToListings(
      appId,
      (ls) => setListings(ls),
      (err) => setError(err)
    );
    return () => unsub();
  }, []);

  return { listings, error, appId };
}
