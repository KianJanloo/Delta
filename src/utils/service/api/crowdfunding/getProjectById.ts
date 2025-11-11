import { fetchApi } from "@/core/interceptore/fetchApi";
import { ICrowdfundingProject } from "./createProject";

export const getProjectById = async (id: number) => {
  try {
    const response = await fetchApi.get(`/crowdfunding/projects/${id}`) as ICrowdfundingProject;
    return response;
  } catch (error) {
    console.error("Error fetching crowdfunding project:", error);
    throw error;
  }
};

