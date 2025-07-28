import axiosApi from "@/core/interceptore/axiosApi";

export async function uploadHousePhotos(houseId: string, photos: File[]) {
  try {
    const formData = new FormData();
    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    const response = await axiosApi.post(
      `/houses/upload/photos/${houseId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ) as { photos: string[] };
    return response;
  } catch (error) {
    console.log(error);
  }
}
