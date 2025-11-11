import { fetchApi } from "@/core/interceptore/fetchApi";
import { IBroker } from "./registerBroker";

export const findBrokerByCode = async (brokerCode: string) => {
  try {
    const response = await fetchApi.get(`/brokerage/find/${brokerCode}`) as IBroker;
    return response;
  } catch (error) {
    console.error("Error finding broker:", error);
    throw error;
  }
};

