import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IPublicProfile {
  id: number;
  fullName?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  listingsCount?: number;
}

export const getPublicProfile = async (id: number) => {
  try {
    const response = await fetchApi.get(`/public-profile/${id}`) as IPublicProfile;
    return response;
  } catch (error) {
    console.error("Error fetching public profile:", error);
    throw error;
  }
};
