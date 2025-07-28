import axiosApi from "@/core/interceptore/axiosApi";
import { ChangePasswordPayload } from "@/types/security-type/security-type";

export async function changeUserPassword(payload: ChangePasswordPayload) {
  try {
    const response = await axiosApi.put("/users/change-password", payload);
    return response;
  } catch (error) {
    console.log(error);
  }
}
