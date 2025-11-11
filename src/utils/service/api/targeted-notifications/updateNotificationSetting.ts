import { fetchApi } from "@/core/interceptore/fetchApi";
import { INotificationSetting } from "./createNotificationSetting";

export interface UpdateNotificationSettingPayload {
  channel?: string;
  frequency?: string;
  enabled?: boolean;
}

export const updateNotificationSetting = async (id: number, payload: UpdateNotificationSettingPayload) => {
  try {
    const response = await fetchApi.put(`/targeted-notifications/settings/${id}`, payload) as INotificationSetting;
    return response;
  } catch (error) {
    console.error("Error updating notification setting:", error);
    throw error;
  }
};
