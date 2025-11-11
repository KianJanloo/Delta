import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IProjectInvestor {
  id: number;
  userId: number;
  projectId: number;
  amount: number;
  shares: number;
  investedAt: string;
}

export interface GetProjectInvestorsParams {
  page?: number;
  limit?: number;
}

export const getProjectInvestors = async (projectId: number, params?: GetProjectInvestorsParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    const url = query ? `/crowdfunding/projects/${projectId}/investors?${query}` : `/crowdfunding/projects/${projectId}/investors`;
    
    const response = await fetchApi.get(url) as IProjectInvestor[];
    return response;
  } catch (error) {
    console.error("Error fetching project investors:", error);
    throw error;
  }
};

