import { fetchApi } from "@/core/interceptore/fetchApi";
import { IVisit3D } from "./getVisit3DById";

export const getVisit3DByHouseId = async (houseId: number) => {
  try {
    const response = await fetchApi.get(`/visit-3ds/house/${houseId}`) as IVisit3D;
    return response;
  } catch (error) {
    console.error("Error fetching 3D visit by house ID:", error);
    throw error;
  }
};

