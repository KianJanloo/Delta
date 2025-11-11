import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IAdminDashboardSummary {
  totalUsers?: number;
  totalHouses?: number;
  totalBookings?: number;
  averageCommentRating?: number;
}

export const getAdminDashboard = async () => {
  try {
    const response = await fetchApi.get(`/admin/dashboard`) as IAdminDashboardSummary;
    return response;
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    throw error;
  }
};
