import { fetchApi } from "@/core/interceptore/fetchApi";
import { Category } from "@/types/categories-type/categories-type";

export const getCategory = async (id: number): Promise<Category> => {
  try {
    const response = await fetchApi.get(`/categories/${id}`) as Category;
    return response;
  } catch (error) {
    console.error("Get category error:", error);
    throw error;
  }
};

