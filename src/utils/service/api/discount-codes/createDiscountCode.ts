import { fetchApi } from "@/core/interceptore/fetchApi";

export interface CreateDiscountCodePayload {
  code: string;
  discount_percentage: number;
  expiresAt?: string;
  usageLimit?: number;
}

export interface IDiscountCode {
  id: number;
  code: string;
  discount_percentage: number;
  expiresAt?: string;
  usageLimit?: number;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
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
