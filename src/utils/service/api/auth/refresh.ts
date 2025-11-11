import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IRefreshTokenPayload {
  token: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
}

export const refreshToken = async (data: IRefreshTokenPayload): Promise<IRefreshTokenResponse> => {
  try {
    const response = await fetchApi.post("/auth/refresh", data) as IRefreshTokenResponse;
    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
};

