import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IMarketTrends {
  month: string;
  bookingCount: string;
}

export const getMarketTrends = async () => {
  try {
    const response = await fetchApi.get("/dashboard/market-trends") as IMarketTrends[];
    return response;
  } catch (error) {
    console.log(error);
  }
};
