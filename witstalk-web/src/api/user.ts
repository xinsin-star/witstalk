import { request } from '~/util/request';

export const login = (username: string, password: string) => {
    return request({
        url: '/auth/login',
        method: 'POST',
        data: {
          username,
          password
        }
    })
}
export const register = (username: string, password: string, nickname: string, email: string) => {
    return request({
        url: '/auth/register',
        method: 'POST',
        data: {
          username,
          nickName: nickname,
          password,
          email
        }
    })
}
export const userInfo = () => {
    return request({
        url: '/auth/userInfo',
        method: 'POST',
    })
}
