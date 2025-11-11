import { fetchApi } from "@/core/interceptore/fetchApi";

export const deleteVisit3D = async (id: number) => {
  try {
    const response = await fetchApi.delete(`/visit-3ds/${id}`) as { message: string };
    return response;
  } catch (error) {
    console.error("Error deleting 3D visit:", error);
    throw error;
  }
};

