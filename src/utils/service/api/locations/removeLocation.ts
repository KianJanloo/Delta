import { fetchApi } from "@/core/interceptore/fetchApi"

export const removeLocation = async (id: string) => {
    const response = await fetchApi.delete(`/locations/${id}`)
    return response
}