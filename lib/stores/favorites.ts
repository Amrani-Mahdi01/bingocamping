"use client";

import { create } from "zustand";

interface FavoritesState {
  items: string[]; // productIds
  toggle: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clear: () => void;
}

export const useFavorites = create<FavoritesState>((set, get) => ({
  items: [],
  toggle: (productId) =>
    set((state) => ({
      items: state.items.includes(productId)
        ? state.items.filter((id) => id !== productId)
        : [...state.items, productId],
    })),
  isFavorite: (productId) => get().items.includes(productId),
  clear: () => set({ items: [] }),
}));
