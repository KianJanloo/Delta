import { fetchApi } from "@/core/interceptore/fetchApi";
import { IBroker } from "./registerBroker";

export const getBrokerInfo = async () => {
  try {
    const response = await fetchApi.get("/brokerage/info") as IBroker;
    return response;
  } catch (error) {
    console.error("Error fetching broker info:", error);
    throw error;
  }
};

