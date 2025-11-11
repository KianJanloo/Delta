import { fetchApi } from "@/core/interceptore/fetchApi";

export interface ICommission {
  id: number;
  brokerId: number;
  saleId: number;
  amount: number;
  type: string;
  status: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetBrokerCommissionsParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}

export const getBrokerCommissions = async (params?: GetBrokerCommissionsParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    
    const query = queryParams.toString();
    const url = query ? `/brokerage/commissions?${query}` : '/brokerage/commissions';
    
    const response = await fetchApi.get(url) as ICommission[];
    return response;
  } catch (error) {
    console.error("Error fetching broker commissions:", error);
    throw error;
  }
};

