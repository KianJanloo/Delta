import { fetchApi } from "@/core/interceptore/fetchApi";
import { IPayment } from "../seller-finance/getAllCustomersPayments";

interface IData {
  status?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export const getPayments = async (data: IData) => {
  try {
    const { status, sort, order, page, limit } = data;

    const params = new URLSearchParams();
    params.set("page", String(page) || "1");
    params.set("limit", String(limit) || "10");
    if (status) params.set("status", String(status));
    if (sort) params.set("sort", String(sort));
    if (order) params.set("order", String(order));

    const url = `/payments?${params}`;

    const response = await fetchApi.get(url) as {
      payments: IPayment[];
      totalCount: number;
    };
    return response;
  } catch (error) {
    console.log(error);
  }
};
