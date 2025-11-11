import { fetchApi } from "@/core/interceptore/fetchApi";
import { ISale } from "./recordSale";

export interface GetBrokerSalesParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const getBrokerSales = async (params?: GetBrokerSalesParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    
    const query = queryParams.toString();
    const url = query ? `/brokerage/sales?${query}` : '/brokerage/sales';
    
    const response = await fetchApi.get(url) as ISale[];
    return response;
  } catch (error) {
    console.error("Error fetching broker sales:", error);
    throw error;
  }
};

