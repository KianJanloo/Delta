import { fetchApi } from "@/core/interceptore/fetchApi";
import { Category } from "@/types/categories-type/categories-type";

export interface IGetAllCategoriesResponse {
  data: Category[];
  totalCount: number;
}

export const getAllCategories = async (): Promise<IGetAllCategoriesResponse> => {
  try {
    const response = await fetchApi.get("/categories") as IGetAllCategoriesResponse;
    return response;
  } catch (error) {
    console.error("Get all categories error:", error);
    throw error;
  }
};

