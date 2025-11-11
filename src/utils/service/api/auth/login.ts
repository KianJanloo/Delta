import { fetchApi } from "@/core/interceptore/fetchApi";

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export const login = async (data: ILoginPayload): Promise<ILoginResponse> => {
  try {
    const response = await fetchApi.post("/auth/login", data) as ILoginResponse;
    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

