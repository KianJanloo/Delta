import { fetchApi } from "@/core/interceptore/fetchApi";

export const deleteBooking = async (bookingId: string) => {
  const response = await fetchApi.delete(`/bookings/${bookingId}`);
  return response;
};