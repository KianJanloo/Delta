import { fetchApi } from "@/core/interceptore/fetchApi";
import { IVisitAppointment } from "./getAppointmentsByHouse";

export const getUserAppointments = async () => {
  try {
    const response = await fetchApi.get(`/visit-appointments/user`) as IVisitAppointment[];
    return response;
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    throw error;
  }
};
