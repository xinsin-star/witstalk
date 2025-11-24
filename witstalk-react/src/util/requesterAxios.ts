import axios from "axios";
import {showMessage} from "~/util/msg";
import {aesEncrypt, generateAesKeyAndIv} from "~/util/encryption.ts";

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const instance = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: import.meta.env.VITE_APP_BASE_API,
    // 超时
    timeout: 1000000
})
const responseInterceptors = (response) => {
    const token = response.headers.token;
    if (token) {
        window.localStorage.setItem("token", 'Bearer ' + token);
    }
    return response;
};
const responseInterceptorsError = (error) => {
    if (error.response && error.response.status === 403) {
        showMessage.error("没有权限访问该资源，请联系管理员！")
    } else if (error.response && error.response.status === 500) {

    } else {
        // 其他错误处理
        console.error("请求错误:", error.message);
    }
    return Promise.reject(error);
}
instance.interceptors.response.use(responseInterceptors, responseInterceptorsError);
const requestInterceptors = (request) => {
    // 请求前加密 key 44 iv 24
    // false为params有值 true为data有值
    let flag = !request.params
    let data = request.params || request.data || {}
    const {key, iv} = generateAesKeyAndIv()
    let encodeRequestData = aesEncrypt(JSON.stringify(aesEncrypt), key, iv)

    const token = window.localStorage.getItem("token");
    if (request.headers) {
        request.headers["Authorization"] = token;
    } else {
        request.headers = {"Authorization": token};
    }
    return request;
};
instance.interceptors.request.use(requestInterceptors);

export default instance;
