import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IUpdateCommentPayload {
  content?: string;
  rating?: number;
}

export interface IUpdateCommentResponse {
  message: string;
  comment: {
    id: number;
    userId: number;
    houseId: number;
    content: string;
    rating: number;
    updatedAt: string;
  };
}

export const updateComment = async (
  commentId: number,
  data: IUpdateCommentPayload
): Promise<IUpdateCommentResponse> => {
  try {
    const response = await fetchApi.put(`/comments/${commentId}`, data) as IUpdateCommentResponse;
    return response;
  } catch (error) {
    console.error("Update comment error:", error);
    throw error;
  }
};

