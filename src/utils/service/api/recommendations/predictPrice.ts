import { fetchApi } from "@/core/interceptore/fetchApi";

export interface PredictPricePayload {
  features: Record<string, unknown>;
}

export interface PredictPriceResponse {
  predictedPrice: number;
  confidence?: number;
}

export const predictPropertyPrice = async (payload: PredictPricePayload) => {
  try {
    const response = await fetchApi.post("/recommendations/predict", payload) as PredictPriceResponse;
    return response;
  } catch (error) {
    console.error("Error predicting property price:", error);
    throw error;
  }
};
