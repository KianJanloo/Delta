import { fetchApi } from "@/core/interceptore/fetchApi";
import { INotificationSetting } from "./createNotificationSetting";

export const getNotificationSettings = async () => {
  try {
    const response = await fetchApi.get(`/targeted-notifications/settings`) as INotificationSetting[];
    return response;
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    throw error;
  }
};
