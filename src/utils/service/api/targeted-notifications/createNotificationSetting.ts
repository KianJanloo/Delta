import { fetchApi } from "@/core/interceptore/fetchApi";

export interface CreateNotificationSettingPayload {
  channel: string;
  frequency: string;
  enabled: boolean;
}

export interface INotificationSetting {
  id: number;
  userId: number;
  channel: string;
  frequency: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export const createNotificationSetting = async (payload: CreateNotificationSettingPayload) => {
  try {
    const response = await fetchApi.post("/targeted-notifications/settings", payload) as INotificationSetting;
    return response;
  } catch (error) {
    console.error("Error creating notification setting:", error);
    throw error;
  }
};
