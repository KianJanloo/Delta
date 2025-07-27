import { fetchApi } from "@/core/interceptore/fetchApi"
import { IHouse } from "@/types/houses-type/house-type"

export const getRecommendsHouse = async (userId: string) => {
    const response = await fetchApi.get(`/recommendations/${userId}`) as { recommendations: IHouse[] }
    return response
    
}