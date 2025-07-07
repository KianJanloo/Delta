import { fetchApi } from "@/core/interceptore/fetchApi"
import { IHouse } from "@/types/houses-type/house-type";

export const getProperties = async (
    page: number, limit: number
) => {
    const response = await fetchApi.get(`/houses?page=${page}&limit=${limit}`) as IHouse[]
    return response;
}