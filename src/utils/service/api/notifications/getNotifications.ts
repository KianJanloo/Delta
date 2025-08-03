/* eslint-disable */

import { fetchApi } from "@/core/interceptore/fetchApi";

interface IUrl {
  page: number;
  limit: number;
  sort: string;
  order: string;
  isRead: boolean;
  type: string;
  title: string;
  message: string;
}

export interface INotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  data: any;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getNotifications = async (userId: number, data: Partial<IUrl>) => {
  try {
    const params = new URLSearchParams();
    params.set("page", String(data?.page || 1));
    params.set("limit", String(data?.limit || 5));
    if(data.title) params.set('title', String(data.title));
    if(data.message) params.set('message', String(data.message));
    if(data.type) params.set('type', String(data.type));
    if(data.sort) params.set('sort', String(data.sort));
    if(data.order) params.set('order', String(data.order));
    if(data.isRead) params.set('isRead', String(data.isRead));

    const url = `/notifications/${userId}?${params.toString()}`;

    const response = await fetchApi.get(url) as { totalCount: number, data: INotification[] };
    return response;
  } catch (error) {
    console.log(error);
  }
};
