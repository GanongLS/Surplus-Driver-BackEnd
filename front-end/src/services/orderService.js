import axios from "axios";
import authService from "./authService";

import { API_BASE_URL } from "../config/api";

const API_URL = API_BASE_URL;

// Add token to requests
axios.interceptors.request.use(config => {
	const user = authService.getCurrentUser();
	if (user && user.token) {
		config.headers.Authorization = `Bearer ${user.token}`;
	}
	return config;
});

const getOrders = async (params = {}) => {
	const response = await axios.get(`${API_URL}/admin/orders`, { params });
	return response.data;
};

const updateOrderStatus = async (id, status) => {
	const response = await axios.put(`${API_URL}/admin/orders/${id}`, { status });
	return response.data;
};

const createOrder = async orderData => {
	const response = await axios.post(`${API_URL}/admin/orders`, orderData);
	return response.data;
};

const updateOrder = async (id, orderData) => {
	const response = await axios.put(`${API_URL}/admin/orders/${id}`, orderData);
	return response.data;
};

export default {
	getOrders,
	updateOrderStatus,
	createOrder,
	updateOrder,
};
