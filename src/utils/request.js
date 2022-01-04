/*
 * @Author: Mr.Tian
 * @Date: 2021-12-15 11:22:00
 * @LastEditTime: 2021-12-31 15:15:04
 * @LastEditors: Mr.Tian
 * @Description: 
 */
import axios from 'axios';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        if (localStorage.getItem('token')) {
            config.headers.authorization = 'Bearer ' + localStorage.getItem('token');
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (200 <= response.status < 300) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        if (401 <= error.response.status <= 403) {
            return error.response.data;
        } else {
            return Promise.reject();
        }
    }
);

export default service;
