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

export interface GetAllBlogsParams {
  page?: number;
  limit?: number;
  sort?: "created_at" | "updated_at" | "title" | "views";
  order?: "ASC" | "DESC";
  title?: string;
  author_id?: number;
  category_id?: number;
}

export const getAllBlogs = async (params?: GetAllBlogsParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.title) queryParams.append('title', params.title);
    if (params?.author_id) queryParams.append('author_id', params.author_id.toString());
    if (params?.category_id) queryParams.append('category_id', params.category_id.toString());
    
    const query = queryParams.toString();
    const url = query ? `/blogs?${query}` : '/blogs';
    
    const response = await fetchApi.get(url) as IBlog[];
    return response;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

