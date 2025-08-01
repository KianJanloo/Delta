/* eslint-disable */

import { fetchApi } from "@/core/interceptore/fetchApi";

interface IData {
  notificationType: string;
  criteria: any;
}

export const createSettings = async (data: IData) => {
  try {
    const response = await fetchApi.post(
      "/targeted-notifications/settings",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSettings = async (id: number) => {
  try {
    const response = await fetchApi.delete(
      `/targeted-notifications/settings/${id}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export interface ISetting {
  id: number;
  userId: number;
  notificationType: string;
  criteria: any;
  createdAt: Date;
  updatedAt: Date;
}

export const getSettings = async () => {
  try {
    const response = await fetchApi.get(`/targeted-notifications/settings`) as ISetting[];
    return response;
  } catch (error) {
    console.log(error);
  }
};
