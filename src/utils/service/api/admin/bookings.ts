import { fetchApi } from "@/core/interceptore/fetchApi";

export interface AdminBooking {
  id: number;
  userId: number;
  houseId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAdminBookingsParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  status?: string;
  user_id?: number;
  house_id?: string;
}

export const getAdminBookings = async (params?: GetAdminBookingsParams) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.user_id) queryParams.append('user_id', params.user_id.toString());
    if (params?.house_id) queryParams.append('house_id', params.house_id);

    const query = queryParams.toString();
    const url = query ? `/admin/bookings?${query}` : '/admin/bookings';

    const response = await fetchApi.get(url) as AdminBooking[];
    return response;
  } catch (error) {
    console.error("Error fetching admin bookings:", error);
    throw error;
  }
};

export const getAdminBookingById = async (id: number) => {
  try {
    const response = await fetchApi.get(`/admin/bookings/${id}`) as AdminBooking;
    return response;
  } catch (error) {
    console.error("Error fetching admin booking:", error);
    throw error;
  }
};

export const updateAdminBooking = async (id: number, payload: Partial<AdminBooking>) => {
  try {
    const response = await fetchApi.put(`/admin/bookings/${id}`, payload) as AdminBooking;
    return response;
  } catch (error) {
    console.error("Error updating admin booking:", error);
    throw error;
  }
};

export const deleteAdminBooking = async (id: number) => {
  try {
    const response = await fetchApi.delete(`/admin/bookings/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting admin booking:", error);
    throw error;
  }
};
