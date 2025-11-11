import { fetchApi } from "@/core/interceptore/fetchApi";
import { IDiscountCode } from "./createDiscountCode";

export interface GetDiscountCodesParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  code?: string;
  discount_percentage?: number;
}

export const getDiscountCodes = async (params?: GetDiscountCodesParams) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.code) queryParams.append('code', params.code);
    if (params?.discount_percentage !== undefined) queryParams.append('discount_percentage', params.discount_percentage.toString());

    const query = queryParams.toString();
    const url = query ? `/discount-codes?${query}` : '/discount-codes';

    const response = await fetchApi.get(url) as IDiscountCode[];
    return response;
  } catch (error) {
    console.error("Error fetching discount codes:", error);
    throw error;
  }
};
