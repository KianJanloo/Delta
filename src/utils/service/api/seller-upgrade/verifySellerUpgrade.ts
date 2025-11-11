import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IVerifySellerUpgradePayload {
  requestId: number;
  status: "approved" | "rejected";
  adminNotes?: string;
}

export interface IVerifySellerUpgradeResponse {
  message: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export const verifySellerUpgrade = async (
  data: IVerifySellerUpgradePayload
): Promise<IVerifySellerUpgradeResponse> => {
  try {
    const response = await fetchApi.post("/seller-upgrade/upgrade-to-seller/verify", data) as IVerifySellerUpgradeResponse;
    return response;
  } catch (error) {
    console.error("Verify seller upgrade error:", error);
    throw error;
  }
};
