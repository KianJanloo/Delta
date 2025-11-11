import { fetchApi } from "@/core/interceptore/fetchApi";

export interface ApproveDividendsPayload {
  projectId: number;
}

export const approveDividends = async (payload: ApproveDividendsPayload) => {
  try {
    const response = await fetchApi.put("/crowdfunding/dividends/approve", payload) as { message: string };
    return response;
  } catch (error) {
    console.error("Error approving dividends:", error);
    throw error;
  }
};

