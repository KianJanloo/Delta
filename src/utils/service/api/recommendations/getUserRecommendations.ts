import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IRecommendation {
  houseId: number;
  score: number;
}

export const getUserRecommendations = async (userId: number) => {
  try {
    const response = await fetchApi.get(`/recommendations/${userId}`) as IRecommendation[];
    return response;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};
