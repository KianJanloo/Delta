import { fetchApi } from "@/core/interceptore/fetchApi"
import { ICreateLocation } from "@/types/locations-type/locations-type"

export const createLocation = async (data: ICreateLocation) => {
    const response = await fetchApi.post("/locations", data)
    return response
}