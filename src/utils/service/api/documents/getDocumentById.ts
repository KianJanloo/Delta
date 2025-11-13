import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IDocument {
  id: number;
  houseId: number;
  userId: number;
  documentType?: string;
  filePath: string;
  signed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getDocumentById = async (id: number) => {
  try {
    const response = await fetchApi.get(`/documents/${id}`) as IDocument;
    return response;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};
