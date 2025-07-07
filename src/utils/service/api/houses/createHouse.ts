import { fetchApi } from "@/core/interceptore/fetchApi"
import { ICreateHouse } from "@/types/houses-type/house-type"

export const createHouse = async (data: ICreateHouse) => {
    const response = await fetchApi.post("/houses", data)
    return response
}