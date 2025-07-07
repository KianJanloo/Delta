import { fetchApi } from "@/core/interceptore/fetchApi";
import { IEditProfile } from "@/types/profile-type/profile-type";

export const editProfile = async (id: string, data: IEditProfile) => {
  const response = await fetchApi.put(`/users/${id}`, data)
  return response
}