import { fetchApi } from "@/core/interceptore/fetchApi";
import { IProfile, IPublicProfile } from "@/types/profile-type/profile-type";

export const getProfileById = async (id: string) => {
  const response = await fetchApi.get(`/users/${id}`) as { user: IProfile, additionalPercentage: number }
  return response;
};

export const getPublicProfileById = async (id: string) => {
  const response = await fetchApi.get(`/users/${id}/public`) as { user: IPublicProfile }
  return response.user;
};