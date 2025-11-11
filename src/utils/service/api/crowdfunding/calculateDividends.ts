import { fetchApi } from "@/core/interceptore/fetchApi";

export interface CalculateDividendsPayload {
  projectId: number;
  totalProfit: number;
}

export interface IDividend {
  id: number;
  projectId: number;
  investmentId: number;
  userId: number;
  amount: number;
  status: string;
  calculatedAt: string;
  paidAt?: string;
}

export const calculateDividends = async (payload: CalculateDividendsPayload) => {
  try {
    const response = await fetchApi.post("/crowdfunding/dividends/calculate", payload) as IDividend[];
    return response;
  } catch (error) {
    console.error("Error calculating dividends:", error);
    throw error;
  }
};

