import axiosApi from "@/core/interceptore/axiosApi";
import { IChatMessage } from "./getChatRoom";

export const uploadChatFile = async (room: string, files: File[], getterId: number) => {
  try {
    if (!getterId) {
      throw new Error("getterId is required for uploading chat files");
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("getterId", String(getterId));

    const response = await axiosApi.post(`/chats/upload/${room}`, formData);

    return response.data as IChatMessage;
  } catch (error) {
    console.error("Error uploading chat file:", error);
    throw error;
  }
};
