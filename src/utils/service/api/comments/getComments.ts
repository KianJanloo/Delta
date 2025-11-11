import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IComment {
  id: number;
  userId: number;
  houseId: number;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}

export interface IGetCommentsParams {
  houseId?: number;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
}

export interface IGetCommentsResponse {
  data: IComment[];
  totalCount: number;
}

export const getComments = async (params: IGetCommentsParams): Promise<IGetCommentsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.houseId) queryParams.set("houseId", String(params.houseId));
    if (params.page) queryParams.set("page", String(params.page));
    if (params.limit) queryParams.set("limit", String(params.limit));
    if (params.sort) queryParams.set("sort", params.sort);
    if (params.order) queryParams.set("order", params.order);

    const url = `/comments?${queryParams.toString()}`;
    const response = await fetchApi.get(url) as IGetCommentsResponse;
    return response;
  } catch (error) {
    console.error("Get comments error:", error);
    throw error;
  }
};

