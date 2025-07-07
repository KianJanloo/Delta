import { fetchApi } from "@/core/interceptore/fetchApi"
import { ICommentAll, IParentComment } from "@/types/comment-type/comment-type"

export const getComments = async (page: number, limit: number, sort: string, order: string) => {
    const response = await fetchApi.get(`/comments?page=${page}&limit=${limit}&sort=${sort}&order=${order}`) as { totalCount: number, data: ICommentAll[] }
    return response
}

export const getCommentById = async (id: string) => {
    const response = await fetchApi.get(`/comments/${id}`) as IParentComment;
    return response
}