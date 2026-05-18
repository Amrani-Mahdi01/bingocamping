"use client";

import { create } from "zustand";
import type { Customer } from "@/lib/types";
import { customers } from "@/lib/mock/customers";

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AuthState {
  user: Customer | null;
  isAuthenticated: boolean;
  /** Mock — any non-empty creds succeed, sets user to first mock customer.
      Resolves after a short delay to give the UI a real "loading" state. */
  login: (email: string, password: string) => Promise<void>;
  /** Mock — creates a virtual customer from the form values. */
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  /** Demo helper used by Header to flip auth without a form. */
  loginDemo: () => void;
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email, password) => {
    if (!email.trim() || !password.trim()) {
      throw new Error("Identifiants invalides");
    }
    await delay(450);
    const user = customers[0] ?? null;
    set({ user, isAuthenticated: !!user });
  },

  register: async (data) => {
    if (!data.email.trim() || !data.firstName.trim() || !data.lastName.trim()) {
      throw new Error("Champs requis manquants");
    }
    await delay(450);
    const now = new Date().toISOString();
    const user: Customer = {
      id: `cust-new-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      wilayaId: "16",
      addresses: [],
      totalSpent: 0,
      orderCount: 0,
      createdAt: now,
    };
    set({ user, isAuthenticated: true });
  },

  logout: () => set({ user: null, isAuthenticated: false }),

  loginDemo: () => {
    const user = customers[0] ?? null;
    if (user) set({ user, isAuthenticated: true });
  },
}));
