import { fetchApi } from "@/core/interceptore/fetchApi";

export interface ICreateSavedSearchPayload {
  searchName: string;
  searchCriteria: {
    transactionType?: string;
    propertyType?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
  };
}

export interface ICreateSavedSearchResponse {
  message: string;
  savedSearch: {
    id: number;
    userId: number;
    searchName: string;
    searchCriteria: object;
    createdAt: string;
  };
}

export const createSavedSearch = async (
  data: ICreateSavedSearchPayload
): Promise<ICreateSavedSearchResponse> => {
  try {
    const response = await fetchApi.post("/saved-searches", data) as ICreateSavedSearchResponse;
    return response;
  } catch (error) {
    console.error("Create saved search error:", error);
    throw error;
  }
};

