import { fetchApi } from "@/core/interceptore/fetchApi";

interface IData {
    email: string;
    resetCode: string;
    newPassword: string;
}

export const resetPassword = async (data: IData) => {
  try {
    const response = await fetchApi.post("/auth/forgot-password/reset", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
