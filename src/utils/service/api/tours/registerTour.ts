import { fetchApi } from "@/core/interceptore/fetchApi";

export interface RegisterTourPayload {
  fullName: string;
  phoneNumber: string;
  email: string;
  description?: string;
  tourId: number;
}

export interface ITourRegistration {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  description?: string;
  tourId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export const registerTour = async (payload: RegisterTourPayload) => {
  try {
    const response = await fetchApi.post("/tour/register", payload) as ITourRegistration;
    return response;
  } catch (error) {
    console.error("Error registering tour:", error);
    throw error;
  }
};

