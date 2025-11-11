import { fetchApi } from "@/core/interceptore/fetchApi";
import { IChatMessage } from "./getChatRoom";

export interface SendChatMessagePayload {
  room: string;
  message: string;
  attachments?: string[];
}

export const sendChatMessage = async (payload: SendChatMessagePayload) => {
  try {
    const response = await fetchApi.post(`/chats/send`, payload) as IChatMessage;
    return response;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};
