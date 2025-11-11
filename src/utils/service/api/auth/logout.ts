import { fetchApi } from "@/core/interceptore/fetchApi";

export interface ILogoutResponse {
  message: string;
}

export const logout = async (): Promise<ILogoutResponse> => {
  try {
    const response = await fetchApi.post("/auth/logout", {}) as ILogoutResponse;
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

