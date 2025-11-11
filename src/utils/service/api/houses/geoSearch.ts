import { fetchApi } from "@/core/interceptore/fetchApi";
import { IHouse } from "@/types/houses-type/house-type";

export interface IGeoSearchParams {
  lat: number;
  lng: number;
  radius?: number;
}

export interface IGeoSearchResponse {
  data: IHouse[];
  totalCount: number;
}

export const geoSearch = async (params: IGeoSearchParams): Promise<IGeoSearchResponse> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.set("lat", String(params.lat));
    queryParams.set("lng", String(params.lng));
    if (params.radius) queryParams.set("radius", String(params.radius));

    const url = `/houses/geo-search?${queryParams.toString()}`;
    const response = await fetchApi.get(url) as IGeoSearchResponse;
    return response;
  } catch (error) {
    console.error("Geo search error:", error);
    throw error;
  }
};

