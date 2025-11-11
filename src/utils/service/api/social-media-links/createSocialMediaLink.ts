import { fetchApi } from "@/core/interceptore/fetchApi";

export interface CreateSocialMediaLinkPayload {
  platform: string;
  url: string;
}

export const createSocialMediaLink = async (payload: CreateSocialMediaLinkPayload) => {
  try {
    const response = await fetchApi.post("/social-media-links", payload);
    return response;
  } catch (error) {
    console.error("Error creating social media link:", error);
    throw error;
  }
};
