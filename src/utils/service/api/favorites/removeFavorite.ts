import { fetchApi } from "@/core/interceptore/fetchApi"

export const removeFavorite = async (id: number) => {
    const res = await fetchApi.delete(`/favorites/${id}`);
    return res;
}