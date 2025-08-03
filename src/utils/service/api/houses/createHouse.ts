import { fetchApi } from "@/core/interceptore/fetchApi";
import { ICreateHouse } from "@/types/houses-type/house-type";

export const createHouse = async (data: ICreateHouse) => {
  try {
    const response = await fetchApi.post("/houses", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
