import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import driverService from "../services/driverService";
import authService from "../services/authService";

const DriversPage = () => {
	const [drivers, setDrivers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		email: "",
		password: "",
	});

	useEffect(() => {
		fetchDrivers();
	}, []);

	const fetchDrivers = async () => {
		try {
			const data = await driverService.getAllDrivers();
			setDrivers(data);
		} catch (err) {
			console.error("Failed to fetch drivers", err);
		} finally {
			setLoading(false);
		}
	};

	const handleToggleStatus = async driver => {
		try {
			await driverService.updateDriverStatus(driver.id, !driver.is_active);
			fetchDrivers();
		} catch (err) {
			alert("Failed to update status");
		}
	};

	const handleLogout = () => {
		authService.logout();
		window.location.href = "/";
	};

	const handleInputChange = e => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			await driverService.createDriver(formData);
			setShowModal(false);
			setFormData({ name: "", phone: "", email: "", password: "" }); // Reset form
			fetchDrivers(); // Refresh list
		} catch (err) {
			alert("Failed to create driver. Email or Phone might already exist.");
		}
	};

	return (
		<div
			style={{
				padding: "2rem",
				width: "95%",
				maxWidth: "1400px",
				margin: "0 auto",
				color: "white",
			}}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "2rem",
				}}>
				<div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
					<Link
						to="/dashboard"
						className="btn"
						style={{
							background: "rgba(255,255,255,0.05)",
							color: "white",
							textDecoration: "none",
						}}>
						← Dashboard
					</Link>
					<h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>Drivers Management</h1>
				</div>
				<div style={{ display: "flex", gap: "1rem" }}>
					<button
						onClick={() => setShowModal(true)}
						className="btn btn-primary"
						style={{
							background: "rgba(16, 185, 129, 0.4)",
							color: "white",
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
						}}>
						+ Add Driver
					</button>
					<button
						onClick={handleLogout}
						className="btn"
						style={{ background: "rgba(255,255,255,0.1)", color: "white" }}>
						Logout
					</button>
				</div>
			</div>

			<div
				className="glass-panel"
				style={{ padding: "1.5rem", borderRadius: "1rem", overflowX: "auto" }}>
				{loading ? (
					<p style={{ textAlign: "center", color: "var(--text-dim)" }}>Loading drivers...</p>
				) : drivers.length === 0 ? (
					<p style={{ textAlign: "center", color: "var(--text-dim)", padding: "2rem" }}>
						No drivers found.
					</p>
				) : (
					<table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
						<thead>
							<tr
								style={{ color: "var(--text-dim)", borderBottom: "1px solid var(--glass-border)" }}>
								<th style={{ padding: "1rem" }}>ID</th>
								<th style={{ padding: "1rem" }}>Name</th>
								<th style={{ padding: "1rem" }}>Email</th>
								<th style={{ padding: "1rem" }}>Phone</th>
								<th style={{ padding: "1rem" }}>Joined</th>
								<th style={{ padding: "1rem" }}>Status</th>
								<th style={{ padding: "1rem" }}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{drivers.map(driver => (
								<tr key={driver.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
									<td style={{ padding: "1rem" }}>#{driver.id}</td>
									<td style={{ padding: "1rem" }}>{driver.name}</td>
									<td style={{ padding: "1rem" }}>{driver.email}</td>
									<td style={{ padding: "1rem" }}>{driver.phone}</td>
									<td style={{ padding: "1rem", color: "#94a3b8", fontSize: "0.875rem" }}>
										{new Date(driver.created_at).toLocaleDateString()}
									</td>
									<td style={{ padding: "1rem" }}>
										<span
											style={{
												padding: "0.25rem 0.75rem",
												borderRadius: "1rem",
												fontSize: "0.75rem",
												background: driver.is_active
													? "rgba(16, 185, 129, 0.2)"
													: "rgba(239, 68, 68, 0.2)",
												color: driver.is_active ? "#10b981" : "#ef4444",
												border: `1px solid ${driver.is_active ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)"}`,
											}}>
											{driver.is_active ? "Active" : "Inactive"}
										</span>
									</td>
									<td style={{ padding: "1rem" }}>
										<button
											className="btn"
											onClick={() => handleToggleStatus(driver)}
											style={{
												fontSize: "0.75rem",
												padding: "0.5rem 1rem",
												background: driver.is_active
													? "rgba(239, 68, 68, 0.2)"
													: "rgba(16, 185, 129, 0.2)",
												color: driver.is_active ? "#fca5a5" : "#6ee7b7",
												border: "none",
											}}>
											{driver.is_active ? "Deactivate" : "Activate"}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>

			{showModal && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: "rgba(0,0,0,0.8)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 1000,
					}}>
					<div
						className="glass-panel"
						style={{
							background: "#1e1e1e",
							padding: "2rem",
							borderRadius: "1rem",
							width: "90%",
							maxWidth: "500px",
							border: "1px solid var(--glass-border)",
						}}>
						<h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>Add New Driver</h2>
						<form
							onSubmit={handleSubmit}
							style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
							<input
								type="text"
								name="name"
								placeholder="Full Name"
								value={formData.name}
								onChange={handleInputChange}
								required
								style={{
									padding: "0.75rem",
									borderRadius: "0.5rem",
									background: "rgba(255,255,255,0.05)",
									border: "1px solid var(--glass-border)",
									color: "white",
								}}
							/>
							<input
								type="email"
								name="email"
								placeholder="Email"
								value={formData.email}
								onChange={handleInputChange}
								required
								style={{
									padding: "0.75rem",
									borderRadius: "0.5rem",
									background: "rgba(255,255,255,0.05)",
									border: "1px solid var(--glass-border)",
									color: "white",
								}}
							/>
							<input
								type="tel"
								name="phone"
								placeholder="Phone Number"
								value={formData.phone}
								onChange={handleInputChange}
								required
								style={{
									padding: "0.75rem",
									borderRadius: "0.5rem",
									background: "rgba(255,255,255,0.05)",
									border: "1px solid var(--glass-border)",
									color: "white",
								}}
							/>
							<input
								type="password"
								name="password"
								placeholder="Password"
								value={formData.password}
								onChange={handleInputChange}
								required
								style={{
									padding: "0.75rem",
									borderRadius: "0.5rem",
									background: "rgba(255,255,255,0.05)",
									border: "1px solid var(--glass-border)",
									color: "white",
								}}
							/>
							<div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
								<button
									type="button"
									onClick={() => setShowModal(false)}
									className="btn"
									style={{ flex: 1, background: "rgba(255,255,255,0.1)", color: "white" }}>
									Cancel
								</button>
								<button
									type="submit"
									className="btn"
									style={{ flex: 1, background: "#10b981", color: "white" }}>
									Create Driver
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default DriversPage;
