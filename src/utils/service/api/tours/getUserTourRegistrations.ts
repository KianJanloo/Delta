import { fetchApi } from "@/core/interceptore/fetchApi";
import { ITourRegistration } from "./registerTour";

export interface GetUserTourRegistrationsParams {
  page?: number;
  limit?: number;
  title?: string;
  tag?: string;
}

export const getUserTourRegistrations = async (params?: GetUserTourRegistrationsParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.title) queryParams.append('title', params.title);
    if (params?.tag) queryParams.append('tag', params.tag);
    
    const query = queryParams.toString();
    const url = query ? `/tour/user/my-registers?${query}` : '/tour/user/my-registers';
    
    const response = await fetchApi.get(url) as ITourRegistration[];
    return response;
  } catch (error) {
    console.error("Error fetching user tour registrations:", error);
    throw error;
  }
};

