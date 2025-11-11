import { fetchApi } from "@/core/interceptore/fetchApi";
import { IInvestment } from "./makeInvestment";

export interface GetMyInvestmentsParams {
  page?: number;
  limit?: number;
}

export const getMyInvestments = async (params?: GetMyInvestmentsParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    const url = query ? `/crowdfunding/my-investments?${query}` : '/crowdfunding/my-investments';
    
    const response = await fetchApi.get(url) as IInvestment[];
    return response;
  } catch (error) {
    console.error("Error fetching my investments:", error);
    throw error;
  }
};

