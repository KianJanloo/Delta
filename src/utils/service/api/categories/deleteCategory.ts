import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IDeleteCategoryResponse {
  message: string;
}

export const deleteCategory = async (id: number): Promise<IDeleteCategoryResponse> => {
  try {
    const response = await fetchApi.delete(`/categories/${id}`) as IDeleteCategoryResponse;
    return response;
  } catch (error) {
    console.error("Delete category error:", error);
    throw error;
  }
};

