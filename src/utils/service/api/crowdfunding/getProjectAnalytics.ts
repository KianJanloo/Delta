import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IProjectAnalytics {
  projectId: number;
  totalInvestors: number;
  totalInvested: number;
  fundingProgress: number;
  averageInvestment: number;
  daysRemaining: number;
  investmentTrend: Array<{
    date: string;
    amount: number;
    count: number;
  }>;
  topInvestors: Array<{
    userId: number;
    amount: number;
  }>;
}

export const getProjectAnalytics = async (projectId: number) => {
  try {
    const response = await fetchApi.get(`/crowdfunding/projects/${projectId}/analytics`) as IProjectAnalytics;
    return response;
  } catch (error) {
    console.error("Error fetching project analytics:", error);
    throw error;
  }
};

