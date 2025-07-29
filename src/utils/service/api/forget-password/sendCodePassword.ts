import { fetchApi } from "@/core/interceptore/fetchApi";

interface IData {
    email: string;
}

export const sendCodePassword = async (data: IData) => {
  try {
    const response = await fetchApi.post("/auth/forgot-password/request", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
