import { fetchApi } from "@/core/interceptore/fetchApi";
import { IShareTransfer } from "./createShareTransfer";

export const getMarketplace = async () => {
  try {
    const response = await fetchApi.get("/crowdfunding/marketplace") as IShareTransfer[];
    return response;
  } catch (error) {
    console.error("Error fetching marketplace:", error);
    throw error;
  }
};

