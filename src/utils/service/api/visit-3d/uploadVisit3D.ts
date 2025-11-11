import { axiosApi } from "@/core/interceptore/axiosApi";

export interface UploadVisit3DPayload {
  houseId: number;
  title?: string;
  description?: string;
}

export const uploadVisit3D = async (file: File, payload: UploadVisit3DPayload) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("houseId", payload.houseId.toString());
    if (payload.title) formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);

    const response = await axiosApi.post("/visit-3ds/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading 3D visit:", error);
    throw error;
  }
};

