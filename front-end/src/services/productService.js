import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:3070/api/v1";

// Add auth token to requests
axios.interceptors.request.use(config => {
	const user = authService.getCurrentUser();
	if (user && user.token) {
		config.headers.Authorization = `Bearer ${user.token}`;
	}
	return config;
});

const getProducts = async (availableOnly = false) => {
	const response = await axios.get(
		`${API_URL}/admin/products${availableOnly ? "?available=true" : ""}`,
	);
	return response.data;
};

const createProduct = async name => {
	const response = await axios.post(`${API_URL}/admin/products`, { name });
	return response.data;
};

const toggleProductStatus = async (id, is_available) => {
	const response = await axios.put(`${API_URL}/admin/products/${id}`, { is_available });
	return response.data;
};

export default {
	getProducts,
	createProduct,
	toggleProductStatus,
};
