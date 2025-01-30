// 引入 axios
import axios from "axios";


// 创建axios实例对象
const httptool = axios.create({
    baseURL: 'http://127.0.0.1:8000', // 服务器后端地址
})

//传送json格式的post请求
export const postRequest = (url, params) => {
    return httptool.post(
        `${url}`,
        params,
    )
}

//传送json格式的put请求
export const putRequest = (url, params) => {
    return httptool.put(
        `${url}`,
        params,
    )
}

//传送json格式的get请求
export const getRequest = (url) => {
    return httptool.get(
        `${url}`,
    )
}

//传送json格式的delete请求
export const deleteRequest = (url, params) => {
    return httptool.delete(
        `${url}`,
        params,
    )
}
