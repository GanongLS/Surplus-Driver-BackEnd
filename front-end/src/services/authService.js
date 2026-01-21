import axios from "axios";

const API_URL = "http://localhost:3070/api/v1";

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
