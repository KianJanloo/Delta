/* eslint-disable */

import { fetchApi } from "@/core/interceptore/fetchApi";

export interface INotificationData {
  room: string;
  notification: {
    userId: number;
    title: string;
    message: string;
    type: string;
    data: any;
  };
}

export const sendNotification = async (data: INotificationData) => {
  try {
    const response = await fetchApi.post("/notifications", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
