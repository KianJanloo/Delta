import { fetchApi } from "@/core/interceptore/fetchApi";

export const deleteBlog = async (id: number) => {
  try {
    const response = await fetchApi.delete(`/blogs/${id}`) as { message: string };
    return response;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};

