/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchApi } from "@/core/interceptore/fetchApi"

export interface FetchHousesParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
    transactionType?: "rental" | "mortgage" | "reservation" | "direct_purchase" | "";
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    category?: string;
    rooms?: number;
    bathrooms?: number;
    parking?: number;
    capacity?: number;
    search?: string;
}

export const fetchHouses = async (sort: string, order: string, transactionType: "rental" | "mortgage" | "reservation" | "direct_purchase" | "") => {
    const response = await fetchApi.get(`/houses?limit=10&sort=${sort}&order=${order}&transactionType=${transactionType}`) as any
    return response
}

export const fetchHousesWithPagination = async (page: number, limit: number, sort: string, order: string, transactionType: "rental" | "mortgage" | "reservation" | "direct_purchase" | "") => {
    const response = await fetchApi.get(`/houses?page=${page}&limit=${limit}&sort=${sort}&order=${order}&transactionType=${transactionType}`) as any
    return response
}

export const fetchHousesAdvanced = async (params: FetchHousesParams) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);
    if (params.transactionType) queryParams.append('transactionType', params.transactionType);
    if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.location) queryParams.append('location', params.location);
    if (params.category) queryParams.append('category', params.category);
    if (params.rooms !== undefined) queryParams.append('rooms', params.rooms.toString());
    if (params.bathrooms !== undefined) queryParams.append('bathrooms', params.bathrooms.toString());
    if (params.parking !== undefined) queryParams.append('parking', params.parking.toString());
    if (params.capacity !== undefined) queryParams.append('capacity', params.capacity.toString());
    if (params.search) queryParams.append('search', params.search);
    
    const response = await fetchApi.get(`/houses?${queryParams.toString()}`) as any;
    return response;
}