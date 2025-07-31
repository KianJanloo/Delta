import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IDashboardFinance {
  totalAmount: number;
  totalBookings: number;
  totalPayments: number;
  totalPerviousMonthAmount: number;
  totalCurrentMonthAmount: number;
}

export const getDashboardFinance = async () => {
  try {
    const response = await fetchApi.get("/seller/finance/dashboard") as IDashboardFinance;
    return response;
  } catch (error) {
    console.log(error);
  }
};
