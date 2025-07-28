import { fetchApi } from "@/core/interceptore/fetchApi";
import { IHouse } from "@/types/houses-type/house-type";

interface GetMyHousesParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export async function getMyHouses(params: GetMyHousesParams) {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "created_at",
      order = "DESC",
      search = "",
      minPrice,
      maxPrice,
    } = params;

    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
      order,
      search,
      ...(minPrice !== undefined ? { minPrice: minPrice.toString() } : {}),
      ...(maxPrice !== undefined ? { maxPrice: maxPrice.toString() } : {}),
    });

    const response = (await fetchApi.get(
      `/houses/seller/user?${query.toString()}`
    )) as { houses: IHouse[]; totalCount: number };
    return response;
  } catch (error) {
    console.log(error);
  }
}
