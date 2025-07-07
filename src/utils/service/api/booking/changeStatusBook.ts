import { fetchApi } from "@/core/interceptore/fetchApi"

export const changeStatusBook = async (id: string, status: "continue" | "cancel") => {
    const response = await fetchApi.post(`/bookings/${id}/${status}`);
    return response
}