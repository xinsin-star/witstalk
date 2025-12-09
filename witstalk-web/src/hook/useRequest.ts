import useSWR from "swr";
import {axios, type requestParams} from "~/util/request.ts";

export const useRequest = (param: requestParams) => {
    return useSWR([param.url, param], ([url, param]) => axios(url, param));
}
