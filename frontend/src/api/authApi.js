import axios from 'axios';

const authApi = axios.create({
    baseURL: process.env.VUE_APP_BACKEND_API + '/auth',
});

export default authApi;