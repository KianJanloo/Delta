import { fetchApi } from "@/core/interceptore/fetchApi";

export interface Booking {
  id: number;
  user_id: number;
  houseId: number;
  reservedDates: {
    value: string;
    inclusive: boolean;
  }[];
  traveler_details: {
    gender: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    nationalId: string;
  }[];
  status: "pending" | "confirmed" | "canceled";
  sharedEmail: string | null;
  sharedMobile: string | null;
  createdAt: string;
  updatedAt: string;
  house: {
    title: string;
    price: string;
  };
}

export const getCustomersBookings = async (id: number, page: number, limit: number, sort: string, order: "DESC" | "ASC") => {
  try {
    const response = (await fetchApi.get(
      `/bookings/${id}/customers?page=${page}&limit=${limit}&sort=${sort}&order=${order}`
    )) as { bookings: Booking[]; totalCount: number };
    return response;
  } catch (error) {
    console.log(error);
  }
};
