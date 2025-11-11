import { fetchApi } from "@/core/interceptore/fetchApi";
import { IFeedback } from "./getReceivedFeedback";

export interface CreateFeedbackPayload {
  toUserId: number;
  rating: number;
  comment?: string;
  loyaltyPoints?: number;
}

export const createFeedback = async (payload: CreateFeedbackPayload) => {
  try {
    const response = await fetchApi.post("/feedback", payload) as IFeedback;
    return response;
  } catch (error) {
    console.error("Error creating feedback:", error);
    throw error;
  }
};
