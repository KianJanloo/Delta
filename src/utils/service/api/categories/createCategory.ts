import { fetchApi } from "@/core/interceptore/fetchApi"
import { Category } from "@/types/categories-type/categories-type";

export const createCategory = async (data: {
  name: string
}) => {
    const response = await fetchApi.post("/categories", data) as Category;
    return response;
}