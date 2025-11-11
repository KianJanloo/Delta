import { fetchApi } from "@/core/interceptore/fetchApi";
import { Category } from "@/types/categories-type/categories-type";

export interface IUpdateCategoryPayload {
  name?: string;
  description?: string;
}

export const updateCategory = async (
  id: number,
  data: IUpdateCategoryPayload
): Promise<Category> => {
  try {
    const response = await fetchApi.put(`/categories/${id}`, data) as Category;
    return response;
  } catch (error) {
    console.error("Update category error:", error);
    throw error;
  }
};

