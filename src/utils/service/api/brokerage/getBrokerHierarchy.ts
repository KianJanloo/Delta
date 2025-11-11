import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IBrokerNode {
  id: number;
  userId: number;
  brokerCode: string;
  level: number;
  totalSales: number;
  totalCommission: number;
  children: IBrokerNode[];
}

export interface GetBrokerHierarchyParams {
  depth?: number;
}

export const getBrokerHierarchy = async (params?: GetBrokerHierarchyParams) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.depth) queryParams.append('depth', params.depth.toString());
    
    const query = queryParams.toString();
    const url = query ? `/brokerage/hierarchy?${query}` : '/brokerage/hierarchy';
    
    const response = await fetchApi.get(url) as IBrokerNode;
    return response;
  } catch (error) {
    console.error("Error fetching broker hierarchy:", error);
    throw error;
  }
};

