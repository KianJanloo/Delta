import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IAdvancedReport {
  conversionRate?: number;
  averageBookingPrice?: number;
  totalRevenue?: number;
  bookingDistribution?: Record<string, number>;
  heatmapData?: Array<{ lat: number; lng: number; count: number }>;
}

export const getAdvancedReport = async () => {
  try {
    const response = await fetchApi.get(`/reporting/advanced`) as IAdvancedReport;
    return response;
  } catch (error) {
    console.error("Error fetching advanced report:", error);
    throw error;
  }
};
