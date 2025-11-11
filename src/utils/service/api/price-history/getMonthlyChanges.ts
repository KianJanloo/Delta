import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IMonthlyChange {
  month: string;
  percentageChange: number;
}

export const getPriceHistoryMonthlyChanges = async (houseId: number) => {
  try {
    const response = await fetchApi.get(`/price-history/${houseId}/monthly-changes`) as IMonthlyChange[];
    return response;
  } catch (error) {
    console.error("Error fetching monthly price changes:", error);
    throw error;
  }
};
