import { fetchApi } from "@/core/interceptore/fetchApi";

export interface SendTicketNotificationPayload {
  subject: string;
  message: string;
  userId?: number;
}

export const sendTicketNotification = async (payload: SendTicketNotificationPayload) => {
  try {
    const response = await fetchApi.post(`/ticket-notification/send`, payload);
    return response;
  } catch (error) {
    console.error("Error sending ticket notification:", error);
    throw error;
  }
};
