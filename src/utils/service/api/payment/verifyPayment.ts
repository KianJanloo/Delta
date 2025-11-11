import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IVerifyPaymentPayload {
  token: string;
}

export interface IVerifyPaymentResponse {
  message: string;
  payment: {
    id: string;
    status: string;
    amount: string;
  };
}

export const verifyPayment = async (
  paymentId: string,
  data: IVerifyPaymentPayload
): Promise<IVerifyPaymentResponse> => {
  try {
    const response = await fetchApi.post(`/payments/${paymentId}/verify`, data) as IVerifyPaymentResponse;
    return response;
  } catch (error) {
    console.error("Verify payment error:", error);
    throw error;
  }
};

