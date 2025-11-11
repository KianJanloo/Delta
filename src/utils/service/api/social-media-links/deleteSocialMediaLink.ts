import { fetchApi } from "@/core/interceptore/fetchApi";

export const deleteSocialMediaLink = async (id: number) => {
  try {
    const response = await fetchApi.delete(`/social-media-links/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting social media link:", error);
    throw error;
  }
};
