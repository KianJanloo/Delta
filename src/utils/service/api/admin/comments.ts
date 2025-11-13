import { fetchApi } from "@/core/interceptore/fetchApi";

export interface AdminComment {
  id: number;
  house_id: number;
  user_id: number;
  title?: string | null;
  caption?: string | null;
  rating: number | string;
  created_at: string;
  updated_at?: string;
  parent_comment_id?: number | string | null;
}

export interface GetAdminCommentsParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  user_id?: number;
  house_id?: number;
  rating?: number;
  status?: string;
}

export interface UpdateAdminCommentPayload {
  rating?: number;
  comment?: string;
  title?: string;
  status?: string;
  response?: string;
  reportedReason?: string;
  [key: string]: unknown;
}

export const getAdminComments = async (params?: GetAdminCommentsParams) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.user_id) queryParams.append('user_id', params.user_id.toString());
    if (params?.house_id) queryParams.append('house_id', params.house_id.toString());
    if (params?.rating) queryParams.append('rating', params.rating.toString());
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    const url = query ? `/admin/comments?${query}` : '/admin/comments';

    const response = await fetchApi.get(url) as AdminComment[];
    return response;
  } catch (error) {
    console.error("Error fetching admin comments:", error);
    throw error;
  }
};

export const getAdminCommentById = async (id: number) => {
  try {
    const response = await fetchApi.get(`/admin/comments/${id}`) as AdminComment;
    return response;
  } catch (error) {
    console.error("Error fetching admin comment:", error);
    throw error;
  }
};

export const updateAdminComment = async (id: number, payload: UpdateAdminCommentPayload) => {
  try {
    const response = await fetchApi.put(`/admin/comments/${id}`, payload) as AdminComment;
    return response;
  } catch (error) {
    console.error("Error updating admin comment:", error);
    throw error;
  }
};

export const deleteAdminComment = async (id: number) => {
  try {
    const response = await fetchApi.delete(`/admin/comments/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting admin comment:", error);
    throw error;
  }
};
