import { fetchApi } from "@/core/interceptore/fetchApi";

export interface ICreateContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  phoneNumber?: string;
}

export interface ICreateContactMessageResponse {
  message: string;
  contactId: number;
}

export const createContactMessage = async (
  data: ICreateContactMessagePayload
): Promise<ICreateContactMessageResponse> => {
  try {
    const response = await fetchApi.post("/contact-us", data) as ICreateContactMessageResponse;
    return response;
  } catch (error) {
    console.error("Create contact message error:", error);
    throw error;
  }
};

