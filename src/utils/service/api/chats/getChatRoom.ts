import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IChatSender {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

export interface IChatMessage {
  id: string;
  room: string;
  senderId: number;
  getterId: number;
  message: string;
  files?: string[] | null;
  sender?: IChatSender;
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
