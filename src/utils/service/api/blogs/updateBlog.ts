import { fetchApi } from "@/core/interceptore/fetchApi";

export interface UpdateBlogPayload {
  title?: string;
  caption?: string;
  estimated_reading_time?: string;
  author_id?: number;
  category_id?: number;
}

export interface IBlog {
  id: number;
  title: string;
  caption: string;
  estimated_reading_time?: string;
  author_id: number;
  category_id: number;
  updated_at: string;
}

export const updateBlog = async (id: number, payload: UpdateBlogPayload) => {
  try {
    const response = await fetchApi.put(`/blogs/${id}`, payload) as IBlog;
    return response;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

