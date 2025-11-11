import { fetchApi } from "@/core/interceptore/fetchApi";
import { IHouse } from "@/types/houses-type/house-type";

export interface IGetByRatingParams {
  minRating: number;
  page?: number;
  limit?: number;
}

export interface IGetByRatingResponse {
  data: IHouse[];
  totalCount: number;
}

export const getByRating = async (params: IGetByRatingParams): Promise<IGetByRatingResponse> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.set("minRating", String(params.minRating));
    if (params.page) queryParams.set("page", String(params.page));
    if (params.limit) queryParams.set("limit", String(params.limit));

    const url = `/houses/rating?${queryParams.toString()}`;
    const response = await fetchApi.get(url) as IGetByRatingResponse;
    return response;
  } catch (error) {
    console.error("Get by rating error:", error);
    throw error;
  }
};

