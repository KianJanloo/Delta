import { fetchApi } from "@/core/interceptore/fetchApi";
import { IVisitAppointment } from "./getAppointmentsByHouse";

export const cancelAppointment = async (id: number) => {
  try {
    const response = await fetchApi.post(`/visit-appointments/${id}/cancel`, {}) as IVisitAppointment;
    return response;
  } catch (error) {
    console.error("Error canceling visit appointment:", error);
    throw error;
  }
};
