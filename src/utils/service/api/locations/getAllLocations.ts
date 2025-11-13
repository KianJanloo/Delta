import { fetchApi } from "@/core/interceptore/fetchApi"
import { ILocation } from "@/types/locations-type/locations-type"

export const getallLocations = async (page: number, limit: number, area_name: string) => {
    const response = await fetchApi.get(`/locations?page=${page}&limit=${limit}${area_name ? `&area_name=${area_name}` : ''}`) as { totalCount: number, data: ILocation[] }
    return response;
}