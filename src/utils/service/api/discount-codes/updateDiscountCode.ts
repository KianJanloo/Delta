import { fetchApi } from "@/core/interceptore/fetchApi";
import { IDiscountCode } from "./createDiscountCode";

export interface UpdateDiscountCodePayload {
  code?: string;
  discount_percentage?: number;
  expiresAt?: string;
  usageLimit?: number;
}

export const updateDiscountCode = async (id: number, payload: UpdateDiscountCodePayload) => {
  try {
    const response = await fetchApi.put(`/discount-codes/${id}`, payload) as IDiscountCode;
    return response;
  } catch (error) {
    console.error("Error updating discount code:", error);
    throw error;
  }
};
