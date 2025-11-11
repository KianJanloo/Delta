import { axiosApi } from "@/core/interceptore/axiosApi";

export const uploadTourPhotos = async (tourId: string, files: File[]) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("photos", file);
    });

    const response = await axiosApi.post(`/tour/${tourId}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading tour photos:", error);
    throw error;
  }
};

