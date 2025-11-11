import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IPortfolio {
  totalInvested: number;
  totalValue: number;
  totalReturn: number;
  returnPercentage: number;
  activeInvestments: number;
  completedInvestments: number;
  investments: Array<{
    projectId: number;
    projectTitle: string;
    amount: number;
    shares: number;
    currentValue: number;
    return: number;
    status: string;
  }>;
}

export const getMyPortfolio = async () => {
  try {
    const response = await fetchApi.get("/crowdfunding/my-portfolio") as IPortfolio;
    return response;
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    throw error;
  }
};

