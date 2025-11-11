import { fetchApi } from "@/core/interceptore/fetchApi";

export const deleteDocument = async (id: number) => {
  try {
    const response = await fetchApi.delete(`/documents/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};
