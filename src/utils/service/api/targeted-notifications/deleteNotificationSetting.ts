import { fetchApi } from "@/core/interceptore/fetchApi";

export const deleteNotificationSetting = async (id: number) => {
  try {
    const response = await fetchApi.delete(`/targeted-notifications/settings/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting notification setting:", error);
    throw error;
  }
};
