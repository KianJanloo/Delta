import { fetchApi } from "@/core/interceptore/fetchApi";

export interface AddToWishlistPayload {
  houseId: number;
  note?: string;
}

export interface IWishlistItem {
  id: number;
  userId: number;
  houseId: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export const addToWishlist = async (payload: AddToWishlistPayload) => {
  try {
    const response = await fetchApi.post("/wishlist", payload) as {
      message: string;
      wishlistItem: IWishlistItem;
    };
    return response;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

