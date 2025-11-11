import { fetchApi } from "@/core/interceptore/fetchApi";

export interface RegisterBrokerPayload {
  referralCode?: string;
}

export interface IBroker {
  id: number;
  userId: number;
  brokerCode: string;
  referrerId?: number;
  level: number;
  status: string;
  totalSales: number;
  totalCommission: number;
  createdAt: string;
  updatedAt: string;
}

export const registerBroker = async (payload?: RegisterBrokerPayload) => {
  try {
    const response = await fetchApi.post("/brokerage/register", payload || {}) as IBroker;
    return response;
  } catch (error) {
    console.error("Error registering broker:", error);
    throw error;
  }
};

