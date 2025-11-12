import { fetchApi } from "@/core/interceptore/fetchApi";

export interface AdminHouse {
  id: number;
  sellerId: number;
  title: string;
  price: number;
  status?: string;
  transactionType?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  capacity?: number;
  bathrooms?: number;
  rooms?: number;
  parking?: number;
  yardType?: string;
  rating?: number;
  numComments?: number;
  coverImage?: string;
  photos?: string[];
  tags?: string[];
  categories?: AdminHouseCategory[] | AdminHouseCategory | null;
  location?: AdminHouseLocation | null;
  lastUpdated?: string;
  summary?: string | null;
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
  status?: string;
  transactionType?: string;
  city?: string;
  title?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface AdminHouseLocation {
  lat?: number;
  lng?: number;
  [key: string]: unknown;
}

export interface AdminHouseCategory {
  id?: number;
  name?: string;
  [key: string]: unknown;
}

export interface UpdateAdminHousePayload {
  title?: string;
  address?: string;
  status?: string;
  price?: number;
  transactionType?: string;
  capacity?: number;
  bathrooms?: number;
  rooms?: number;
  parking?: number;
  yard_type?: string;
  yardType?: string;
  photos?: string[];
  tags?: string[];
  last_updated?: string;
  lastUpdated?: string;
  location?: AdminHouseLocation;
  categories?: AdminHouseCategory[] | number[] | null;
  description?: string;
  summary?: string | null;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
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
    if (params?.status) queryParams.append('status', params.status);
    if (params?.transactionType) queryParams.append('transactionType', params.transactionType);
    if (params?.city) queryParams.append('city', params.city);
    if (params?.title) queryParams.append('title', params.title);
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());

    const query = queryParams.toString();
    const url = query ? `/admin/houses?${query}` : '/admin/houses';

    const response = await fetchApi.get(url) as AdminHouse[];
    return response;
  } catch (error) {
    console.error("Error fetching admin houses:", error);
    throw error;
  }
};

export const getAdminHouseById = async (id: number) => {
  try {
    const response = await fetchApi.get(`/admin/houses/${id}`) as AdminHouse;
    return response;
  } catch (error) {
    console.error("Error fetching admin house:", error);
    throw error;
  }
};

export const updateAdminHouse = async (id: number, payload: UpdateAdminHousePayload) => {
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
