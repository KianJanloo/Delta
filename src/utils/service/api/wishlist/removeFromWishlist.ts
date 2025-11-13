import { fetchApi } from "@/core/interceptore/fetchApi";

export const removeFromWishlist = async (userId: string, houseId: number) => {
  try {
    const response = await fetchApi.delete(`/wishlist/${userId}`, {
      body: JSON.stringify({ houseId }),
    }) as { message: string };
    return response;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
};

