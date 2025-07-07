import { fetchApi } from "@/core/interceptore/fetchApi"

export const getLocationById = async (id: string) => {
    const response = await fetchApi.get(`/locations/${id}`)
    return response
}