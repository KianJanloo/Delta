import { axiosApi } from "@/core/interceptore/axiosApi";

export interface UploadDocumentPayload {
  houseId: number;
  documentType?: string;
  description?: string;
}

export const uploadDocument = async (file: File, payload: UploadDocumentPayload) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("houseId", payload.houseId.toString());
    if (payload.documentType) formData.append("documentType", payload.documentType);
    if (payload.description) formData.append("description", payload.description);

    const response = await axiosApi.post("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
};
