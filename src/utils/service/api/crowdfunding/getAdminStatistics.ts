import { fetchApi } from "@/core/interceptore/fetchApi";

export interface ICrowdfundingStatistics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalFunded: number;
  totalInvestors: number;
  averageInvestment: number;
  successRate: number;
  topProjects: Array<{
    projectId: number;
    title: string;
    funded: number;
    progress: number;
  }>;
}

export const getAdminStatistics = async () => {
  try {
    const response = await fetchApi.get("/crowdfunding/admin/statistics") as ICrowdfundingStatistics;
    return response;
  } catch (error) {
    console.error("Error fetching admin statistics:", error);
    throw error;
  }
};

