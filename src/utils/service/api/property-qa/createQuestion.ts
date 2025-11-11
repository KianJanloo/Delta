import { fetchApi } from "@/core/interceptore/fetchApi";

export interface CreateQuestionPayload {
  houseId: number;
  question: string;
}

export const createPropertyQuestion = async (payload: CreateQuestionPayload) => {
  try {
    const response = await fetchApi.post("/property-qa/question", payload);
    return response;
  } catch (error) {
    console.error("Error creating property question:", error);
    throw error;
  }
};
