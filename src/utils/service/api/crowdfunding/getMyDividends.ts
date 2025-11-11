import { fetchApi } from "@/core/interceptore/fetchApi";
import { IDividend } from "./calculateDividends";

export interface GetMyDividendsParams {
  page?: number;
  limit?: number;
}

export const getMyDividends = async (params?: GetMyDividendsParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    const url = query ? `/crowdfunding/my-dividends?${query}` : '/crowdfunding/my-dividends';
    
    const response = await fetchApi.get(url) as IDividend[];
    return response;
  } catch (error) {
    console.error("Error fetching my dividends:", error);
    throw error;
  }
};

