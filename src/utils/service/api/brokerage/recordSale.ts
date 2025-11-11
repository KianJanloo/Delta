import { fetchApi } from "@/core/interceptore/fetchApi";

export interface RecordSalePayload {
  houseId: number;
  buyerId: number;
  saleAmount: number;
  description?: string;
}

export interface ISale {
  id: number;
  brokerId: number;
  houseId: number;
  buyerId: number;
  saleAmount: number;
  commission: number;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const recordSale = async (payload: RecordSalePayload) => {
  try {
    const response = await fetchApi.post("/brokerage/sales", payload) as ISale;
    return response;
  } catch (error) {
    console.error("Error recording sale:", error);
    throw error;
  }
};

