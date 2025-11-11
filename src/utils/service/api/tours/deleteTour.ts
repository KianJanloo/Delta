import { fetchApi } from "@/core/interceptore/fetchApi";

export const deleteTour = async (id: number) => {
  try {
    const response = await fetchApi.delete(`/tour/${id}`) as { message: string };
    return response;
  } catch (error) {
    console.error("Error deleting tour:", error);
    throw error;
  }
};

