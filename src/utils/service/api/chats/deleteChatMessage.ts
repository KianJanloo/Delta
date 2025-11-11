import { fetchApi } from "@/core/interceptore/fetchApi";

export const deleteChatMessage = async (id: number) => {
  try {
    const response = await fetchApi.delete(`/chats/delete/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting chat message:", error);
    throw error;
  }
};
