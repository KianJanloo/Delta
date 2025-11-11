import { fetchApi } from "@/core/interceptore/fetchApi";
import { IChatMessage } from "./getChatRoom";

export const getRecentChats = async () => {
  try {
    const response = await fetchApi.get(`/chats`) as IChatMessage[];
    return response;
  } catch (error) {
    console.error("Error fetching recent chats:", error);
    throw error;
  }
};
