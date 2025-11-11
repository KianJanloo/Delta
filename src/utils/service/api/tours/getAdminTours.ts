import { fetchApi } from "@/core/interceptore/fetchApi";
import { ITour } from "./getTourById";

export interface GetAdminToursParams {
  page?: number;
  limit?: number;
  title?: string;
  tag?: string;
}

export const getAdminTours = async (params?: GetAdminToursParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.title) queryParams.append('title', params.title);
    if (params?.tag) queryParams.append('tag', params.tag);
    
    const query = queryParams.toString();
    const url = query ? `/tour/admin?${query}` : '/tour/admin';
    
    const response = await fetchApi.get(url) as ITour[];
    return response;
  } catch (error) {
    console.error("Error fetching admin tours:", error);
    throw error;
  }
};

