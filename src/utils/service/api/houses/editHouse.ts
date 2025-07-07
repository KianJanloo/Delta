import { fetchApi } from "@/core/interceptore/fetchApi"
import { ICreateHouse } from "@/types/houses-type/house-type"

export const editHouse = async (id: string, data: Partial<ICreateHouse>) => {
    const response = await fetchApi.put(`/houses/${id}`, data)
    return response
}