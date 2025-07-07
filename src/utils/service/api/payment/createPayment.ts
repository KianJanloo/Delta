import { fetchApi } from "@/core/interceptore/fetchApi"
import { ICreatePayment } from "@/types/payment-type/payment-type";

export const createPayment = async (data: ICreatePayment) => {
    const response = await fetchApi.post("/payments", data);
    return response
}