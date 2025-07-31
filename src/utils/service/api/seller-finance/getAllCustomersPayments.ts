import { fetchApi } from "@/core/interceptore/fetchApi";

interface IUrl {
  page?: number;
  limit?: number;
  paymentStatus?: string;
  transactionType?: string;
}

export interface IPayment {
  id: string;
  userId: string;
  bookingId: string;
  amount: string;
  description: string;
  status: "completed" | "pending" | "canceled";
  paymentUrl: string;
  transactionId: null | string;
  createdAt: Date;
  updatedAt: Date;
}

export const getAllCustomersPayments = async (data: IUrl) => {
  try {
    const params = new URLSearchParams();
    params.set("page", String(data?.page || 1));
    params.set("limit", String(data?.limit || 5));
    if (data?.paymentStatus) params.set("paymentStatus", data.paymentStatus);
    if (data?.transactionType)
      params.set("transactionType", data.transactionType);

    const url = `/seller/finance?${params.toString()}`;
    console.log(url)

    const response = (await fetchApi.get(url)) as {
      data: IPayment[];
      totalCount: number;
    };
    return response;
  } catch (error) {
    console.log(error);
  }
};
