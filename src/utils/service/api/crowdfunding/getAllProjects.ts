import { fetchApi } from "@/core/interceptore/fetchApi";
import { ICrowdfundingProject } from "./createProject";

export interface GetAllProjectsParams {
  page?: number;
  limit?: number;
  status?: string;
  projectType?: string;
}

export const getAllProjects = async (params?: GetAllProjectsParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.projectType) queryParams.append('projectType', params.projectType);
    
    const query = queryParams.toString();
    const url = query ? `/crowdfunding/projects?${query}` : '/crowdfunding/projects';
    
    const response = await fetchApi.get(url) as ICrowdfundingProject[];
    return response;
  } catch (error) {
    console.error("Error fetching crowdfunding projects:", error);
    throw error;
  }
};

