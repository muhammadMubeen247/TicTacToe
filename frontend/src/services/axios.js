import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5174/api',
    withCredentials: true,
})

export default axiosInstance;