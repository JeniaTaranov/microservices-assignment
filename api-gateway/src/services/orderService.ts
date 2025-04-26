import axios from "axios";

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL;

export const createOrder = async (orderData: any) => {
    return axios.post(`${ORDER_SERVICE_URL}/orders`, orderData);
};

export const getOrdersByUserId = async (userId: string) => {
    return axios.get(`${ORDER_SERVICE_URL}/orders/user/${userId}`);
};
