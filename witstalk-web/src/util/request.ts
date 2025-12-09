import requesterAxios from "~/util/requesterAxios";
import type {AxiosRequestConfig} from "axios";

/**
 * 适用于swr的请求体参数
 */
export interface requestParams {
    url: string,
    method: string,
    data?: any,
}

/**
 * axios请求器封装
 * @param config axios原生请求配置
 */
export const request = (config: AxiosRequestConfig) => {
    return requesterAxios(config);
}

/**
 * 适配于swr的请求器fetch
 * @param url 地址
 * @param param 参数
 */
export const axios = async (url: string, param: requestParams) => {
    const data = {
        url: url,
        method: param.method,
        data: null,
        params: null
    }
    if (param.method.toUpperCase() === "GET" || param.method.toUpperCase() === "PUT") {
        data['params'] = param.data;
    } else {
        data['data'] = param.data;
    }
    const res = await requesterAxios(data);
    return res.data;
}
