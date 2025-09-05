import axios from 'axios';

import { API_BASE_URL } from './apiPaths';

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                window.location.href = '/login';
            }
            else if (error.response.status === 500) {
                console.log("Server error, try again", error);
            }
        }
        else if (error.code === 'ECONNABORTED') {
            console.log("Request timed out, try again", error);
        }
        return Promise.reject(error);
    }
);