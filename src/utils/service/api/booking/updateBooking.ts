import { fetchApi } from "@/core/interceptore/fetchApi";
import { IReserveType } from "@/types/reserves-type/reserves-type";

export const updateBooking = async (bookingId: string, data: IReserveType) => {
    try {
        const response = await fetchApi.put(`/bookings/${bookingId}`, data);
        return response;
    } catch (error) {
        console.error("Error updating booking:", error);
        throw error;
    }
}