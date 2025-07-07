import { fetchApi } from "@/core/interceptore/fetchApi"

export const deleteHouse = async (id: string) => {
    const response = await fetchApi.delete(`/houses/${id}`)
    return response
}