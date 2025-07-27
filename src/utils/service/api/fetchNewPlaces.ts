import { fetchApi } from "@/core/interceptore/fetchApi"
import { IHouse } from "@/types/houses-type/house-type"

export const fetchNewPlaces = async () => {
    
    const items = await fetchApi.get("/houses?page=1&limit=10&sort=created_at&order=DESC") as { houses: IHouse[], totalCount: number }
    return items
}