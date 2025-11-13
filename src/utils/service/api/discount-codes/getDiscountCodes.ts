import { fetchApi } from "@/core/interceptore/fetchApi";
import { IDiscountCode } from "./createDiscountCode";

export interface GetDiscountCodesParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  code?: string;
  discount_percentage?: number;
  house_id?: number;
}

export const getDiscountCodes = async (params?: GetDiscountCodesParams): Promise<IDiscountCode[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.code) queryParams.append('code', params.code);
    if (params?.discount_percentage !== undefined) queryParams.append('discount_percentage', params.discount_percentage.toString());
    if (params?.house_id !== undefined) queryParams.append('house_id', params.house_id.toString());

    const query = queryParams.toString();
    const url = query ? `/discount-codes?${query}` : '/discount-codes';

    const response = await fetchApi.get(url) as unknown;
    if (Array.isArray(response)) {
      return response as IDiscountCode[];
    }
    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      Array.isArray((response as { data: unknown }).data)
    ) {
      return (response as { data: IDiscountCode[] }).data;
    }
    console.warn("Unexpected discount codes response shape:", response);
    return [];
  } catch (error) {
    console.error("Error fetching discount codes:", error);
    throw error;
  }
};
