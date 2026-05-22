"use client";

import { http } from "@/lib/api/http";
import type { Wilaya } from "@/lib/types";

interface ListResponse {
  data: Wilaya[];
}
interface SingleResponse {
  data: Wilaya;
}

/** Shipping price + delivery days are the only editable fields per wilaya. */
export interface WilayaUpdate {
  shippingPrice: number;
  deliveryDays: number;
}

export const wilayasApi = {
  /** Public — used by the delivery page and checkout for shipping ranges. */
  list(): Promise<Wilaya[]> {
    return http
      .get<ListResponse>("/api/wilayas", { auth: "none" })
      .then((r) => r.data);
  },

  /** Admin — same shape, requires auth. */
  listAll(): Promise<Wilaya[]> {
    return http
      .get<ListResponse>("/api/admin/wilayas", { auth: "admin" })
      .then((r) => r.data);
  },

  update(id: string, payload: WilayaUpdate): Promise<Wilaya> {
    return http
      .put<SingleResponse>(`/api/admin/wilayas/${id}`, payload, { auth: "admin" })
      .then((r) => r.data);
  },
};
