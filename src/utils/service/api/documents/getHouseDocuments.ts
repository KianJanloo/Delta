import { fetchApi } from "@/core/interceptore/fetchApi";
import { IDocument } from "./getDocumentById";

export interface GetHouseDocumentsParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  documentType?: string;
  signed?: boolean;
}

export const getHouseDocuments = async (houseId: number, params?: GetHouseDocumentsParams) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.documentType) queryParams.append('documentType', params.documentType);
    if (params?.signed !== undefined) queryParams.append('signed', params.signed ? 'true' : 'false');

    const query = queryParams.toString();
    const url = query ? `/documents/house/${houseId}?${query}` : `/documents/house/${houseId}`;

    const response = await fetchApi.get(url) as IDocument[];
    return response;
  } catch (error) {
    console.error("Error fetching house documents:", error);
    throw error;
  }
};
