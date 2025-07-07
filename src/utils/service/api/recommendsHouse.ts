/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchApi } from "@/core/interceptore/fetchApi"

export const getRecommendsHouse = async (userId: string) => {
    const response = await fetchApi.get(`/recommendations/${userId}`) as any
    return response
}