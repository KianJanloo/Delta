import { fetchApi } from "@/core/interceptore/fetchApi";

export interface MakeInvestmentPayload {
  projectId: number;
  amount: number;
}

export interface IInvestment {
  id: number;
  userId: number;
  projectId: number;
  amount: number;
  shares: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const makeInvestment = async (payload: MakeInvestmentPayload) => {
  try {
    const response = await fetchApi.post("/crowdfunding/investments", payload) as IInvestment;
    return response;
  } catch (error) {
    console.error("Error making investment:", error);
    throw error;
  }
};

