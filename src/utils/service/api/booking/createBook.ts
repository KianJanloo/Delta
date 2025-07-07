import axiosApi from "@/core/interceptore/axiosApi";
import { IReserveType } from "@/types/reserves-type/reserves-type";
import { IBook } from "@/utils/zustand/booking";

export const createBook = async (data: IBook) => {
    const response = await axiosApi.post('/bookings', data) as IReserveType
    return response
}