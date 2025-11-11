import { fetchApi } from "@/core/interceptore/fetchApi";
import { IShareTransfer } from "./createShareTransfer";

export const purchaseShares = async (transactionId: number) => {
  try {
    const response = await fetchApi.put(`/crowdfunding/shares/purchase/${transactionId}`, {}) as IShareTransfer;
    return response;
  } catch (error) {
    console.error("Error purchasing shares:", error);
    throw error;
  }
};

