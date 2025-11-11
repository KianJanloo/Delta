import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IBlog {
  id: number;
  title: string;
  caption: string;
  estimated_reading_time?: string;
  author_id: number;
  category_id: number;
  views?: number;
  created_at: string;
  updated_at: string;
}

export const getBlogById = async (id: number) => {
  try {
    const response = await fetchApi.get(`/blogs/${id}`) as IBlog;
    return response;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
};

