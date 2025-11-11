import { axiosApi } from "@/core/interceptore/axiosApi";
import { IChatMessage } from "./getChatRoom";

export const uploadChatFile = async (room: string, files: File[]) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await axiosApi.post(`/chats/upload/${room}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data as IChatMessage;
  } catch (error) {
    console.error("Error uploading chat file:", error);
    throw error;
  }
};
