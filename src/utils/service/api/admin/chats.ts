import { fetchApi } from "@/core/interceptore/fetchApi";
import { IChatMessage } from "../chats/getChatRoom";

export const updateAdminChatMessage = async (id: number, payload: Partial<IChatMessage>) => {
  try {
    const response = await fetchApi.put(`/admin/chats/${id}`, payload) as IChatMessage;
    return response;
  } catch (error) {
    console.error("Error updating admin chat message:", error);
    throw error;
  }
};

export const deleteAdminChatMessage = async (id: number) => {
  try {
    const response = await fetchApi.delete(`/admin/chats/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting admin chat message:", error);
    throw error;
  }
};

export const clearAdminChatRoom = async (room: string) => {
  try {
    const response = await fetchApi.delete(`/admin/chat-rooms/${room}/clear`);
    return response;
  } catch (error) {
    console.error("Error clearing admin chat room:", error);
    throw error;
  }
};

export interface AdminChatRoom {
  room: string;
  participants: number;
  lastMessageAt?: string;
}

export const getAdminChatRooms = async () => {
  try {
    const response = await fetchApi.get(`/admin/chat-rooms`) as AdminChatRoom[];
    return response;
  } catch (error) {
    console.error("Error fetching admin chat rooms:", error);
    throw error;
  }
};

export const getAdminChatRoomMessages = async (room: string) => {
  try {
    const response = await fetchApi.get(`/admin/chat-rooms/${room}/chats`) as IChatMessage[];
    return response;
  } catch (error) {
    console.error("Error fetching admin chat room messages:", error);
    throw error;
  }
};
