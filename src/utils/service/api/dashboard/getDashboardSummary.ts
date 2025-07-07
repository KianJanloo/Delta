import { fetchApi } from "@/core/interceptore/fetchApi";
import { IDashboardSummary } from "@/types/dashboard-type/summary-type/summary-type";

export const getDashboardSummary = async () => {
  const response = await fetchApi.get(`/dashboard/summary/`) as IDashboardSummary
  return response
}