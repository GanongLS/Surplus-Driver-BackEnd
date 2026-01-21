import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import orderService from "../services/orderService";
import authService from "../services/authService";

const HistoryPage = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			const data = await orderService.getOrders();
			// Filter for 'SELESAI' status
			const completedOrders = data.filter(order => order.status === "SELESAI");
			setOrders(completedOrders);
		} catch (err) {
			console.error("Failed to fetch orders", err);
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		authService.logout();
		window.location.href = "/";
	};

	return (
		<div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
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
						← Back to Dashboard
					</Link>
					<h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>Order History</h1>
				</div>
				<button
					onClick={handleLogout}
					className="btn"
					style={{ background: "rgba(255,255,255,0.1)", color: "white" }}>
					Logout
				</button>
			</div>

			<div
				className="glass-panel"
				style={{ padding: "1.5rem", borderRadius: "1rem", overflowX: "auto" }}>
				<h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Completed Orders</h2>

				{loading ? (
					<p style={{ textAlign: "center", color: "var(--text-dim)" }}>Loading history...</p>
				) : orders.length === 0 ? (
					<p style={{ textAlign: "center", color: "var(--text-dim)", padding: "2rem" }}>
						No completed orders yet.
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
								<th style={{ padding: "1rem" }}>Status</th>
								<th style={{ padding: "1rem" }}>Completed At</th>
							</tr>
						</thead>
						<tbody>
							{orders.map(order => (
								<tr key={order.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
									<td style={{ padding: "1rem" }}>#{order.id}</td>
									<td style={{ padding: "1rem" }}>{order.customer_name}</td>
									<td style={{ padding: "1rem" }}>{order.customer_address}</td>
									<td style={{ padding: "1rem" }}>{order.juice_type}</td>
									<td style={{ padding: "1rem" }}>{order.quantity}</td>
									<td style={{ padding: "1rem" }}>
										<span style={{ color: "var(--success)" }}>✔ Completed</span>
									</td>
									<td style={{ padding: "1rem", color: "var(--text-dim)" }}>
										{/* Placeholder date as API doesn't return completed_at yet, using created_at for now or static */}
										{new Date().toLocaleDateString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};

export default HistoryPage;
