import { fetchApi } from "@/core/interceptore/fetchApi";

export interface ILoyaltySummary {
  userId: number;
  totalPoints: number;
  tier?: string;
}

export const getLoyaltyPoints = async (userId: number) => {
  try {
    const response = await fetchApi.get(`/feedback/loyalty/${userId}`) as ILoyaltySummary;
    return response;
  } catch (error) {
    console.error("Error fetching loyalty points:", error);
    throw error;
  }
};
