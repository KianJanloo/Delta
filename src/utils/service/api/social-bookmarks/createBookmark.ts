import { fetchApi } from "@/core/interceptore/fetchApi";

export interface CreateBookmarkPayload {
  houseId: number;
  note?: string;
}

export interface IBookmark {
  userId: number;
  houseId: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookmarkResponse {
  bookmark: IBookmark;
  shareUrl: string;
}

export const createBookmark = async (payload: CreateBookmarkPayload) => {
  try {
    const response = await fetchApi.post("/social-bookmarks/bookmark", payload) as CreateBookmarkResponse;
    return response;
  } catch (error) {
    console.error("Error creating bookmark:", error);
    throw error;
  }
};

