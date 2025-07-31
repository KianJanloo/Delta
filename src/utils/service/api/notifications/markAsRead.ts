import { fetchApi } from "@/core/interceptore/fetchApi";

export const markAsRead = async (id: number) => {
  try {
    const response = await fetchApi.put(`/notifications/${id}/read`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const markAllAsRead = async () => {
  try {
    const response = await fetchApi.put(`/notifications/mark-all-as-read`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
