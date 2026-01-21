import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import DriversPage from "./pages/DriversPage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route
					path="/dashboard"
					element={
						<PrivateRoute>
							<DashboardPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/history"
					element={
						<PrivateRoute>
							<HistoryPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/drivers"
					element={
						<PrivateRoute>
							<DriversPage />
						</PrivateRoute>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
