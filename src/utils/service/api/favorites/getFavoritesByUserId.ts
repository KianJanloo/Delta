import { fetchApi } from "@/core/interceptore/fetchApi"

export const getFavoritesByUserId = async (userId: number, page: number, limit: number, sort: string, order: "ASC" | "DESC") => {
    const res = await fetchApi.get(`/favorites/user/${userId}?page=${page}&limit=${limit}&sort=${sort}&order=${order}`);
    return res;
}