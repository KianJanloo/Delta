import { fetchApi } from "@/core/interceptore/fetchApi";
import { IDiscountCode } from "./createDiscountCode";

export const getDiscountCodeById = async (id: number) => {
  try {
    const response = await fetchApi.get(`/discount-codes/${id}`) as IDiscountCode;
    return response;
  } catch (error) {
    console.error("Error fetching discount code:", error);
    throw error;
  }
};
