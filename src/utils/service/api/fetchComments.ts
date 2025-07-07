import { fetchApi } from "@/core/interceptore/fetchApi"

export const fetchComments = async (
    id: string, page: number, limit: number
) => {
    const response = await fetchApi.get(`/comments?page=${page}&limit=${limit}&house_id=${id}&order=DESC&sort=created_at`)
    return response
}