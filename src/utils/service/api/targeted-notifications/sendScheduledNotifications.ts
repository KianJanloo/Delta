import { fetchApi } from "@/core/interceptore/fetchApi";

export const sendScheduledNotifications = async () => {
  try {
    const response = await fetchApi.post("/targeted-notifications/send-scheduled", {});
    return response;
  } catch (error) {
    console.error("Error sending scheduled notifications:", error);
    throw error;
  }
};
