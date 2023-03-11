import axios from 'axios';

const contentApi = axios.create({
    baseURL: process.env.VUE_APP_BACKEND_API,
});

contentApi.interceptors.request.use(function (config) {
    const storageToken = localStorage.getItem('token');
    if (storageToken) {
        config.headers.Authorization = `Bearer ${ storageToken }`;
    }
    return config;
});

export default contentApi;