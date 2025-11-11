import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IBrokerPerformance {
  totalSales: number;
  totalCommission: number;
  pendingCommission: number;
  paidCommission: number;
  directReferrals: number;
  totalNetwork: number;
  monthlySales: number;
  monthlyCommission: number;
  topPerformers: Array<{
    userId: number;
    brokerCode: string;
    sales: number;
    commission: number;
  }>;
}

export const getBrokerPerformance = async () => {
  try {
    const response = await fetchApi.get("/brokerage/performance") as IBrokerPerformance;
    return response;
  } catch (error) {
    console.error("Error fetching broker performance:", error);
    throw error;
  }
};

