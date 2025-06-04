// api.ts
import axios from "axios";
import { API } from "@shared/constants/constants";
export const api = axios.create({
    baseURL: API,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        // приводим старые заголовки к Record<string,string>,
        // добавляем Authorization и обратно кастим в нужный тип
        const raw = config.headers;
        config.headers = {
            ...raw,
            Authorization: `Token ${token}`,
        };
    }
    return config;
});
