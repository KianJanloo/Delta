import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IPaymentDetail {
  id: string;
  userId: string;
  bookingId: string;
  amount: string;
  description: string;
  status: "completed" | "pending" | "failed" | "canceled";
  paymentUrl: string;
  transactionId: null | string;
  createdAt: Date;
  updatedAt: Date;
}

export const getPaymentById = async (id: string): Promise<IPaymentDetail> => {
  try {
    const response = await fetchApi.get(`/payments/${id}`) as IPaymentDetail;
    return response;
  } catch (error) {
    console.error("Get payment by ID error:", error);
    throw error;
  }
};

