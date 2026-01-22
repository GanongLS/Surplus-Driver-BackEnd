import axios from "axios";

import { API_BASE_URL } from "../config/api";

const API_URL = API_BASE_URL;

const login = async (username, password) => {
	const response = await axios.post(`${API_URL}/admin/auth/login`, {
		username,
		password,
	});
	if (response.data.token) {
		localStorage.setItem("user", JSON.stringify(response.data));
	}
	return response.data;
};

const logout = () => {
	localStorage.removeItem("user");
};

const getCurrentUser = () => {
	return JSON.parse(localStorage.getItem("user"));
};

export default {
	login,
	logout,
	getCurrentUser,
};
