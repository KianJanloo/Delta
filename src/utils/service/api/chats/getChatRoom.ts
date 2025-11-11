import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IChatMessage {
  id: number;
  room: string;
  userId: number;
  message: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export const getChatRoom = async (room: string) => {
  try {
    const response = await fetchApi.get(`/chats/${room}`) as IChatMessage[];
    return response;
  } catch (error) {
    console.error("Error fetching chat room:", error);
    throw error;
  }
};
