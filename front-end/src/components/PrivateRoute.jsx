import React from "react";
import { Navigate } from "react-router-dom";
import authService from "../services/authService";

const PrivateRoute = ({ children }) => {
	const user = authService.getCurrentUser();
	return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
