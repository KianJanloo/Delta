import { fetchApi } from "@/core/interceptore/fetchApi"
import { Category } from "@/types/categories-type/categories-type"

export const getCategories = async (name?: string) => {
    const url = name ? `/categories?name=${name}&limit=100`: `/categories`
    const response = await fetchApi.get(url) as { totalCount: number, data: Category[] }
    return response
}