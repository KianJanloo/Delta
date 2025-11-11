import { fetchApi } from "@/core/interceptore/fetchApi";
import { IVisitAppointment } from "./getAppointmentsByHouse";

export interface UpdateAppointmentPayload {
  scheduledAt?: string;
  note?: string;
  status?: string;
}

export const updateAppointment = async (id: number, payload: UpdateAppointmentPayload) => {
  try {
    const response = await fetchApi.put(`/visit-appointments/${id}`, payload) as IVisitAppointment;
    return response;
  } catch (error) {
    console.error("Error updating visit appointment:", error);
    throw error;
  }
};
