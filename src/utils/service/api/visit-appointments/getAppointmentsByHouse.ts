import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IVisitAppointment {
  id: number;
  houseId: number;
  userId: number;
  scheduledAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const getAppointmentsByHouse = async (houseId: number) => {
  try {
    const response = await fetchApi.get(`/visit-appointments/house/${houseId}`) as IVisitAppointment[];
    return response;
  } catch (error) {
    console.error("Error fetching house appointments:", error);
    throw error;
  }
};
