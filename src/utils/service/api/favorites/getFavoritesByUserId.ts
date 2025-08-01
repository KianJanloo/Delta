import { fetchApi } from "@/core/interceptore/fetchApi";
import { IFavorite } from "@/types/favorites-type/favorites-type";

interface IUrl {
  page: number;
  limit: number;
  sort: string;
  order: string;
}

export const getFavorites = async (data: Partial<IUrl>) => {

  const params = new URLSearchParams();
  params.set("page", String(data.page) || "1");
  params.set("limit", String(data.limit) || "5");
  params.set("sort", data.sort || "createdAt");
  params.set("order", data.order || "DESC");

  const url = `/favorites/user?${params.toString()}`
  console.log(url)

  const res = await fetchApi.get(url) as { data: IFavorite[]; totalCount: number };
  return res;
};
