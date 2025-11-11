import { fetchApi } from "@/core/interceptore/fetchApi";

export interface IPropertyAnswer {
  id: number;
  questionId: number;
  answer: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IPropertyQuestion {
  id: number;
  houseId: number;
  question: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  answers?: IPropertyAnswer[];
}

export const getPropertyQA = async (houseId: number) => {
  try {
    const response = await fetchApi.get(`/property-qa/${houseId}`) as IPropertyQuestion[];
    return response;
  } catch (error) {
    console.error("Error fetching property QA:", error);
    throw error;
  }
};
