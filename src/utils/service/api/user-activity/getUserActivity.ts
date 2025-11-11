import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IUserActivity {
  userId: number;
  totalBookings?: number;
  totalFavorites?: number;
  totalViews?: number;
  lastActiveAt?: string;
}

export const getUserActivity = async (userId: number) => {
  try {
    const response = await fetchApi.get(`/user-activity/${userId}`) as IUserActivity;
    return response;
  } catch (error) {
    console.error("Error fetching user activity:", error);
    throw error;
  }
};
