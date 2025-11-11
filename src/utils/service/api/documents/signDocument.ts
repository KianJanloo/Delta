import { fetchApi } from "@/core/interceptore/fetchApi";

export const signDocument = async (id: number) => {
  try {
    const response = await fetchApi.post(`/documents/${id}/sign`, {});
    return response;
  } catch (error) {
    console.error("Error signing document:", error);
    throw error;
  }
};
