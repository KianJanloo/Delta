/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchApi } from "@/core/interceptore/fetchApi"
import { IHouse } from "@/types/houses-type/house-type";

export const getHouses = async (
    transactionType: string,
    search: string,
    order: "ASC" | "DESC",
    sort: string,
    location?: string,
    propertyType?: string,
    minPrice?: number | "",
    maxPrice?: number | "",
    minRent?: number | "",
    maxRent?: number | "",
    minMortgage?: number | "",
    maxMortgage?: number | "",
    minArea?: number | "",
    maxArea?: number | "",
) => {
    const url =
        `/houses?limit=10&transactionType=${transactionType}` +
        `&search=${encodeURIComponent(search)}` +
        `&order=${order}` +
        `&sort=${sort}` +
        `&propertyType=${propertyType || ''}` +
        `&location=${encodeURIComponent(location ?? '')}` +
        (minPrice === 0 ? "" : minPrice !== '' ? `&minPrice=${minPrice}` : '') +
        (maxPrice === 0 ? "" : maxPrice !== '' ? `&maxPrice=${maxPrice}` : '') +
        (minRent !== '' ? `&minRent=${minRent}` : '') +
        (maxRent !== '' ? `&maxRent=${maxRent}` : '') +
        (minMortgage !== '' ? `&minMortgage=${minMortgage}` : '') +
        (maxMortgage !== '' ? `&maxMortgage=${maxMortgage}` : '') +
        (minArea !== '' ? `&minArea=${minArea}` : '') +
        (maxArea !== '' ? `&maxArea=${maxArea}` : '');
    const response = await fetchApi.get(url) as IHouse[];
    return response
}

export const getHouseById = async (id: string) => {
    const url = `/houses/${id}`
    const response = await fetchApi.get(url) as IHouse
    return response
}
