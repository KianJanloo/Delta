import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IVisit3D {
  id: number;
  houseId: number;
  userId: number;
  title?: string;
  description?: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const getVisit3DById = async (id: number) => {
  try {
    const response = await fetchApi.get(`/visit-3ds/${id}`) as IVisit3D;
    return response;
  } catch (error) {
    console.error("Error fetching 3D visit:", error);
    throw error;
  }
};

