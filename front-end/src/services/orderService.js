import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:3070/api/v1";

// Add token to requests
axios.interceptors.request.use(config => {
	const user = authService.getCurrentUser();
	if (user && user.token) {
		config.headers.Authorization = `Bearer ${user.token}`;
	}
	return config;
});

const getOrders = async () => {
	const response = await axios.get(`${API_URL}/admin/orders`);
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
