import { fetchApi } from "@/core/interceptore/fetchApi";

export const getAllBookings = async (page: number, limit: number, sort: string, order: string, house_id?: number) => {
    const response = house_id ? await fetchApi.get(`/bookings?page=${page}&limit=${limit}&sort=${sort}&order=${order}&house_id=${house_id}`) : await fetchApi.get(`/bookings?page=${page}&limit=${limit}&sort=${sort}&order=${order}`)
    return response
}