import { fetchApi } from "@/core/interceptore/fetchApi";

interface IAdminDashboardSummaryResponse {
  totalUsers?: number | string;
  totalHouses?: number | string;
  totalBookings?: number | string;
  averageRating?: number | string;
  averageCommentRating?: number | string;
}

export interface IAdminDashboardSummary {
  totalUsers: number;
  totalHouses: number;
  totalBookings: number;
  averageRating: number;
}

const toNumber = (value: unknown): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

export const getAdminDashboard = async (): Promise<IAdminDashboardSummary> => {
  try {
    const response = await fetchApi.get(`/admin/dashboard`) as IAdminDashboardSummaryResponse;

    return {
      totalUsers: toNumber(response?.totalUsers),
      totalHouses: toNumber(response?.totalHouses),
      totalBookings: toNumber(response?.totalBookings),
      averageRating: toNumber(response?.averageRating ?? response?.averageCommentRating),
    };
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    throw error;
  }
};
