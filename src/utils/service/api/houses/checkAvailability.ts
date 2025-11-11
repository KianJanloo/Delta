import { fetchApi } from "@/core/interceptore/fetchApi";

export interface ICheckAvailabilityParams {
  startDate: string;
  endDate: string;
}

export interface ICheckAvailabilityResponse {
  isAvailable: boolean;
  message: string;
}

export const checkAvailability = async (
  houseId: number,
  params: ICheckAvailabilityParams
): Promise<ICheckAvailabilityResponse> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.set("startDate", params.startDate);
    queryParams.set("endDate", params.endDate);

    const url = `/houses/${houseId}/availability?${queryParams.toString()}`;
    const response = await fetchApi.get(url) as ICheckAvailabilityResponse;
    return response;
  } catch (error) {
    console.error("Check availability error:", error);
    throw error;
  }
};

