import { fetchApi } from "@/core/interceptore/fetchApi";
import { IDiscountCode } from "./createDiscountCode";

export interface UpdateDiscountCodePayload {
  code?: string;
  house_id?: number;
  discount_percentage?: number;
  valid_until?: string | null;
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
