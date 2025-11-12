/* eslint-disable */
import axios, { AxiosResponse, AxiosError } from "axios";
import { getSession } from "next-auth/react";
import { API_BASE_URL } from "@/core/config/constants";
import { refreshSession } from "./tokenRefresh";

const axiosApi = axios.create({
    baseURL: API_BASE_URL,
});

const onSuccess = (response: AxiosResponse) => {
    return response.data;
}

const onError = async (err: AxiosError) => {
    const status = err.response?.status;
    const originalRequest: any = err.config;

    if ((status === 401 || status === 403) && !originalRequest?._retry) {
        originalRequest._retry = true;

        const refreshed = await refreshSession();

        if (refreshed?.accessToken) {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['Authorization'] = `Bearer ${refreshed.accessToken}`;
            return axiosApi(originalRequest);
        }
    }

    return Promise.reject(err);
}

axiosApi.interceptors.response.use(onSuccess, onError);

axiosApi.interceptors.request.use(async (opt) => {
    const session = await getSession();
    const token = (session as any)?.accessToken as string | undefined;

    if (token) {
        opt.headers = opt.headers || {};
        opt.headers.Authorization = 'Bearer ' + token;
    }
    return opt;
});

export default axiosApi;
