import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import orderService from "../services/orderService";
import authService from "../services/authService";

const DashboardPage = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [formData, setFormData] = useState({
		customer_name: "",
		customer_address: "",
		juice_type: "Orange Juice",
		quantity: 1,
		latitude: "",
		longitude: "",
	});

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			const data = await orderService.getOrders();
			setOrders(data);
		} catch (err) {
			console.error("Failed to fetch orders", err);
		} finally {
			setLoading(false);
		}
	};

	const handleStatusUpdate = async (id, newStatus) => {
		try {
			await orderService.updateOrderStatus(id, newStatus);
			fetchOrders(); // Refresh
		} catch (err) {
			alert("Failed to update status");
		}
	};

	const handleLogout = () => {
		authService.logout();
		window.location.href = "/";
	};

	const getStatusColor = status => {
		switch (status) {
			case "MENUNGGU":
				return "var(--warning)";
			case "DITERIMA":
				return "#3b82f6";
			case "DALAM_PERJALANAN":
				return "#8b5cf6";
			case "SELESAI":
				return "var(--success)";
			default:
				return "var(--text-dim)";
		}
	};

	const openCreateModal = () => {
		setIsEditing(false);
		setFormData({
			customer_name: "",
			customer_address: "",
			juice_type: "Orange Juice",
			quantity: 1,
			latitude: "",
			longitude: "",
		});
		setShowModal(true);
	};

	const openEditModal = order => {
		setIsEditing(true);
		setSelectedOrder(order);
		setFormData({
			customer_name: order.customer_name,
			customer_address: order.customer_address,
			juice_type: order.juice_type,
			quantity: order.quantity,
			latitude: order.latitude || "",
			longitude: order.longitude || "",
		});
		setShowModal(true);
	};

	const handleSubmit = async e => {
		e.preventDefault();

		// Sanitize data: convert empty strings to null for numeric/decimal fields
		const payload = {
			...formData,
			latitude: formData.latitude === "" ? null : formData.latitude,
			longitude: formData.longitude === "" ? null : formData.longitude,
			quantity: parseInt(formData.quantity), // Ensure integer
		};

		try {
			if (isEditing) {
				await orderService.updateOrder(selectedOrder.id, payload);
			} else {
				await orderService.createOrder(payload);
			}
			setShowModal(false);
			fetchOrders();
		} catch (err) {
			console.error(err);
			alert(err.response?.data?.message || "Failed to save order");
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
				<h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Dashboard</h1>
				<div style={{ display: "flex", gap: "1rem" }}>
					<button
						onClick={openCreateModal}
						className="btn btn-primary"
						style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
						+ New Order
					</button>
					<Link
						to="/history"
						className="btn"
						style={{
							background: "rgba(255,255,255,0.05)",
							color: "white",
							textDecoration: "none",
							display: "flex",
							alignItems: "center",
						}}>
						History
					</Link>
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
				<h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Active Orders</h2>

				{loading ? (
					<p style={{ textAlign: "center", color: "var(--text-dim)" }}>Loading orders...</p>
				) : orders.length === 0 ? (
					<p style={{ textAlign: "center", color: "var(--text-dim)", padding: "1rem" }}>
						No active orders.
					</p>
				) : (
					<table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
						<thead>
							<tr
								style={{ color: "var(--text-dim)", borderBottom: "1px solid var(--glass-border)" }}>
								<th style={{ padding: "1rem" }}>ID</th>
								<th style={{ padding: "1rem" }}>Customer</th>
								<th style={{ padding: "1rem" }}>Address</th>
								<th style={{ padding: "1rem" }}>Item</th>
								<th style={{ padding: "1rem" }}>Qty</th>
								<th style={{ padding: "1rem" }}>Date</th>
								<th style={{ padding: "1rem" }}>Status</th>
								<th style={{ padding: "1rem" }}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{orders.map(order => (
								<tr key={order.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
									<td style={{ padding: "1rem" }}>#{order.id}</td>
									<td style={{ padding: "1rem" }}>{order.customer_name}</td>
									<td
										style={{
											padding: "1rem",
											maxWidth: "200px",
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis",
										}}>
										{order.customer_address}
									</td>
									<td style={{ padding: "1rem" }}>{order.juice_type}</td>
									<td style={{ padding: "1rem" }}>{order.quantity}</td>
									<td
										style={{
											padding: "1rem",
											whiteSpace: "nowrap",
											color: "#94a3b8",
											fontSize: "0.875rem",
										}}>
										{new Date(order.created_at).toLocaleString()}
									</td>
									<td style={{ padding: "1rem" }}>
										<span
											style={{
												padding: "0.25rem 0.75rem",
												borderRadius: "1rem",
												fontSize: "0.75rem",
												background: `${getStatusColor(order.status)}20`,
												color: getStatusColor(order.status),
												border: `1px solid ${getStatusColor(order.status)}40`,
											}}>
											{order.status}
										</span>
									</td>

									<td style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}>
										{order.status === "MENUNGGU" && (
											<button
												className="btn"
												style={{
													fontSize: "0.75rem",
													padding: "0.5rem 1rem",
													background: "rgba(255,255,255,0.1)",
													color: "white",
												}}
												onClick={() => openEditModal(order)}>
												Edit
											</button>
										)}
										{order.status === "MENUNGGU" && (
											<button
												className="btn btn-primary"
												style={{ fontSize: "0.75rem", padding: "0.5rem 1rem" }}
												onClick={() => handleStatusUpdate(order.id, "DITERIMA")}>
												Accept
											</button>
										)}
										{order.status === "DITERIMA" && (
											<button
												className="btn"
												style={{
													fontSize: "0.75rem",
													padding: "0.5rem 1rem",
													background: "#8b5cf6",
													color: "white",
												}}
												onClick={() => handleStatusUpdate(order.id, "DALAM_PERJALANAN")}>
												Ship
											</button>
										)}
										{order.status === "DALAM_PERJALANAN" && (
											<button
												className="btn"
												style={{
													fontSize: "0.75rem",
													padding: "0.5rem 1rem",
													background: "var(--success)",
													color: "white",
												}}
												onClick={() => handleStatusUpdate(order.id, "SELESAI")}>
												Complete
											</button>
										)}
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
						justifyContent: "center",
						alignItems: "center",
						zIndex: 1000,
						backdropFilter: "blur(5px)",
					}}>
					<div
						className="glass-panel"
						style={{
							padding: "2rem",
							borderRadius: "1rem",
							width: "100%",
							maxWidth: "500px",
							background: "#1e293b",
							color: "white",
						}}>
						<h2 style={{ marginBottom: "1.5rem" }}>{isEditing ? "Edit Order" : "New Order"}</h2>
						<form onSubmit={handleSubmit}>
							<div style={{ marginBottom: "1rem" }}>
								<label style={{ display: "block", marginBottom: "0.5rem", color: "#94a3b8" }}>
									Customer Name
								</label>
								<input
									type="text"
									className="input-field"
									required
									value={formData.customer_name}
									onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
								/>
							</div>
							<div style={{ marginBottom: "1rem" }}>
								<label style={{ display: "block", marginBottom: "0.5rem", color: "#94a3b8" }}>
									Address
								</label>
								<input
									type="text"
									className="input-field"
									required
									value={formData.customer_address}
									onChange={e => setFormData({ ...formData, customer_address: e.target.value })}
								/>
							</div>
							<div style={{ display: "flex", gap: "1rem" }}>
								<div style={{ marginBottom: "1rem", flex: 1 }}>
									<label style={{ display: "block", marginBottom: "0.5rem", color: "#94a3b8" }}>
										Item
									</label>
									<select
										className="input-field"
										value={formData.juice_type}
										onChange={e => setFormData({ ...formData, juice_type: e.target.value })}
										style={{ background: "#0f172a", color: "white" }}>
										<option value="Orange Juice">Orange Juice</option>
										<option value="Apple Juice">Apple Juice</option>
										<option value="Mango Juice">Mango Juice</option>
										<option value="Guava Juice">Guava Juice</option>
									</select>
								</div>
								<div style={{ marginBottom: "1rem", width: "100px" }}>
									<label style={{ display: "block", marginBottom: "0.5rem", color: "#94a3b8" }}>
										Qty
									</label>
									<input
										type="number"
										min="1"
										className="input-field"
										required
										value={formData.quantity}
										onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
									/>
								</div>
							</div>
							<div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
								<button
									type="button"
									className="btn"
									style={{ background: "rgba(255,255,255,0.1)", color: "white", flex: 1 }}
									onClick={() => setShowModal(false)}>
									Cancel
								</button>
								<button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
									{isEditing ? "Update" : "Create"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default DashboardPage;
