import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IVerifyEmailPayload {
  email: string;
  code: string;
}

export interface IVerifyEmailResponse {
  message: string;
}

export const verifyEmail = async (data: IVerifyEmailPayload): Promise<IVerifyEmailResponse> => {
  try {
    const response = await fetchApi.post("/auth/verify-email", data) as IVerifyEmailResponse;
    return response;
  } catch (error) {
    console.error("Verify email error:", error);
    throw error;
  }
};

