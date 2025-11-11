import { fetchApi } from "@/core/interceptore/fetchApi";
import { ITour } from "./getTourById";

export interface UpdateTourPayload {
  title?: string;
  price?: string;
  description?: string;
  photos?: string[];
  cancellationPeriodDays?: number;
  services?: string[];
  facilities?: string[];
}

export const updateTour = async (id: number, payload: UpdateTourPayload) => {
  try {
    const response = await fetchApi.put(`/tour/${id}`, payload) as ITour;
    return response;
  } catch (error) {
    console.error("Error updating tour:", error);
    throw error;
  }
};

