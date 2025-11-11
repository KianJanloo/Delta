import { fetchApi } from "@/core/interceptore/fetchApi";

export interface CreateBlogPayload {
  title: string;
  caption: string;
  estimated_reading_time?: string;
  author_id: number;
  category_id: number;
}

export interface IBlog {
  id: number;
  title: string;
  caption: string;
  estimated_reading_time?: string;
  author_id: number;
  category_id: number;
  created_at: string;
  updated_at: string;
}

export const createBlog = async (payload: CreateBlogPayload) => {
  try {
    const response = await fetchApi.post("/blogs", payload) as IBlog;
    return response;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};

