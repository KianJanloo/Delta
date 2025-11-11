import { fetchApi } from "@/core/interceptore/fetchApi";

export interface UpdateSocialMediaLinkPayload {
  platform?: string;
  url?: string;
}

export const updateSocialMediaLink = async (id: number, payload: UpdateSocialMediaLinkPayload) => {
  try {
    const response = await fetchApi.put(`/social-media-links/${id}`, payload);
    return response;
  } catch (error) {
    console.error("Error updating social media link:", error);
    throw error;
  }
};
