import { fetchApi } from "@/core/interceptore/fetchApi";

export interface ICompleteRegistrationPayload {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
}

export interface ICompleteRegistrationResponse {
  message: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export const completeRegistration = async (
  data: ICompleteRegistrationPayload
): Promise<ICompleteRegistrationResponse> => {
  try {
    const response = await fetchApi.post("/auth/complete-registration", data) as ICompleteRegistrationResponse;
    return response;
  } catch (error) {
    console.error("Complete registration error:", error);
    throw error;
  }
};

