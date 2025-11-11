import { fetchApi } from "@/core/interceptore/fetchApi";

export interface DistributeDividendsPayload {
  projectId: number;
}

export const distributeDividends = async (payload: DistributeDividendsPayload) => {
  try {
    const response = await fetchApi.put("/crowdfunding/dividends/distribute", payload) as { message: string };
    return response;
  } catch (error) {
    console.error("Error distributing dividends:", error);
    throw error;
  }
};

