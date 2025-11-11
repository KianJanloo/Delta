import { fetchApi } from "@/core/interceptore/fetchApi";

export interface CreateShareTransferPayload {
  investmentId: number;
  shares: number;
  pricePerShare: number;
}

export interface IShareTransfer {
  id: number;
  sellerId: number;
  investmentId: number;
  projectId: number;
  shares: number;
  pricePerShare: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const createShareTransfer = async (payload: CreateShareTransferPayload) => {
  try {
    const response = await fetchApi.post("/crowdfunding/shares/transfer", payload) as IShareTransfer;
    return response;
  } catch (error) {
    console.error("Error creating share transfer:", error);
    throw error;
  }
};

