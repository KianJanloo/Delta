import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IUpgradeToSellerPayload {
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  taxId?: string;
  description?: string;
}

export interface IUpgradeToSellerResponse {
  message: string;
  requestId: number;
}

export const upgradeToSeller = async (data: IUpgradeToSellerPayload): Promise<IUpgradeToSellerResponse> => {
  try {
    const response = await fetchApi.post("/seller-upgrade/upgrade-to-seller", data) as IUpgradeToSellerResponse;
    return response;
  } catch (error) {
    console.error("Upgrade to seller error:", error);
    throw error;
  }
};

