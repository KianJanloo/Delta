import { fetchApi } from "@/core/interceptore/fetchApi";
import { ICrowdfundingProject } from "./createProject";

export interface GetAdminProjectsParams {
  page?: number;
  limit?: number;
}

export const getAdminProjects = async (params?: GetAdminProjectsParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    const url = query ? `/crowdfunding/admin/projects?${query}` : '/crowdfunding/admin/projects';
    
    const response = await fetchApi.get(url) as ICrowdfundingProject[];
    return response;
  } catch (error) {
    console.error("Error fetching admin projects:", error);
    throw error;
  }
};

