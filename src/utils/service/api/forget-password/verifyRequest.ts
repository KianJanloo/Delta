import { fetchApi } from "@/core/interceptore/fetchApi";

interface IData {
    email: string;
    resetCode: string;
}

export const verifyRequest = async (data: IData) => {
  try {
    const response = await fetchApi.post("/auth/forgot-password/verify", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
