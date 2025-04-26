import axios from "axios";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

export const createUser = async (userData: any) => {
    return axios.post(`${USER_SERVICE_URL}/users`, userData);
};

export const getUser = async (userId: string) => {
    return axios.get(`${USER_SERVICE_URL}/users/${userId}`);
};

export const getUsers = async () => {
    return axios.get(`${USER_SERVICE_URL}/users/`);
};