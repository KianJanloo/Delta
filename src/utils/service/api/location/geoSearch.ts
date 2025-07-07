import { fetchApi } from "@/core/interceptore/fetchApi";
import { IHouse } from "@/types/houses-type/house-type";

export const geoSearch = async (
  lat: number,
  lng: number,
  radius: number
) => {
  const response = await fetchApi.get(`/houses/geo-search?lat=${lat}&lng=${lng}&radius=${radius}`) as IHouse[];
  return response;
};
