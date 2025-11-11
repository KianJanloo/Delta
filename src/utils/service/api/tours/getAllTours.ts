import { fetchApi } from "@/core/interceptore/fetchApi";
import { ITour } from "./getTourById";

export interface GetAllToursParams {
  page?: number;
  limit?: number;
  title?: string;
  tag?: string;
}

export const getAllTours = async (params?: GetAllToursParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.title) queryParams.append('title', params.title);
    if (params?.tag) queryParams.append('tag', params.tag);
    
    const query = queryParams.toString();
    const url = query ? `/tour?${query}` : '/tour';
    
    const response = await fetchApi.get(url) as ITour[];
    return response;
  } catch (error) {
    console.error("Error fetching tours:", error);
    throw error;
  }
};

