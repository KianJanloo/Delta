import { fetchApi } from "@/core/interceptore/fetchApi";
import { IBroker } from "./registerBroker";

export interface GetAdminBrokersParams {
  page?: number;
  limit?: number;
  level?: string;
  status?: string;
}

export const getAdminBrokers = async (params?: GetAdminBrokersParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.level) queryParams.append('level', params.level);
    if (params?.status) queryParams.append('status', params.status);
    
    const query = queryParams.toString();
    const url = query ? `/brokerage/admin/brokers?${query}` : '/brokerage/admin/brokers';
    
    const response = await fetchApi.get(url) as IBroker[];
    return response;
  } catch (error) {
    console.error("Error fetching admin brokers:", error);
    throw error;
  }
};

