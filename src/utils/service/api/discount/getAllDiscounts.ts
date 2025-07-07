import { fetchApi } from "@/core/interceptore/fetchApi"

const getAllDiscounts = async () => {
    const response = await fetchApi.get("/discount-code?page=1&limit=10");
    return response;
}

export default getAllDiscounts;