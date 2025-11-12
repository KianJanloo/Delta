import { fetchApi } from "@/core/interceptore/fetchApi";

export interface AdminPayment {
  id: number;
  userId: number;
  amount: number;
  status: string;
  transactionType?: string;
  description?: string | null;
  transactionId?: string | null;
  currency?: string;
  paymentMethod?: string;
  processor?: string;
  statusReason?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface GetAdminPaymentsParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  status?: string;
  userId?: number;
  amount?: number;
  transactionType?: string;
  paymentMethod?: string;
  fromDate?: string;
  toDate?: string;
}

export interface UpdateAdminPaymentPayload {
  amount?: number;
  status?: string;
  description?: string;
  transactionId?: string;
  transactionType?: string;
  paymentMethod?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export const getAdminPayments = async (params?: GetAdminPaymentsParams) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.userId) queryParams.append('userId', params.userId.toString());
    if (params?.amount) queryParams.append('amount', params.amount.toString());
    if (params?.transactionType) queryParams.append('transactionType', params.transactionType);
    if (params?.paymentMethod) queryParams.append('paymentMethod', params.paymentMethod);
    if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params?.toDate) queryParams.append('toDate', params.toDate);

    const query = queryParams.toString();
    const url = query ? `/admin/payments?${query}` : '/admin/payments';

    const response = await fetchApi.get(url) as AdminPayment[];
    return response;
  } catch (error) {
    console.error("Error fetching admin payments:", error);
    throw error;
  }
};

export const getAdminPaymentById = async (id: number) => {
  try {
    const response = await fetchApi.get(`/admin/payments/${id}`) as AdminPayment;
    return response;
  } catch (error) {
    console.error("Error fetching admin payment:", error);
    throw error;
  }
};

export const updateAdminPayment = async (id: number, payload: UpdateAdminPaymentPayload) => {
  try {
    const response = await fetchApi.put(`/admin/payments/${id}`, payload) as AdminPayment;
    return response;
  } catch (error) {
    console.error("Error updating admin payment:", error);
    throw error;
  }
};

export const deleteAdminPayment = async (id: number) => {
  try {
    const response = await fetchApi.delete(`/admin/payments/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting admin payment:", error);
    throw error;
  }
};
