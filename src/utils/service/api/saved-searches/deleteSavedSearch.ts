import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IDeleteSavedSearchResponse {
  message: string;
}

export const deleteSavedSearch = async (
  searchId: number
): Promise<IDeleteSavedSearchResponse> => {
  try {
    const response = await fetchApi.delete(`/saved-searches/${searchId}`) as IDeleteSavedSearchResponse;
    return response;
  } catch (error) {
    console.error("Delete saved search error:", error);
    throw error;
  }
};

