"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { api } from "@/lib/api/client";

interface FavoritesState {
  /** Local copy of favorited product IDs. Always the source of truth for UI. */
  items: string[];
  /**
   * Currently linked customerId. When set, every mutation is mirrored to the
   * backend; when null, favorites live only in localStorage (guest mode).
   */
  customerId: string | null;

  isFavorite: (productId: string) => boolean;
  toggle: (productId: string) => void;
  clear: () => void;

  /**
   * Called by the auth store after login/register. Fetches the customer's
   * server-side favorites, merges them with the current local list (union of
   * both sets so nothing the guest had selected is dropped), writes the merged
   * set back to the server, and stores it locally.
   */
  syncWithServer: (customerId: string) => Promise<void>;

  /**
   * Called by the auth store on logout. Stops syncing future toggles to the
   * server but keeps local favorites in storage so the guest experience picks
   * up where they left off.
   */
  disconnect: () => void;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      customerId: null,

      isFavorite: (productId) => get().items.includes(productId),

      toggle: (productId) => {
        const exists = get().items.includes(productId);
        const next = exists
          ? get().items.filter((id) => id !== productId)
          : [...get().items, productId];
        set({ items: next });

        // Fire-and-forget DB sync for logged-in users.
        const cid = get().customerId;
        if (cid) {
          void api.favorites.set(cid, next).catch(() => {
            /* swallow — UI already updated, retry on next toggle */
          });
        }
      },

      clear: () => {
        set({ items: [] });
        const cid = get().customerId;
        if (cid) {
          void api.favorites.set(cid, []).catch(() => {});
        }
      },

      syncWithServer: async (customerId) => {
        set({ customerId });
        try {
          const remote = await api.favorites.list(customerId);
          const merged = Array.from(new Set([...get().items, ...remote]));
          set({ items: merged });
          // Push the merged set back so future devices see the union too.
          if (merged.length !== remote.length) {
            await api.favorites.set(customerId, merged);
          }
        } catch {
          /* keep local items as-is if the network/mock call fails */
        }
      },

      disconnect: () => set({ customerId: null }),
    }),
    {
      name: "bingo-favorites",
      storage: createJSONStorage(() => localStorage),
      // Persist only the IDs — never persist customerId across reloads because
      // we always re-derive it from the auth state when the user logs back in.
      partialize: (state) => ({ items: state.items }),
      version: 1,
    }
  )
);
