import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IPricePoint {
  date: string;
  price: number;
}

export const getPriceHistory = async (houseId: number) => {
  try {
    const response = await fetchApi.get(`/price-history/${houseId}`) as IPricePoint[];
    return response;
  } catch (error) {
    console.error("Error fetching price history:", error);
    throw error;
  }
};
