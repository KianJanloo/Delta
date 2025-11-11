import { fetchApi } from "@/core/interceptore/fetchApi";

export interface CreateAnswerPayload {
  questionId: number;
  answer: string;
}

export const createPropertyAnswer = async (payload: CreateAnswerPayload) => {
  try {
    const response = await fetchApi.post("/property-qa/answer", payload);
    return response;
  } catch (error) {
    console.error("Error creating property answer:", error);
    throw error;
  }
};
