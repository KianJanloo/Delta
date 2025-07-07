import { fetchApi } from "@/core/interceptore/fetchApi"
import { IReserveType } from "@/types/reserves-type/reserves-type"

export const getBookingById = async (id: string) => {
    const response = await fetchApi.get(`/bookings/${id}`) as IReserveType;
    return response
}