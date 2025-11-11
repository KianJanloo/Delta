import { fetchApi } from "@/core/interceptore/fetchApi";
import { IFeedback } from "./getReceivedFeedback";

export const getGivenFeedback = async (userId: number) => {
  try {
    const response = await fetchApi.get(`/feedback/given/${userId}`) as IFeedback[];
    return response;
  } catch (error) {
    console.error("Error fetching given feedback:", error);
    throw error;
  }
};
