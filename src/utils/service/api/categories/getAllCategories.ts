import { fetchApi } from "@/core/interceptore/fetchApi";
import { Category } from "@/types/categories-type/categories-type";

export interface IGetAllCategoriesResponse {
  data: Category[];
  totalCount: number;
}

export interface GetAllCategoriesParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  name?: string;
}

export const getAllCategories = async (params?: GetAllCategoriesParams): Promise<IGetAllCategoriesResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.name) queryParams.append('name', params.name);

    const query = queryParams.toString();
    const url = query ? `/categories?${query}` : '/categories';
    const response = await fetchApi.get(url) as IGetAllCategoriesResponse;
    return response;
  } catch (error) {
    console.error("Get all categories error:", error);
    throw error;
  }
};

