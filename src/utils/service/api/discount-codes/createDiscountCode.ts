import { fetchApi } from "@/core/interceptore/fetchApi";

export interface CreateDiscountCodePayload {
  code: string;
  house_id: number;
  discount_percentage: number;
  valid_until?: string | null;
}

export interface IDiscountCode {
  id: number;
  code: string;
  discount_percentage: number;
  house_id?: number | null;
  valid_until?: string | null;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  expiresAt?: string;
  usageLimit?: number;
  usedCount?: number;
}

export const createDiscountCode = async (payload: CreateDiscountCodePayload) => {
  try {
    const response = await fetchApi.post("/discount-codes", payload) as IDiscountCode;
    return response;
  } catch (error) {
    console.error("Error creating discount code:", error);
    throw error;
  }
};
