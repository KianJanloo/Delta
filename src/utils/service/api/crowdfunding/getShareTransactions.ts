import { fetchApi } from "@/core/interceptore/fetchApi";
import { IShareTransfer } from "./createShareTransfer";

export interface GetShareTransactionsParams {
  page?: number;
  limit?: number;
  type?: string;
}

export const getShareTransactions = async (params?: GetShareTransactionsParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    
    const query = queryParams.toString();
    const url = query ? `/crowdfunding/shares/transactions?${query}` : '/crowdfunding/shares/transactions';
    
    const response = await fetchApi.get(url) as IShareTransfer[];
    return response;
  } catch (error) {
    console.error("Error fetching share transactions:", error);
    throw error;
  }
};

