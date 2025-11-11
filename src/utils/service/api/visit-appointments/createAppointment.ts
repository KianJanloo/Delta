import { fetchApi } from "@/core/interceptore/fetchApi";
import { IVisitAppointment } from "./getAppointmentsByHouse";

export interface CreateAppointmentPayload {
  houseId: number;
  scheduledAt: string;
  note?: string;
}

export const createAppointment = async (payload: CreateAppointmentPayload) => {
  try {
    const response = await fetchApi.post(`/visit-appointments`, payload) as IVisitAppointment;
    return response;
  } catch (error) {
    console.error("Error creating visit appointment:", error);
    throw error;
  }
};
