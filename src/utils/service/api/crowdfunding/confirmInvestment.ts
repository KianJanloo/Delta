import { fetchApi } from "@/core/interceptore/fetchApi";
import { IInvestment } from "./makeInvestment";

export const confirmInvestment = async (investmentId: number) => {
  try {
    const response = await fetchApi.put(`/crowdfunding/investments/${investmentId}/confirm`, {}) as IInvestment;
    return response;
  } catch (error) {
    console.error("Error confirming investment:", error);
    throw error;
  }
};

