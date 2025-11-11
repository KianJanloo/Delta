import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IWishlistItem {
  id: number;
  userId: number;
  houseId: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
  house?: {
    id: number;
    title: string;
    description: string;
    price: number;
    location: string;
    images: string[];
  };
}

export interface GetWishlistParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "ASC" | "DESC";
  search?: string;
}

export const getWishlist = async (params?: GetWishlistParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.search) queryParams.append('search', params.search);
    
    const query = queryParams.toString();
    const url = query ? `/wishlist?${query}` : '/wishlist';
    
    const response = await fetchApi.get(url) as IWishlistItem[];
    return response;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
};

