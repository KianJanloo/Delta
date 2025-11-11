import { fetchApi } from "@/core/interceptore/fetchApi";

export interface ITourLocation {
  name: string;
  lat: string;
  lng: string;
}

export interface ITourScheduleTodo {
  time: string;
  todo: string;
}

export interface ITourScheduleDay {
  title: string;
  todos: ITourScheduleTodo[];
}

export interface ITour {
  id: number;
  userId: number;
  title: string;
  address: string;
  photos: string[];
  description: string;
  tag: string;
  price: string;
  startDate: string;
  endDate: string;
  services: string[];
  facilities: string[];
  cancellationPeriodDays: number;
  locations: ITourLocation[];
  schedule: ITourScheduleDay[];
  createdAt: string;
  updatedAt: string;
}

export const getTourById = async (id: number) => {
  try {
    const response = await fetchApi.get(`/tour/${id}`) as ITour;
    return response;
  } catch (error) {
    console.error("Error fetching tour:", error);
    throw error;
  }
};

