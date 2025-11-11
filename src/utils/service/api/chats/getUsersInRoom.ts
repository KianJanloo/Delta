import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IChatUser {
  id: number;
  fullName?: string;
  avatar?: string;
}

export const getUsersInRoom = async (room: string) => {
  try {
    const response = await fetchApi.get(`/chats/users-in-room/${room}`) as IChatUser[];
    return response;
  } catch (error) {
    console.error("Error fetching chat users:", error);
    throw error;
  }
};
