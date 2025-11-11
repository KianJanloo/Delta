import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IFeedback {
  id: number;
  fromUserId: number;
  toUserId: number;
  rating: number;
  comment?: string;
  loyaltyPoints?: number;
  createdAt: string;
}

export const getReceivedFeedback = async (userId: number) => {
  try {
    const response = await fetchApi.get(`/feedback/received/${userId}`) as {
      feedback: IFeedback[];
      totalLoyaltyPoints?: number;
    };
    return response;
  } catch (error) {
    console.error("Error fetching received feedback:", error);
    throw error;
  }
};
