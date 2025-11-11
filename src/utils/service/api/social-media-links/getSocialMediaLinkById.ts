import { fetchApi } from "@/core/interceptore/fetchApi";

export interface ISocialMediaLink {
  id: number;
  platform: string;
  url: string;
}

export const getSocialMediaLinkById = async (id: number) => {
  try {
    const response = await fetchApi.get(`/social-media-links/${id}`) as ISocialMediaLink;
    return response;
  } catch (error) {
    console.error("Error fetching social media link:", error);
    throw error;
  }
};

