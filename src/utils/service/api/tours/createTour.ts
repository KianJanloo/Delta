import { fetchApi } from "@/core/interceptore/fetchApi";
import { ITour, ITourLocation, ITourScheduleDay } from "./getTourById";

export interface CreateTourPayload {
  userId: number;
  title: string;
  address: string;
  photos?: string[];
  description: string;
  tag: string;
  price: string;
  startDate: string;
  endDate: string;
  services: string[];
  facilities: string[];
  cancellationPeriodDays: number;
  locations: ITourLocation[];
  schedule: ITourScheduleDay[];
}

export const createTour = async (payload: CreateTourPayload) => {
  try {
    const response = await fetchApi.post("/tour", payload) as ITour;
    return response;
  } catch (error) {
    console.error("Error creating tour:", error);
    throw error;
  }
};

