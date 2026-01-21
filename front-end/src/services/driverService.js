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

const getAllDrivers = async () => {
	const response = await axios.get(`${API_URL}/admin/drivers`);
	return response.data;
};

const updateDriverStatus = async (id, is_active) => {
	const response = await axios.put(`${API_URL}/admin/drivers/${id}`, { is_active });
	return response.data;
};

const createDriver = async driverData => {
	const response = await axios.post(`${API_URL}/admin/drivers`, driverData);
	return response.data;
};

export default {
	getAllDrivers,
	updateDriverStatus,
	createDriver,
};
