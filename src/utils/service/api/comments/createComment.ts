import { fetchApi } from "@/core/interceptore/fetchApi";

export interface ICreateCommentPayload {
  houseId: number;
  content: string;
  rating: number;
}

export interface ICreateCommentResponse {
  message: string;
  comment: {
    id: number;
    userId: number;
    houseId: number;
    content: string;
    rating: number;
    createdAt: string;
  };
}

export const createComment = async (data: ICreateCommentPayload): Promise<ICreateCommentResponse> => {
  try {
    const response = await fetchApi.post("/comments", data) as ICreateCommentResponse;
    return response;
  } catch (error) {
    console.error("Create comment error:", error);
    throw error;
  }
};

