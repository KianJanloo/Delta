import { fetchApi } from "@/core/interceptore/fetchApi";

export interface AdminHouse {
  id: number;
  sellerId: number;
  title: string;
  price: number;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAdminHousesParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  sellerId?: number;
  price?: number;
}

export const getAdminHouses = async (params?: GetAdminHousesParams) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.sellerId) queryParams.append('sellerId', params.sellerId.toString());
    if (params?.price) queryParams.append('price', params.price.toString());

    const query = queryParams.toString();
    const url = query ? `/admin/houses?${query}` : '/admin/houses';

    const response = await fetchApi.get(url) as AdminHouse[];
    return response;
  } catch (error) {
    console.error("Error fetching admin houses:", error);
    throw error;
  }
};

export const updateAdminHouse = async (id: number, payload: Partial<AdminHouse>) => {
  try {
    const response = await fetchApi.put(`/admin/houses/${id}`, payload) as AdminHouse;
    return response;
  } catch (error) {
    console.error("Error updating admin house:", error);
    throw error;
  }
};

export const deleteAdminHouse = async (id: number) => {
  try {
    const response = await fetchApi.delete(`/admin/houses/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting admin house:", error);
    throw error;
  }
};
