import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IBrokerageStats {
  totalBrokers: number;
  activeBrokers: number;
  totalSales: number;
  totalCommissionPaid: number;
  pendingCommission: number;
  averageSalesPerBroker: number;
  topBrokers: Array<{
    brokerId: number;
    brokerCode: string;
    totalSales: number;
    totalCommission: number;
  }>;
}

export const getAdminBrokerageStats = async () => {
  try {
    const response = await fetchApi.get("/brokerage/admin/stats") as IBrokerageStats;
    return response;
  } catch (error) {
    console.error("Error fetching admin brokerage stats:", error);
    throw error;
  }
};

