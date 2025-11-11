import { fetchApi } from "@/core/interceptore/fetchApi";

export interface CreateProjectPayload {
  houseId: number;
  title: string;
  description: string;
  targetAmount: number;
  minInvestment: number;
  maxInvestment?: number;
  duration: number;
  expectedReturn: number;
  projectType: string;
  riskLevel: string;
}

export interface ICrowdfundingProject {
  id: number;
  houseId: number;
  sellerId: number;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  minInvestment: number;
  maxInvestment?: number;
  duration: number;
  expectedReturn: number;
  projectType: string;
  riskLevel: string;
  status: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const createProject = async (payload: CreateProjectPayload) => {
  try {
    const response = await fetchApi.post("/crowdfunding/projects", payload) as ICrowdfundingProject;
    return response;
  } catch (error) {
    console.error("Error creating crowdfunding project:", error);
    throw error;
  }
};

