import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IDeleteCommentResponse {
  message: string;
}

export const deleteComment = async (commentId: number): Promise<IDeleteCommentResponse> => {
  try {
    const response = await fetchApi.delete(`/comments/${commentId}`) as IDeleteCommentResponse;
    return response;
  } catch (error) {
    console.error("Delete comment error:", error);
    throw error;
  }
};

