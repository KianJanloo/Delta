import { fetchApi } from "@/core/interceptore/fetchApi";
import { ISale } from "./recordSale";

export const completeSale = async (saleId: number) => {
  try {
    const response = await fetchApi.put(`/brokerage/sales/${saleId}/complete`, {}) as ISale;
    return response;
  } catch (error) {
    console.error("Error completing sale:", error);
    throw error;
  }
};

