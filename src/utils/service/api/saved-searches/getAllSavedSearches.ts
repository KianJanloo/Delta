import { fetchApi } from "@/core/interceptore/fetchApi";

export interface ISavedSearch {
  id: number;
  userId: number;
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
  createdAt: string;
  updatedAt: string;
}

export interface IGetSavedSearchesResponse {
  data: ISavedSearch[];
  totalCount: number;
}

export const getAllSavedSearches = async (): Promise<IGetSavedSearchesResponse> => {
  try {
    const response = await fetchApi.get("/saved-searches") as IGetSavedSearchesResponse;
    return response;
  } catch (error) {
    console.error("Get saved searches error:", error);
    throw error;
  }
};

