import { fetchApi } from "@/core/interceptore/fetchApi";

export interface ISocialMediaLink {
  id: number;
  platform: string;
  url: string;
}

export interface GetAllSocialMediaLinksParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  platform?: string;
  url?: string;
}

export const getAllSocialMediaLinks = async (params?: GetAllSocialMediaLinksParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.platform) queryParams.append('platform', params.platform);
    if (params?.url) queryParams.append('url', params.url);
    
    const query = queryParams.toString();
    const url = query ? `/social-media-links?${query}` : '/social-media-links';
    
    const response = await fetchApi.get(url) as ISocialMediaLink[];
    return response;
  } catch (error) {
    console.error("Error fetching social media links:", error);
    throw error;
  }
};

