import { fetchApi } from "@/core/interceptore/fetchApi"
import { IAddFavorite } from "@/types/favorites-type/favorites-type"

export const addFavorite = async (data: IAddFavorite) => {
    const res = await fetchApi.post("/favorites", data);
    return res;
}