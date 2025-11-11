import { fetchApi } from "@/core/interceptore/fetchApi";
import { ICrowdfundingProject } from "./createProject";

export const activateProject = async (projectId: number) => {
  try {
    const response = await fetchApi.put(`/crowdfunding/projects/${projectId}/activate`, {}) as ICrowdfundingProject;
    return response;
  } catch (error) {
    console.error("Error activating project:", error);
    throw error;
  }
};

