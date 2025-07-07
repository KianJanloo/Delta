import { fetchApi } from "@/core/interceptore/fetchApi"
import { ILocation } from "@/types/locations-type/locations-type"

export const getallLocations = async (page: number, limit: number, sort: string, order: string, area_name: string, lat: string, lng: string) => {
    const response = await fetchApi.get(`/locations?page=${page}&limit=${limit}&sort=${sort}&order=${order}&area_name=${area_name}&lat=${lat}&lng=${lng}`) as { totalCount: number, data: ILocation[] }
    return response;
}