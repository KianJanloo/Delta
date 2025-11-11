import { fetchApi } from "@/core/interceptore/fetchApi";
import { IHouse } from "@/types/houses-type/house-type";

export interface IGetComparisonResponse {
  data: IHouse[];
}

export const getComparison = async (ids: string): Promise<IGetComparisonResponse> => {
  try {
    const response = await fetchApi.get(`/comparison?ids=${ids}`) as IGetComparisonResponse;
    return response;
  } catch (error) {
    console.error("Get comparison error:", error);
    throw error;
  }
};

