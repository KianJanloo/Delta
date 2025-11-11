import { fetchApi } from "@/core/interceptore/fetchApi";

export const deleteDiscountCode = async (id: number) => {
  try {
    const response = await fetchApi.delete(`/discount-codes/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting discount code:", error);
    throw error;
  }
};
