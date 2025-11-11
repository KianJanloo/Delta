import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IRegisterPayload {
  email: string;
  password: string;
  role?: string;
}

export interface IRegisterResponse {
  message: string;
  userId: number;
}

export const register = async (data: IRegisterPayload): Promise<IRegisterResponse> => {
  try {
    const response = await fetchApi.post("/auth/register", data) as IRegisterResponse;
    return response;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

