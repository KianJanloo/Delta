import { fetchApi } from "@/core/interceptore/fetchApi"
import { IDiscount } from "@/types/discount-type/discount-type"

const findDiscount = async (code: string) => {
    const response = await fetchApi.get(`/discount-codes?page=1&limit=1&code=${code}`) as IDiscount[]
    return response
}

export default findDiscount