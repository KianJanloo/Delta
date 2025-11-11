import { fetchApi } from "@/core/interceptore/fetchApi";
import { IChatMessage } from "./getChatRoom";

export interface EditChatMessagePayload {
  message?: string;
}

export const editChatMessage = async (id: number, payload: EditChatMessagePayload) => {
  try {
    const response = await fetchApi.put(`/chats/edit/${id}`, payload) as IChatMessage;
    return response;
  } catch (error) {
    console.error("Error editing chat message:", error);
    throw error;
  }
};
