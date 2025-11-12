import { fetchApi } from "@/core/interceptore/fetchApi";

export interface AdminUser {
  id: number;
  email: string;
  role: string;
  status?: string;
  fullName?: string | null;
  phoneNumber?: string | null;
  membershipDate?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetAdminUsersParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  email?: string;
  role?: string;
  membershipDate?: string;
  status?: string;
}

export interface UpdateAdminUserPayload {
  email?: string;
  role?: string;
  status?: string;
}

export const getAdminUsers = async (params?: GetAdminUsersParams) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.email) queryParams.append('email', params.email);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.membershipDate) queryParams.append('membershipDate', params.membershipDate);
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    const url = query ? `/admin/users?${query}` : '/admin/users';

    const response = await fetchApi.get(url) as AdminUser[];
    return response;
  } catch (error) {
    console.error("Error fetching admin users:", error);
    throw error;
  }
};

export const getAdminUserById = async (id: number) => {
  try {
    const response = await fetchApi.get(`/admin/users/${id}`) as AdminUser;
    return response;
  } catch (error) {
    console.error("Error fetching admin user:", error);
    throw error;
  }
};

export const updateAdminUser = async (id: number, payload: UpdateAdminUserPayload) => {
  try {
    const response = await fetchApi.put(`/admin/users/${id}`, payload) as AdminUser;
    return response;
  } catch (error) {
    console.error("Error updating admin user:", error);
    throw error;
  }
};

export const deleteAdminUser = async (id: number) => {
  try {
    const response = await fetchApi.delete(`/admin/users/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting admin user:", error);
    throw error;
  }
};

export const updateAdminUserRole = async (id: number, role: string) => {
  try {
    const response = await fetchApi.put(`/admin/users/${id}/role`, { role }) as AdminUser;
    return response;
  } catch (error) {
    console.error("Error updating admin user role:", error);
    throw error;
  }
};
