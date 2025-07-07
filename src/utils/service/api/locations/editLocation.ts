import { fetchApi } from "@/core/interceptore/fetchApi"
import { ICreateLocation } from "@/types/locations-type/locations-type"

export const editLocation = async (data: ICreateLocation, id: string) => {
    const response = await fetchApi.put(`/locations/${id}`, data)
    return response
}